<?php

namespace App\Http\Controllers\Moderation;

use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ThreadPollController extends Controller {
    private $forumService;

    /**
     * ThreadPollController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct (ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPoll($threadId) {
        $user = Cache::get('auth');
        $thread = Thread::find($threadId);
        $permission = ConfigHelper::getForumConfig()->canManagePolls;

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $thread->categoryId, $permission),
            400, 'You do not have permission to view this poll');

        return response()->json([
            'thread' => $thread->title,
            'question' => $thread->poll->question,
            'answers' => array_map(function($option) {
                return [
                    'answer' => $option->label,
                    'users' => ThreadPollAnswer::where('answer', $option->id)->get()->map(function($answer) {
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
        $user = Cache::get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId, ConfigHelper::getForumConfig()->canManagePolls);
        $threadIds = Thread::whereIn('categoryId', $categoryIds)->pluck('threadId');

        $getPollsSql = ThreadPoll::join('threads', 'threads.threadId', '=', 'thread_polls.threadId')
            ->whereIn('threads.threadId', $threadIds)
            ->where('threads.title', 'LIKE', '%' . $filter . '%')
            ->orderBy('threads.title', 'ASC')
            ->select('threads.title', 'threads.threadId', 'thread_polls.*');

        $total = ceil($getPollsSql->count() / $this->perPage);
        $polls = $getPollsSql->take($this->perPage)->skip($this->getOffset($page))->get()->map(function ($poll) {
            return [
                'threadPollId' => $poll->threadPollId,
                'thread' => $poll->thread->title,
                'question' => $poll->question,
                'threadId' => $poll->threadId,
                'votes' => ThreadPollAnswer::where('threadPollId', $poll->threadPollId)->count()
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
    public function deletePoll (Request $request, $threadId) {
        $user = Cache::get('auth');
        $thread = Thread::find($threadId);
        $threadPoll = ThreadPoll::where('threadId', $thread->threadId)->first();

        Condition::precondition(!$threadPoll, 404, 'No thread poll exist with that ID');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId,
            ConfigHelper::getForumConfig()->canManagePolls, $thread->categoryId),
            400, 'You do not have permission to delete this poll');

        $threadPoll->isDeleted = true;
        $threadPoll->save();

        ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)->update([ 'isDeleted' => true ]);

        Logger::mod($user->userId, $request->ip(), Action::DELETED_POLL, ['poll' => $threadPoll->question]);
        return response()->json();
    }
}
