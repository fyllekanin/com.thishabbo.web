<?php

namespace App\Http\Controllers;

use App\Constants\CategoryOptions;
use App\Constants\CategoryTemplates;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\Constants\SeasonRules;
use App\Constants\SettingsKeys;
use App\Constants\Shop\ShopItemTypes;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\HabboBadge;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Notice;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Helpers\UserHelper;
use App\Models\User\CustomUserFields;
use App\Providers\Service\ContentService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\GroupRepository;
use App\Repositories\Repository\PageRepository;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\UserRepository;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PageController extends Controller {
    private $myContentService;
    private $mySettingRepository;
    private $myPageRepository;
    private $myGroupRepository;
    private $myUserRepository;
    private $myCategoryRepository;

    public function __construct(
        ContentService $contentService,
        SettingRepository $settingRepository,
        PageRepository $pageRepository,
        GroupRepository $groupRepository,
        UserRepository $userRepository,
        CategoryRepository $categoryRepository
    ) {
        parent::__construct();
        $this->myContentService = $contentService;
        $this->mySettingRepository = $settingRepository;
        $this->myPageRepository = $pageRepository;
        $this->myGroupRepository = $groupRepository;
        $this->myUserRepository = $userRepository;
        $this->myCategoryRepository = $categoryRepository;
    }
    
    public function serveApp() {
        try {
            $headers = [
                'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => 'Fri, 01 Jan 1990 00:00:00 GMT'
            ];
            return response()->file(base_path('ui.html'), $headers);
        } catch (Exception $exception) {
            return response(null, 404);
        }
    }

    public function createErrorEntry(Request $request) {
        $user = $request->get('auth');
        $fixedContent = preg_replace("/([\r\n]{4,}|[\n]{2,}|[\r]{2,})/", "\n", $request->input('stack'));
        $userText = $user->userId > 0 ? $user->nickname.' - #'.$user->nickname : 'Unknown';
        Log::channel('javascript')->error(
            '
[b]User[/b]:
'.$userText.'
[b]Message[/b]:
'.$request->input('message').'
[b]Stacktrace[/b]:
'.$fixedContent.'
######################################################################################'
        );
    }

    public function getVersions($page) {
        $folderNames = Iterables::filter(scandir($this->mySettingRepository->getResourcePath('commit-logs')), function ($folder) {
            return preg_match('/[0-9]+.[0-9]+.[0-9]+/', $folder);
        });
        usort($folderNames, 'version_compare');
        $folderNames = array_reverse($folderNames);

        $versions = array_map(function ($folder) {
            return (object) [
                'version' => $folder,
                'changes' => $this->getCommitLogChanges($folder)
            ];
        },
            $folderNames);
        $versions = Iterables::filter($versions, function ($version) {
            return count($version->changes) > 0;
        });

        $total = PaginationUtil::getTotalPages(count($versions));
        $offset = PaginationUtil::getOffset($page);
        $items = array_slice($versions, $offset, $this->perPage);

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'items' => $items
            ]
        );
    }

    public function getSeason($season) {
        $allSeasons = $this->getAllSeasons();
        if ($season == 'current') {
            $season = $allSeasons->last()->season;
        }
        $range = $this->getStartAndEndForSeason($season);

        return response()->json(
            [
                'seasons' => $allSeasons,
                'season' => $season,
                'start' => $range->start,
                'end' => $range->end,
                'stats' => $this->getSeasonStats($range->start, $range->end)
            ]
        );
    }

    /**
     * @return JsonResponse
     */
    public function getGroupList() {
        $groupLists = $this->myGroupRepository->getGroupListsOrdered()->map(function ($groupList) {
            $group = $this->myGroupRepository->getGroupById($groupList->groupId);

            return (object) [
                'name' => isset($group->nickname) && $group->nickname ? $group->nickname : $group->name,
                'color' => $groupList->color,
                'users' => $this->myGroupRepository->getUserIdsWithGroupId($group->groupId)->map(function ($userId) {
                    $userData = $this->myUserRepository->getUserDataForUserId($userId);
                    $customFields = new CustomUserFields($userData->customFields);
                    $user = UserHelper::getSlimUser($userId);
                    $user->role = $customFields->role;
                    return $user;
                })
            ];
        });

        return response()->json($groupLists);
    }

    /**
     * @param $path
     *
     * @return JsonResponse
     */
    public function getCustomPage($path) {
        $page = $this->myPageRepository->getPageByPath($path);
        return response()->json(
            [
                'title' => $page ? $page->title : 'Not found',
                'content' => $page ? $this->myContentService->getParsedContent($page->content) : 'Page not found'
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function parseContent(Request $request) {
        $content = $request->input('content');
        return response()->json($this->myContentService->getParsedContent($content));
    }

    /**
     * Used for pages that don't load data to still see if they got connection
     *
     * @return JsonResponse
     */
    public function getPing() {
        return response()->json();
    }

    /**
     * Get request for fetching the current maintenance mode message
     *
     * @return JsonResponse
     */
    public function getMaintenanceMessage() {
        return response()->json(
            [
                'content' => $this->myContentService
                    ->getParsedContent($this->mySettingRepository->getValueOfSetting(SettingsKeys::MAINTENANCE_CONTENT))
            ]
        );
    }

    public function getBadges($page) {
        $threeDays = 259200;

        return response()->json(
            [
                'total' => PaginationUtil::getTotalPages(HabboBadge::count()),
                'page' => $page,
                'items' => HabboBadge::orderBy('createdAt', 'DESC')->skip(PaginationUtil::getOffset($page, 72))->take(72)->get()->map(
                    function ($item) use ($threeDays) {
                        return [
                            'habboBadgeId' => $item->habboBadgeId,
                            'description' => $item->description,
                            'isNew' => $item->createdAt->timestamp > (time() - $threeDays),
                            'createdAt' => $item->createdAt->timestamp
                        ];
                    }
                )
            ]
        );
    }

    /**
     * Get the home page resource
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getHomePage(Request $request) {
        $user = $request->get('auth');
        $threeDays = 259200;

        return response()->json(
            [
                'articles' => $this->getArticles($user, 4, CategoryTemplates::QUEST),
                'mediaArticles' => $this->getArticles($user, 5, CategoryTemplates::MEDIA),
                'notices' => $this->getNotices(),
                'threads' => $this->getLatestThreads($user),
                'badges' => HabboBadge::orderBy('createdAt', 'DESC')->take(12)->get()->map(
                    function ($item) use ($threeDays) {
                        return [
                            'habboBadgeId' => $item->habboBadgeId,
                            'description' => $item->description,
                            'isNew' => $item->createdAt->timestamp > (time() - $threeDays),
                            'createdAt' => $item->createdAt->timestamp
                        ];
                    }
                )
            ]
        );
    }

    /**
     * Get the resource for register page, used for helping the user validation
     * without doing extra requests.
     *
     * @return JsonResponse
     */
    public function getRegisterPage() {
        return response()->json(
            [
                'names' => User::getQuery()->get(['nickname'])
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getBadgeGuides(Request $request, $page) {
        $user = $request->get('auth');
        $perPage = 12;

        $accessibleCategoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $categoryIds = $this->myCategoryRepository->getCategoriesWithTemplate(CategoryTemplates::QUEST)
            ->filter(function ($category) use ($accessibleCategoryIds) {
                return $accessibleCategoryIds->contains($category->categoryId);
            })->map(function ($category) {
                return $category->categoryId;
            })->values();

        $threadsSql = Thread::isApproved()->orderBy('threadId', 'DESC')->whereIn('categoryId', $categoryIds);
        $total = PaginationUtil::getTotalPages($threadsSql->count('threadId'), $perPage);

        $items = $threadsSql->take($perPage)->skip(PaginationUtil::getOffset($page, $perPage))->get()->map(
            function ($item) {
                return $this->mapArticle($item);
            }
        );

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'items' => $items
            ]
        );
    }

    private function getLatestThreads($user) {
        $homePageCategoryIds = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::HOME_PAGE_THREADS);
        if (!is_array($homePageCategoryIds)) {
            return [];
        }
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ)
            ->filter(function ($categoryId) use ($homePageCategoryIds) {
                return in_array($categoryId, $homePageCategoryIds);
            });
        return Thread::whereIn('categoryId', $categoryIds)
            ->take(Controller::$perPageStatic)
            ->orderBy('threadId', 'DESC')
            ->with(['prefix'])
            ->get()
            ->map(function ($thread) {
                return [
                    'threadId' => $thread->threadId,
                    'title' => $thread->title,
                    'user' => UserHelper::getSlimUser($thread->userId),
                    'prefix' => $thread->prefix,
                    'createdAt' => $thread->createdAt->timestamp
                ];
            });
    }

    /**
     * Get an array of all the notices
     *
     * @return Notice[]|Collection
     */
    private function getNotices() {
        return Notice::orderBy('order', 'ASC')->get()->map(
            function ($notice) {
                $notice->makeHidden(['createdAt', 'updatedAt', 'userId', 'isDeleted']);
                $notice->text = nl2br(stripcslashes($notice->text));
                return $notice;
            }
        );
    }

    /**
     * Get an array of all available articles
     *
     * @param $user
     * @param $amount
     * @param $type
     *
     * @return array
     */
    private function getArticles($user, $amount, $type) {
        $accessibleCategoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $categoryIds = $this->myCategoryRepository->getCategoriesWithTemplate($type)
            ->filter(function ($category) use ($accessibleCategoryIds) {
                return $accessibleCategoryIds->contains($category->categoryId);
            })->map(function ($category) {
                return $category->categoryId;
            })->values();

        return Thread::isApproved()->orderBy('threadId', 'DESC')->whereIn('categoryId', $categoryIds)->take($amount)->get()->map(
            function ($item) {
                return $this->mapArticle($item);
            }
        );
    }

    /**
     * @param $thread
     *
     * @return array
     */
    private function mapArticle($thread) {
        $tags = isset($thread->templateData) ? $thread->templateData->getTags() : null;
        $badges = isset($thread->templateData) ? json_decode($thread->templateData->badges) : [];

        return [
            'threadId' => $thread->threadId,
            'badges' => $badges,
            'title' => $thread->title,
            'content' => $this->myContentService->getParsedContent($thread->content),
            'tags' => $tags,
            'user' => UserHelper::getSlimUser($thread->userId),
            'createdAt' => $thread->createdAt->timestamp,
            'updatedAt' => $thread->updatedAt->timestamp,
            'prefix' => $thread->prefix
        ];
    }

    private function getCommitLogChanges($folder) {
        $fileNames = Iterables::filter(
            scandir($this->mySettingRepository->getResourcePath('commit-logs/'.$folder)),
            function ($fileName) {
                return preg_match('/(.*?).json/', $fileName);
            }
        );

        return array_map(
            function ($fileName) use ($folder) {
                $file = File::get($this->mySettingRepository->getResourcePath('commit-logs/'.$folder.'/'.$fileName));
                return json_decode($file);
            },
            $fileNames
        );
    }

    private function getSeasonStats($start, $end) {
        function getData($query) {
            return $query->groupBy('userId')
                ->orderBy('number', 'DESC')
                ->take(10)
                ->getQuery()
                ->get()
                ->map(
                    function ($item) {
                        return [
                            'value' => $item->number,
                            'user' => UserHelper::getSlimUser($item->userId)
                        ];
                    }
                );
        }

        $boards = (object) [
            'posts' => [
                'title' => 'Posts',
                'data' => getData(
                    Post::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->select('userId', DB::raw('count(postId) AS number'))
                )
            ],

            'threads' => [
                'title' => 'Threads',
                'data' => getData(
                    Thread::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->select('userId', DB::raw('count(threadId) AS number'))
                )
            ],

            'threadsWithThreePages' => [
                'title' => 'Threads with 3 or more pages',
                'data' => getData(
                    Thread::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->where('posts', '>=', 30)
                        ->select('userId', DB::raw('count(threadId) AS number'))
                )
            ],

            'lootboxes' => [
                'title' => 'Most Lootboxes Bought',
                'data' => getData(
                    LogUser::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->where('action', LogType::getAction(LogType::OPENED_LOOT_BOX))
                        ->select('userId', DB::raw('count(logId) AS number'))
                )
            ],

            'badges' => [
                'title' => 'Most Badges Earned',
                'data' => getData(
                    UserItem::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->where('type', ShopItemTypes::BADGE)
                        ->select('userId', DB::raw('count(userItemId) AS number'))
                )
            ],

            'postlikes' => [
                'title' => 'Most Post Likes',
                'data' => getData(
                    PostLike::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->select('userId', DB::raw('count(postLikeId) AS number'))
                )
            ],

            'communitylikes' => [
                'title' => 'Most DJ/Host Likes',
                'data' => getData(
                    LogUser::where('createdAt', '>=', $start)
                        ->where('createdAt', '<=', $end)
                        ->whereIn('action', [LogType::getAction(LogType::LIKED_DJ), LogType::getAction(LogType::LIKED_HOST)])
                        ->select('userId', DB::raw('count(logId) AS number'))
                )
            ],
        ];

        $this->myCategoryRepository->getCategoriesWithOption(CategoryOptions::IS_STANDALONE_LEADERBOARD)
            ->each(function ($category) use ($boards, $start, $end) {
                $boards[$category->categoryId] = [
                    'title' => $category->title,
                    'data' => getData(
                        Thread::where('createdAt', '>=', $start)
                            ->where('categoryId', $category->categoryId)
                            ->where('createdAt', '<=', $end)
                            ->where('posts', '>=', 30)
                            ->select('userId', DB::raw('count(threadId) AS number'))
                    )
                ];
            });

        return $boards;
    }

    private function getAllSeasons() {
        $currenDate = time();
        $isBuilding = true;
        $seasons = collect();
        $season = 1;

        while ($isBuilding) {
            $range = $this->getStartAndEndForSeason($season);
            $seasons->push((object) [
                'season' => $season,
                'start' => $range->start,
                'end' => $range->end
            ]);
            $season++;

            if ($currenDate >= $range->start && $currenDate <= $range->end) {
                $isBuilding = false;
            }
        }

        return $seasons;
    }

    private function getStartAndEndForSeason($season) {
        $start = strtotime(SeasonRules::START) + ((SeasonRules::SEASON_LENGTH * $season) - SeasonRules::SEASON_LENGTH);
        $end = $start + SeasonRules::SEASON_LENGTH;
        return (object) [
            'start' => $start,
            'end' => $end
        ];
    }
}
