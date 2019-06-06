<?php

namespace App\Http\Controllers\Moderation;

use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class ThreadPollController extends Controller {
    private $forumService;

    /**
     * ThreadPollController constructor.
     *
     * @param Request $request
     * @param ForumService $forumService
     */
    public function __construct(Request $request, ForumService $forumService) {
        parent::__construct($request);
        $this->forumService = $forumService;
    }

    /**
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPoll($threadId) {
        $thread = Thread::find($threadId);
        $permission = ConfigHelper::getForumPermissions()->canManagePolls;

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        Condition::precondition(!PermissionHelper::haveForumPermission($this->user->userId, $thread->categoryId, $permission),
            400, 'You do not have permission to view this poll');

        return response()->json([
            'thread' => $thread->title,
            'question' => $thread->poll->question,
            'answers' => array_map(function ($option) {
                return [
                    'answer' => $option->label,
                    'users' => ThreadPollAnswer::where('answer', $option->id)->get()->map(function ($answer) {
                        return [
                            'userId' => $answer->userId,
                            'nickname' => User::find($answer->userId)->nickname
                        ];
                    })
                ];
            }, json_decode($thread->poll->options))
        ]);
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPolls(Request $request, $page) {
        $filter = $request->input('filter');
        $categoryIds = $this->forumService->getAccessibleCategories($this->user->userId, ConfigHelper::getForumPermissions()->canManagePolls);
        $threadIds = Thread::whereIn('categoryId', $categoryIds)->pluck('threadId');

        $getPollsSql = ThreadPoll::join('threads', 'threads.threadId', '=', 'thread_polls.threadId')
            ->whereIn('threads.threadId', $threadIds)
            ->where('threads.title', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('threads.title', 'ASC')
            ->select('threads.title', 'threads.threadId', 'thread_polls.*');

        $total = DataHelper::getPage($getPollsSql->count('thread_polls.threadPollId'));
        $polls = $getPollsSql->take($this->perPage)->skip($this->getOffset($page))->get()->map(function ($poll) {
            return [
                'threadPollId' => $poll->threadPollId,
                'thread' => $poll->thread->title,
                'question' => $poll->question,
                'threadId' => $poll->threadId,
                'votes' => ThreadPollAnswer::where('threadPollId', $poll->threadPollId)->count('threadPollId')
            ];
        });

        return response()->json([
            'total' => $total,
            'page' => $page,
            'polls' => $polls
        ]);
    }

    /**
     * @param Request $request
     *
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePoll(Request $request, $threadId) {
        $thread = Thread::find($threadId);
        $threadPoll = ThreadPoll::where('threadId', $thread->threadId)->first();

        Condition::precondition(!$threadPoll, 404, 'No thread poll exist with that ID');
        Condition::precondition(!PermissionHelper::haveForumPermission($this->user->userId,
            ConfigHelper::getForumPermissions()->canManagePolls, $thread->categoryId),
            400, 'You do not have permission to delete this poll');

        $threadPoll->isDeleted = true;
        $threadPoll->save();

        ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)->update(['isDeleted' => true]);

        Logger::mod($this->user->userId, $request->ip(), Action::DELETED_POLL, ['poll' => $threadPoll->question]);
        return response()->json();
    }
}
