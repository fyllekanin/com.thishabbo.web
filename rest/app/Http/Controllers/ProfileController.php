<?php

namespace App\Http\Controllers;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\Accolade;
use App\EloquentModels\User\Follower;
use App\EloquentModels\User\User;
use App\EloquentModels\User\VisitorMessage;
use App\EloquentModels\User\VisitorMessageLike;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Http\Impl\ProfileControllerImpl;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\User\Point;
use App\Services\ActivityService;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Services\PointsService;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Views\VisitorMessageReportView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller {
    private $myImpl;
    private $pointsService;

    public function __construct(ProfileControllerImpl $impl, PointsService $pointsService) {
        parent::__construct();
        $this->myImpl = $impl;
        $this->pointsService = $pointsService;
    }

    /**
     * @param Request $request
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

        Logger::user($user->userId, $request->ip(), Action::FOLLOWED, [], $target->userId);
        return response()->json($this->getFollowers($target->userId, $user));
    }

    /**
     * @param Request $request
     * @param $userId
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function deleteFollow(Request $request, $userId) {
        $user = $request->get('auth');

        $follow = $this->myImpl->getFollow($user, $userId);
        $follow->delete();

        Logger::user($user->userId, $request->ip(), Action::UNFOLLOWED, [], $userId);
        return response()->json($this->getFollowers($userId, $user));
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createVisitorMessage(Request $request) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(VisitorMessage::where('userId', $user->userId)->where('createdAt', '>', $this->nowMinus15)->count('visitorMessageId') > 0,
            400, 'You are commenting to quick!');

        $profile = User::find($data->hostId);
        $parent = isset($data->parentId) ? VisitorMessage::find($data->parentId) : null;
        $this->myImpl->canPostVisitorMessage($user, $profile, $parent, $data);

        $visitorMessage = new VisitorMessage([
            'hostId' => $data->hostId,
            'userId' => $user->userId,
            'content' => $data->content,
            'parentId' => $parent ? $parent->visitorMessageId : 0
        ]);
        $visitorMessage->save();

        $this->pointsService->givePointsFromModel($user->userId, Point::VISITOR_MESSAGE);
        NotificationFactory::newVisitorMessage($visitorMessage);
        Logger::user($user->userId, $request->ip(), Action::CREATED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json($this->mapVisitorMessage($request, $visitorMessage));
    }

    /**
     * @param Request $request
     * @param ActivityService $activityService
     * @param ForumService $forumService
     * @param         $nickname
     *
     * @param $page
     *
     * @return JsonResponse
     */
    public function getProfile(Request $request, ActivityService $activityService, ForumService $forumService, $nickname, $page) {
        $user = $request->get('auth');

        $profile = User::withNickname($nickname)->first();
        Condition::precondition(!$profile, 404, 'No user with that nickname');

        if ($this->myImpl->isPrivate($user, $profile)) {
            return response()->json([
                'user' => UserHelper::getSlimUser($profile->userId),
                'followers' => $this->getFollowers($profile->userId, $user)
            ]);
        }

        return response()->json([
            'user' => UserHelper::getSlimUser($profile->userId),
            'followers' => $this->getFollowers($profile->userId, $user),
            'youtube' => $profile->profile ? $profile->profile->youtube : null,
            'activities' => $activityService->getLatestActivities($user, $forumService->getAccessibleCategories($user->userId), [], $profile->userId),
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
        ]);
    }

    /**
     * @param Request $request
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

        $like = new VisitorMessageLike([
            'visitorMessageId' => $visitorMessageId,
            'userId' => $user->userId
        ]);
        $like->save();

        Logger::user($user->userId, $request->ip(), Action::CREATED_VISITOR_MESSAGE_LIKE, [], $visitorMessageId);
        return response()->json();
    }

    /**
     * @param Request $request
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

        Logger::user($user->userId, $request->ip(), Action::DELETED_VISITOR_MESSAGE_LIKE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param ForumService $forumService
     * @param ForumValidatorService $validatorService
     * @param $visitorMessageId
     *
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createReportVisitorMessage(Request $request, ForumService $forumService,
                                               ForumValidatorService $validatorService, PointsService $pointsService, $visitorMessageId) {
        $user = $request->get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        $message = $request->input('message');

        Condition::precondition(!$visitorMessage, 404, 'No visitor message with that ID');
        Condition::precondition(!isset($message) || empty($message), 400, 'Message can not be empty');

        $threadSkeleton = VisitorMessageReportView::of($user, $visitorMessage, $message);
        $reportCategories = Category::isReportCategory()->get();
        $threadController = new ThreadCrudController($forumService, $validatorService, $pointsService);

        foreach ($reportCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), Action::REPORTED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }

    /**
     * @param $userId - ID of the user that own the profile
     *
     * @return array
     */
    private function getSlots($userId) {
        $radioSlots = Timetable::isActive()
            ->where('userId', $userId)
            ->where(function ($query) {
                $query->where(function ($query) {
                    $query->where('day', date('N'))->where('hour', '>', date('G'));
                })->orWhere(function ($query) {
                    $query->where('day', '>', date('N'));
                });
            })->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->radio()->get();


        $eventsSlots = Timetable::isActive()
            ->where('userId', $userId)
            ->where(function ($query) {
                $query->where(function ($query) {
                    $query->where('day', date('N'))->where('hour', '>', date('G'));
                })->orWhere(function ($query) {
                    $query->where('day', '>', date('N'));
                });
            })->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->events()->get();

        return [
            'events' => $eventsSlots,
            'radio' => $radioSlots
        ];
    }

    /**
     * @param $userId - ID of user that own the profile
     * @param $user - auth user
     *
     * @return array
     */
    private function getFollowers($userId, $user) {
        $following = Follower::where('userId', $user->userId)->where('targetId', $userId)->first();

        return [
            'followers' => Follower::where('targetId', $userId)->inRandomOrder()->take(5)->isApproved()->get()->map(function ($follower) {
                return UserHelper::getSlimUser($follower->userId);
            }),
            'total' => Follower::where('targetId', $userId)->isApproved()->count('followerId'),
            'isFollowing' => $following ? true : false,
            'isApproved' => $following ? $following->isApproved : false
        ];
    }

    /**
     * @param Request $request
     * @param User $user
     * @param int $page
     *
     * @return array
     */
    private function getVisitorMessages(Request $request, User $user, $page) {
        $visitorMessagesSql = VisitorMessage::where('hostId', $user->userId)->isSubject();
        $total = ceil($visitorMessagesSql->count('visitorMessageId') / $this->perPage);

        return [
            'total' => $total,
            'page' => $page,
            'items' => $visitorMessagesSql->take($this->perPage)->skip(DataHelper::getOffset($page))->orderBy('visitorMessageId', 'DESC')->get()->map(function ($item) use ($request) {
                return $this->mapVisitorMessage($request, $item);
            })
        ];
    }

    /**
     * @param Request $request
     * @param VisitorMessage $visitorMessage
     *
     * @return object
     */
    private function mapVisitorMessage(Request $request, VisitorMessage $visitorMessage) {
        return (object)[
            'visitorMessageId' => $visitorMessage->visitorMessageId,
            'user' => UserHelper::getSlimUser($visitorMessage->userId),
            'content' => $visitorMessage->isComment() ? $visitorMessage->content : BBcodeUtil::bbcodeParser($visitorMessage->content),
            'replies' => $visitorMessage->isComment() ? 0 : $visitorMessage->replies->count('visitorMessageId'),
            'likes' => $visitorMessage->likes || 0,
            'isLiking' => VisitorMessageLike::where('userId', $request->get('auth')->userId)->where('visitorMessageId', $visitorMessage->visitorMessageId)->count('visitorMessageLikeId') > 0,
            'comments' => $visitorMessage->isComment() ? [] : VisitorMessage::where('parentId', $visitorMessage->visitorMessageId)->orderBy('visitorMessageId', 'ASC')
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

        return $accolades->map(function ($accolade) use ($types) {
            $type = (object)Iterables::find($types, function ($item) use ($accolade) {
                return $accolade->type == $item['id'];
            });
            return [
                'icon' => $type->icon,
                'color' => $type->color,
                'role' => $accolade->role,
                'start' => $accolade->start,
                'end' => $accolade->end
            ];
        });
    }
}
