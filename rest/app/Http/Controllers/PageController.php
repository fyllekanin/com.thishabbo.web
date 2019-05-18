<?php

namespace App\Http\Controllers;

use App\EloquentModels\BBcode;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Group\GroupList;
use App\EloquentModels\Notice;
use App\EloquentModels\Page;
use App\EloquentModels\Theme;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Utils\BBcodeUtil;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;

class PageController extends Controller {
    private $categoryTemplates = null;

    /**
     * PageController constructor.
     * Store the possible category templates in instance variable
     */
    public function __construct() {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function loadInitial(Request $request) {
        $user = $request->get('auth');

        $navigation = null;
        try {
            $navigation = json_decode(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->navigation));
        } catch (\Exception $e) {
            $navigation = [];
        }

        $theme = Theme::where('themeId', Value::objectProperty($user, 'theme', 0))->orWhere('isDefault', true)->first();

        return response()->json([
            'navigation' => is_array($navigation) ? $navigation : [],
            'theme' => $theme ? $theme->minified : ''
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroupList() {
        return response()->json(GroupList::orderBy('displayOrder', 'ASC')->get()->map(function ($item) {
            return [
                'name' => $item->group->name,
                'color' => $item->color,
                'users' => $item->group->userGroup()->get()->map(function ($relation) {
                    return UserHelper::getSlimUser($relation->userId);
                })
            ];
        }));
    }

    /**
     * @param $path
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCustomPage($path) {
        $page = Page::whereRaw('lower(path) = ?', [strtolower($path)])->first();

        return response()->json([
            'title' => $page ? $page->title : 'Not found',
            'content' => $page ? BBcodeUtil::bbcodeParser($page->content) : 'Page not found'
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEmojis() {
        return response()->json(BBcode::where('isEmoji', true)->orderByRaw("RAND()")->get());
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function parseContent(Request $request) {
        $content = $request->input('content');

        return response()->json(BBcodeUtil::bbcodeParser($content));
    }

    /**
     * Used for pages that don't load data to still see if they got connection
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPing() {
        return response()->json();
    }

    /**
     * Get request for fetching the current maintenance mode message
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaintenanceMessage() {
        $settingKeys = ConfigHelper::getKeyConfig();
        return response()->json([
            'content' => BBcodeUtil::bbcodeParser(SettingsHelper::getSettingValue($settingKeys->maintenanceContent))
        ]);
    }

    /**
     * Get the home page resource
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHomePage(Request $request) {
        $user = $request->get('auth');

        return response()->json([
            'articles' => $this->getArticles($user, 4, $this->categoryTemplates->QUEST),
            'mediaArticles' => $this->getArticles($user, 5, $this->categoryTemplates->MEDIA),
            'notices' => $this->getNotices(),
            'threads' => $this->getLatestThreads($user)
        ]);
    }

    /**
     * Get the resource for register page, used for helping the user validation
     * without doing extra requests.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRegisterPage() {
        return response()->json([
            'names' => User::getQuery()->get(['nickname'])
        ]);
    }

    /**
     * @param Request $request
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBadgeGuides(Request $request, $page) {
        $user = $request->get('auth');
        $perPage = 12;

        $categories = Category::where('template', $this->categoryTemplates->QUEST)
            ->pluck('categoryId')->toArray();

        $categoryIds = Iterables::filter($categories, function ($categoryId) use ($user) {
            return PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId);
        });

        $threadsSql = Thread::isApproved()->orderBy('threadId', 'DESC')->whereIn('categoryId', $categoryIds);
        $total = DataHelper::getPage($threadsSql->count('threadId'), $perPage);

        $items = $threadsSql->take($perPage)->skip($this->getOffset($page, $perPage))->get()->map(function ($item) {
            return $this->mapArticle($item);
        });

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $items
        ]);
    }

    private function getLatestThreads($user) {
        $categoryIds = json_decode(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->homePageThreads));
        if (!is_array($categoryIds)) {
            return [];
        }

        $categoryIds = Iterables::filter($categoryIds, function ($categoryId) use ($user) {
            return PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId);
        });

        return Thread::whereIn('categoryId', $categoryIds)->take(10)->orderBy('threadId', 'DESC')->with(['prefix'])->get()->map(function ($thread) {
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
     * @return Notice[]|\Illuminate\Database\Eloquent\Collection
     */
    private function getNotices() {
        $notices = Notice::all();

        foreach ($notices as $notice) {
            $notice->makeHidden(['createdAt', 'updatedAt', 'userId', 'isDeleted']);
            $notice->text = nl2br(stripcslashes($notice->text));
        }

        return $notices;
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
        $categories = Category::where('template', $type)
            ->pluck('categoryId')->toArray();

        $categoryIds = Iterables::filter($categories, function ($categoryId) use ($user) {
            return PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId);
        });

        return Thread::isApproved()->orderBy('threadId', 'DESC')->whereIn('categoryId', $categoryIds)->take($amount)->get()->map(function ($item) {
            return $this->mapArticle($item);
        });
    }

    /**
     * @param $thread
     *
     * @return array
     */
    private function mapArticle($thread) {
        $tags = isset($thread->templateData) ? (strpos($thread->templateData->tags, ',') !== false ?
            explode(',', $thread->templateData->tags) :
            [$thread->templateData->tags]) : null;

        return [
            'threadId' => $thread->threadId,
            'badge' => isset($thread->templateData) ? $thread->templateData->badge : null,
            'title' => $thread->title,
            'content' => BBcodeUtil::bbcodeParser($thread->content, false),
            'tags' => $tags,
            'user' => UserHelper::getSlimUser($thread->userId),
            'createdAt' => $thread->createdAt->timestamp,
            'prefix' => $thread->prefix
        ];
    }
}
