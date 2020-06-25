<?php

namespace App\Http\Controllers;

use App\Constants\CategoryOptions;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\Accolade;
use App\EloquentModels\User\Follower;
use App\EloquentModels\User\User;
use App\EloquentModels\User\VisitorMessage;
use App\EloquentModels\User\VisitorMessageLike;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Http\Impl\Forum\Thread\ThreadCrudControllerImpl;
use App\Http\Impl\ProfileControllerImpl;
use App\Logger;
use App\Models\User\Point;
use App\Providers\Service\ActivityService;
use App\Providers\Service\ContentService;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Providers\Service\PointsService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\GroupRepository;
use App\Repositories\Repository\UserRepository;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use App\Views\VisitorMessageReportView;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller {
    private $myImpl;
    private $myContentService;
    private $myPointsService;
    private $myUserRepository;
    private $myCategoryRepository;

    public function __construct(
        ProfileControllerImpl $impl,
        PointsService $pointsService,
        ContentService $contentService,
        UserRepository $userRepository,
        CategoryRepository $categoryRepository
    ) {
        parent::__construct();
        $this->myImpl = $impl;
        $this->myUserRepository = $userRepository;
        $this->myPointsService = $pointsService;
        $this->myContentService = $contentService;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createFollow(Request $request) {
        $user = $request->get('auth');
        $userId = $request->input('userId');
        Condition::precondition($user->userId == $userId, 400, 'You can not follow yourself');

        $target = $this->myImpl->getUser($request);
        $this->myImpl->throwIfFollowing($user, $target);

        $follow = $this->myImpl->getNewFollow($user, $target);
        NotificationFactory::followedUser($follow->targetId, $follow->userId);

        Logger::user($user->userId, $request->ip(), LogType::FOLLOWED, [], $target->userId);
        return response()->json($this->getFollowers($target->userId, $user));
    }

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function deleteFollow(Request $request, $userId) {
        $user = $request->get('auth');

        $follow = $this->myImpl->getFollow($user, $userId);
        $follow->delete();

        Logger::user($user->userId, $request->ip(), LogType::UNFOLLOWED, [], $userId);
        return response()->json($this->getFollowers($userId, $user));
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createVisitorMessage(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(
            VisitorMessage::where('userId', $user->userId)->where('createdAt', '>', $this->nowMinus15)->count('visitorMessageId') > 0,
            400,
            'You are commenting to quick!'
        );

        $profile = User::find($data->hostId);
        $parent = isset($data->parentId) ? VisitorMessage::find($data->parentId) : null;
        $this->myImpl->canPostVisitorMessage($user, $profile, $parent, $data);

        $visitorMessage = new VisitorMessage(
            [
                'hostId' => $data->hostId,
                'userId' => $user->userId,
                'content' => $data->content,
                'parentId' => $parent ? $parent->visitorMessageId : 0
            ]
        );
        $visitorMessage->save();

        $this->myPointsService->givePointsFromModel($user->userId, Point::VISITOR_MESSAGE);
        NotificationFactory::newVisitorMessage($visitorMessage);
        Logger::user($user->userId, $request->ip(), LogType::CREATED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json($this->mapVisitorMessage($request, $visitorMessage));
    }

    /**
     * @param  Request  $request
     * @param  ActivityService  $activityService
     * @param $nickname
     *
     * @param $page
     *
     * @return JsonResponse
     */
    public function getProfile(Request $request, ActivityService $activityService, $nickname, $page) {
        $user = $request->get('auth');

        $profile = User::withNickname($nickname)->first();
        Condition::precondition(!$profile, 404, 'No user with that nickname');

        if ($this->myImpl->isPrivate($user, $profile)) {
            return response()->json(
                [
                    'user' => UserHelper::getSlimUser($profile->userId),
                    'followers' => $this->getFollowers($profile->userId, $user)
                ]
            );
        }

        if ($user->userId > 0 && $user->userId != $profile->userId) {
            $this->myUserRepository->updateVisitOnProfileId($user->userId, $profile->userId);
        }
        return response()->json(
            [
                'user' => UserHelper::getSlimUser($profile->userId),
                'followers' => $this->getFollowers($profile->userId, $user),
                'youtube' => $profile->profile ? $profile->profile->youtube : null,
                'activities' => $activityService
                    ->getLatestActivities(
                        $user,
                        $this->myCategoryRepository
                            ->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ), [], $profile->userId
                    ),
                'stats' => [
                    'userId' => $profile->userId,
                    'posts' => $profile->posts,
                    'threads' => $profile->threads,
                    'likes' => $profile->likes,
                    'createdAt' => $profile->createdAt->timestamp,
                    'lastActivity' => $profile->lastActivity,
                    'habbo' => $profile->habbo,
                    'referrals' => User::where('referralId', $profile->userId)->count(),
                    'xp' => UserHelper::getUserDataOrCreate($profile->userId)->xp
                ],
                'visitorMessages' => $this->getVisitorMessages($request, $profile, $page),
                'relations' => !$profile->profile ? [] : [
                    'love' => isset($profile->profile->love) ? UserHelper::getSlimUser($profile->profile->love) : null,
                    'like' => isset($profile->profile->like) ? UserHelper::getSlimUser($profile->profile->like) : null,
                    'hate' => isset($profile->profile->hate) ? UserHelper::getSlimUser($profile->profile->hate) : null
                ],
                'accolades' => $this->getAccolades($profile->userId),
                'slots' => $this->getSlots($profile->userId)
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $visitorMessageId
     *
     * @return JsonResponse
     */
    public function createVisitorMessageLike(Request $request, $visitorMessageId) {
        $user = $request->get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        Condition::precondition(!$visitorMessage, 404, 'No visitor message with that ID');
        Condition::precondition($this->myImpl->isPrivate($user, $visitorMessage->host), 400, 'You can not like this message');

        $visitorMessageLike = VisitorMessageLike::where('userId', $user->userId)->where('visitorMessageId', $visitorMessageId)->first();
        Condition::precondition($visitorMessageLike, 400, 'You have already liked this message!');
        Condition::precondition($visitorMessage->userId == $user->userId, 400, 'You can not like your own message');

        $visitorMessage->likes++;
        $visitorMessage->save();
        $visitorMessage->user->likes++;
        $visitorMessage->user->save();

        $like = new VisitorMessageLike(
            [
                'visitorMessageId' => $visitorMessageId,
                'userId' => $user->userId
            ]
        );
        $like->save();

        Logger::user($user->userId, $request->ip(), LogType::CREATED_VISITOR_MESSAGE_LIKE, [], $visitorMessageId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $visitorMessageId
     *
     * @return JsonResponse
     */
    public function deleteVisitorMessageLike(Request $request, $visitorMessageId) {
        $user = $request->get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        Condition::precondition(!$visitorMessage, 404, 'No visitor message with that ID');
        Condition::precondition($this->myImpl->isPrivate($user, $visitorMessage->host), 400, 'You can not un-like this message');

        $visitorMessageLike = VisitorMessageLike::where('userId', $user->userId)->where('visitorMessageId', $visitorMessageId)->first();
        Condition::precondition(!$visitorMessageLike, 404, 'You have not liked this message');

        $visitorMessage->likes--;
        $visitorMessage->save();
        $visitorMessage->user->likes--;
        $visitorMessage->user->save();

        $visitorMessageLike->delete();

        Logger::user($user->userId, $request->ip(), LogType::DELETED_VISITOR_MESSAGE_LIKE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param  ForumService  $forumService
     * @param  ForumValidatorService  $validatorService
     * @param  PointsService  $pointsService
     * @param  GroupRepository  $groupRepository
     * @param  CategoryRepository  $categoryRepository
     * @param $visitorMessageId
     *
     * @return JsonResponse
     */
    public function createReportVisitorMessage(
        Request $request,
        ForumService $forumService,
        ForumValidatorService $validatorService,
        PointsService $pointsService,
        GroupRepository $groupRepository,
        CategoryRepository $categoryRepository,
        $visitorMessageId
    ) {
        $user = $request->get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        $message = $request->input('message');

        Condition::precondition(!$visitorMessage, 404, 'No visitor message with that ID');
        Condition::precondition(!isset($message) || empty($message), 400, 'Message can not be empty');

        $threadSkeleton = VisitorMessageReportView::of($user, $visitorMessage, $message);
        $reportCategories = $this->myCategoryRepository->getCategoriesWithOption(CategoryOptions::REPORT_POSTS_GO_HERE);
        $threadController = new ThreadCrudController(
            $forumService,
            $validatorService,
            $pointsService,
            $groupRepository,
            $categoryRepository
        );

        foreach ($reportCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), LogType::REPORTED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }

    /**
     * @param $userId  - ID of the user that own the profile
     *
     * @return array
     */
    private function getSlots($userId) {
        $radioSlots = Timetable::isActive()
            ->where('userId', $userId)
            ->where(
                function ($query) {
                    $query->where(
                        function ($query) {
                            $query->where('day', date('N'))->where('hour', '>', date('G'));
                        }
                    )->orWhere(
                        function ($query) {
                            $query->where('day', '>', date('N'));
                        }
                    );
                }
            )->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->radio()->get();


        $eventsSlots = Timetable::isActive()
            ->where('userId', $userId)
            ->where(
                function ($query) {
                    $query->where(
                        function ($query) {
                            $query->where('day', date('N'))->where('hour', '>', date('G'));
                        }
                    )->orWhere(
                        function ($query) {
                            $query->where('day', '>', date('N'));
                        }
                    );
                }
            )->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->events()->get();

        return [
            'events' => $eventsSlots,
            'radio' => $radioSlots
        ];
    }

    /**
     * @param $userId  - ID of user that own the profile
     * @param $user  - auth user
     *
     * @return array
     */
    private function getFollowers($userId, $user) {
        $following = Follower::where('userId', $user->userId)->where('targetId', $userId)->first();

        return [
            'followers' => Follower::where('targetId', $userId)->inRandomOrder()->take(5)->isApproved()->get()->map(
                function ($follower) {
                    return UserHelper::getSlimUser($follower->userId);
                }
            ),
            'total' => Follower::where('targetId', $userId)->isApproved()->count('followerId'),
            'isFollowing' => $following ? true : false,
            'isApproved' => $following ? $following->isApproved : false
        ];
    }

    /**
     * @param  Request  $request
     * @param  User  $user
     * @param  int  $page
     *
     * @return array
     */
    private function getVisitorMessages(Request $request, User $user, $page) {
        $visitorMessagesSql = VisitorMessage::where('hostId', $user->userId)->isSubject();
        $total = ceil($visitorMessagesSql->count('visitorMessageId') / $this->perPage);

        return [
            'total' => $total,
            'page' => $page,
            'items' => $visitorMessagesSql
                ->take($this->perPage)
                ->skip(PaginationUtil::getOffset($page))
                ->orderBy('visitorMessageId', 'DESC')
                ->get()
                ->map(function ($item) use ($request) {
                    return $this->mapVisitorMessage($request, $item);
                })
        ];
    }

    /**
     * @param  Request  $request
     * @param  VisitorMessage  $visitorMessage
     *
     * @return object
     */
    private function mapVisitorMessage(Request $request, VisitorMessage $visitorMessage) {
        $content = null;
        $replies = 0;
        if ($visitorMessage->isComment()) {
            $content = $visitorMessage->content;
            $replies = 0;
        } else {
            $content = $this->myContentService->getParsedContent($visitorMessage->content);
            $replies = $visitorMessage->replies->count('visitorMessageId');
        }
        return (object) [
            'visitorMessageId' => $visitorMessage->visitorMessageId,
            'user' => UserHelper::getSlimUser($visitorMessage->userId),
            'content' => $content,
            'replies' => $replies,
            'likes' => $visitorMessage->likes || 0,
            'isLiking' => VisitorMessageLike::where('userId', $request->get('auth')->userId)
                    ->where('visitorMessageId', $visitorMessage->visitorMessageId)
                    ->count('visitorMessageLikeId') > 0,
            'comments' => $visitorMessage->isComment() ? [] : VisitorMessage::where('parentId', $visitorMessage->visitorMessageId)
                ->orderBy('visitorMessageId', 'ASC')
                ->get()
                ->map(function ($item) use ($request) {
                    return $this->mapVisitorMessage($request, $item);
                }),
            'createdAt' => $visitorMessage->createdAt->timestamp
        ];
    }

    private function getAccolades($userId) {
        $accolades = Accolade::where('userId', $userId)->orderBy('start', 'ASC')->get();
        $types = ConfigHelper::getAccoladeTypes();

        return $accolades->map(
            function ($accolade) use ($types) {
                $type = (object) Iterables::find(
                    $types,
                    function ($item) use ($accolade) {
                        return $accolade->type == $item['id'];
                    }
                );
                return [
                    'icon' => $type->icon,
                    'color' => $type->color,
                    'role' => $accolade->role,
                    'start' => $accolade->start,
                    'end' => $accolade->end
                ];
            }
        );
    }
}
