<?php

namespace App\Http\Controllers\Moderation;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThreadPollController extends Controller {
    private $myCategoryRepository;

    public function __construct(CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function getPoll(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, $thread->categoryId, CategoryPermissions::CAN_MANAGE_POLLS),
            400,
            'You do not have permission to view this poll'
        );

        return response()->json(
            [
                'thread' => $thread->title,
                'question' => $thread->poll->question,
                'answers' => array_map(
                    function ($option) {
                        return [
                            'answer' => $option->label,
                            'users' => ThreadPollAnswer::where('answer', $option->id)->get()->map(
                                function ($answer) {
                                    return [
                                        'userId' => $answer->userId,
                                        'nickname' => User::find($answer->userId)->nickname
                                    ];
                                }
                            )
                        ];
                    },
                    json_decode($thread->poll->options)
                )
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getPolls(Request $request, $page) {
        $filter = $request->input('filter');
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_MANAGE_POLLS);

        $getPollsSql = ThreadPoll::join('threads', 'threads.threadId', '=', 'thread_polls.threadId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->where('threads.title', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('threads.title', 'ASC')
            ->select('threads.title', 'threads.threadId', 'thread_polls.*', 'threads.categoryId');

        $total = PaginationUtil::getTotalPages($getPollsSql->count('thread_polls.threadPollId'));
        $polls = $getPollsSql->take($this->perPage)->skip(PaginationUtil::getOffset($page))->get()->map(
            function ($poll) {
                return [
                    'threadPollId' => $poll->threadPollId,
                    'thread' => $poll->thread->title,
                    'question' => $poll->question,
                    'threadId' => $poll->threadId,
                    'votes' => ThreadPollAnswer::where('threadPollId', $poll->threadPollId)->count('threadPollId')
                ];
            }
        );

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'polls' => $polls
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function deletePoll(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);
        $threadPoll = ThreadPoll::where('threadId', $thread->threadId)->first();

        Condition::precondition(!$threadPoll, 404, 'No thread poll exist with that ID');
        Condition::precondition(
            !PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_MANAGE_POLLS,
                $thread->categoryId
            ),
            400,
            'You do not have permission to delete this poll'
        );

        $threadPoll->isDeleted = true;
        $threadPoll->save();

        ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)->update(['isDeleted' => true]);

        Logger::mod($user->userId, $request->ip(), LogType::DELETED_POLL, ['poll' => $threadPoll->question], $threadPoll->threadPollId);
        return response()->json();
    }
}
