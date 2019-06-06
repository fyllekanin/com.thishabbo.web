<?php

namespace App\Http\Controllers\Forum\Thread;

use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\Forum\ThreadSubscription;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class ThreadActionController extends Controller {
    private $categoryTemplates = null;

    private $forumService;
    private $validatorService;

    /**
     * ThreadController constructor.
     * Fetch the available category templates and store in an instance variable
     *
     * @param Request $request
     * @param ForumService $forumService
     * @param ForumValidatorService $validatorService
     */
    public function __construct(Request $request, ForumService $forumService, ForumValidatorService $validatorService) {
        parent::__construct($request);
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
        $this->forumService = $forumService;
        $this->validatorService = $validatorService;
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createIgnore(Request $request, $threadId) {
        $isAlreadyIgnoring = IgnoredThread::where('userId', $this->user->userId)->where('threadId', $threadId)->count('threadId') > 0;
        Condition::precondition($isAlreadyIgnoring, 400, 'You are already ignoring this thread');
        $ignore = new IgnoredThread([
            'userId' => $this->user->userId,
            'threadId' => $threadId
        ]);
        $ignore->save();

        Logger::user($this->user->userId, $request->ip(), Action::IGNORED_THREAD, ['threadId' => $threadId]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteIgnore(Request $request, $threadId) {
        $item = IgnoredThread::where('userId', $this->user->userId)->where('threadId', $threadId);
        Condition::precondition($item->count('threadId') == 0, 404, 'You are not currently ignoring this thread');

        $item->delete();

        Logger::user($this->user->userId, $request->ip(), Action::UNIGNORED_THREAD, ['threadId' => $threadId]);
        return response()->json();
    }


    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createVote(Request $request, $threadId) {
        $answerId = $request->input('answerId');

        $threadPoll = ThreadPoll::where('threadId', $threadId)->first();
        Condition::precondition(!$threadPoll, 404, 'The thread do not have a poll');
        Condition::precondition(ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                ->where('userId', $this->user->userId)->count('threadPollId') > 0, 400, 'You have already voted');

        $option = Iterables::find(json_decode($threadPoll->options), function ($opt) use ($answerId) {
            return $opt->id == $answerId;
        });
        Condition::precondition(!$option, 404, 'The answer do not exist');

        $answer = new ThreadPollAnswer([
            'threadPollId' => $threadPoll->threadPollId,
            'userId' => $this->user->userId,
            'answer' => $answerId
        ]);
        $answer->save();

        Logger::user($this->user->userId, $request->ip(), Action::VOTED_ON_POLL);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createThreadSubscription(Request $request, $threadId) {
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread do not exist');

        $subscription = ThreadSubscription::where('userId', $this->user->userId)->where('threadId', $threadId)->first();
        Condition::precondition($subscription, 400, 'You are already subscribed to this thread');

        $newSubscription = new ThreadSubscription([
            'userId' => $this->user->userId,
            'threadId' => $threadId
        ]);
        $newSubscription->save();

        Logger::user($this->user->userId, $request->ip(), Action::CREATED_THREAD_SUBSCRIPTION);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteThreadSubscription(Request $request, $threadId) {
        ThreadSubscription::where('userId', $this->user->userId)->where('threadId', $threadId)->delete();
        Logger::user($this->user->userId, $request->ip(), Action::DELETED_THREAD_SUBSCRIPTION);
        return response()->json();
    }
}
