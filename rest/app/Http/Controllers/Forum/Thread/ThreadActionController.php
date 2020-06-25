<?php

namespace App\Http\Controllers\Forum\Thread;

use App\Constants\LogType;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\Forum\ThreadSubscription;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThreadActionController extends Controller {
    private $myForumService;
    private $myValidatorService;

    public function __construct(ForumService $forumService, ForumValidatorService $validatorService) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myValidatorService = $validatorService;
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function createIgnore(Request $request, $threadId) {
        $user = $request->get('auth');
        $isAlreadyIgnoring = IgnoredThread::where('userId', $user->userId)->where('threadId', $threadId)->count('threadId') > 0;
        Condition::precondition($isAlreadyIgnoring, 400, 'You are already ignoring this thread');
        $ignore = new IgnoredThread(
            [
                'userId' => $user->userId,
                'threadId' => $threadId
            ]
        );
        $ignore->save();

        Logger::user($user->userId, $request->ip(), LogType::IGNORED_THREAD, ['threadId' => $threadId], $threadId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function deleteIgnore(Request $request, $threadId) {
        $user = $request->get('auth');
        $item = IgnoredThread::where('userId', $user->userId)->where('threadId', $threadId);
        Condition::precondition($item->count('threadId') == 0, 404, 'You are not currently ignoring this thread');

        $item->delete();

        Logger::user($user->userId, $request->ip(), LogType::UNIGNORED_THREAD, ['threadId' => $threadId], $threadId);
        return response()->json();
    }


    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function createVote(Request $request, $threadId) {
        $user = $request->get('auth');
        $answerId = $request->input('answerId');

        $threadPoll = ThreadPoll::where('threadId', $threadId)->first();
        Condition::precondition(!$threadPoll, 404, 'The thread do not have a poll');
        Condition::precondition($user->userId < 1, 400, 'You need to be logged in to enter a vote');
        Condition::precondition(
            ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                ->where('userId', $user->userId)->count('threadPollId') > 0,
            400,
            'You have already voted'
        );

        $option = Iterables::find(
            json_decode($threadPoll->options),
            function ($opt) use ($answerId) {
                return $opt->id == $answerId;
            }
        );
        Condition::precondition(!$option, 404, 'The answer do not exist');

        $answer = new ThreadPollAnswer(
            [
                'threadPollId' => $threadPoll->threadPollId,
                'userId' => $user->userId,
                'answer' => $answerId
            ]
        );
        $answer->save();

        Logger::user($user->userId, $request->ip(), LogType::VOTED_ON_POLL);
        return response()->json($this->myForumService->getThreadPoll($threadPoll->thread, $user->userId));
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function createThreadSubscription(Request $request, $threadId) {
        $userId = $request->get('auth')->userId;
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread do not exist');

        $subscription = ThreadSubscription::where('userId', $userId)->where('threadId', $threadId)->first();
        Condition::precondition($subscription, 400, 'You are already subscribed to this thread');

        $newSubscription = new ThreadSubscription(
            [
                'userId' => $userId,
                'threadId' => $threadId
            ]
        );
        $newSubscription->save();

        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function deleteThreadSubscription(Request $request, $threadId) {
        $user = $request->get('auth');

        ThreadSubscription::where('userId', $user->userId)->where('threadId', $threadId)->delete();

        return response()->json();
    }
}
