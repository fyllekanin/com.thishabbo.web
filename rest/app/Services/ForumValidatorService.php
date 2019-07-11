<?php

namespace App\Services;

use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Utils\Condition;
use Illuminate\Foundation\Validation\ValidatesRequests;

class ForumValidatorService {
    use ValidatesRequests;

    public function getThreadPoll($threadId, $userId) {
        $threadPoll = ThreadPoll::where('threadId', $threadId)->first();
        if (!$threadPoll) {
            return null;
        }

        $answers = json_decode($threadPoll->options);
        foreach ($answers as $answer) {
            $answer->answers = ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                ->where('answer', $answer->id)->count('threadPollId');
        }
        return [
            'question' => $threadPoll->question,
            'answers' => $answers,
            'haveVoted' => ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                    ->where('userId', $userId)->count('threadPollId') > 0
        ];
    }

    /**
     * @param $threadSkeleton
     * @param $category
     */
    public function validatePoll($threadSkeleton, $category) {
        if (!isset($threadSkeleton->poll)) {
            return;
        }
        Condition::precondition(!isset($threadSkeleton->poll->question) || empty($threadSkeleton->poll->question), 400,
            'Question can not be empty!');
        Condition::precondition(!is_array($threadSkeleton->poll->answers), 400, 'There need to be at least 2 answers!');
        Condition::precondition(count($threadSkeleton->poll->answers) < 2, 400, 'There need to be at least 2 answers!');
        Condition::precondition(!($category->options & ConfigHelper::getForumOptionsConfig()->threadsCanHavePolls),
            400, 'Threads in this category can not have polls!');

        foreach ($threadSkeleton->poll->answers as $answer) {
            Condition::precondition(!isset($answer->label) || empty($answer->label), 400, 'An answer can not be empty!');
        }
    }

    /**
     * @param $user
     * @param $threadSkeleton
     * @param $category
     * @param $request
     *
     */
    public function validateCreateUpdateThread($user, $threadSkeleton, $category, $request) {
        if (isset($threadSkeleton->prefixId) && $threadSkeleton->prefixId > 0) {
            $prefixExist = Prefix::where('prefixId', $threadSkeleton->prefixId)->exists();
            Condition::precondition(!$prefixExist, 404, 'Prefix does not exist!');
        }
        $categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();

        if (isset($threadSkeleton->poll)) {
            $this->validatePoll($threadSkeleton, $category);
        }

        if ($category->template !== $categoryTemplates->DEFAULT && $request->hasFile('thumbnail')) {
            $request->validate([
                'thumbnail.*' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]);
        }

        $this->validateQuest($threadSkeleton, $category, $categoryTemplates);
        $postedInRecently = Thread::where('userId', $user->userId)
            ->where('createdAt', '>', (time() - 15))
            ->count('threadId');

        $titleContentMissing = empty($threadSkeleton->title) || empty($threadSkeleton->content);
        Condition::precondition($postedInRecently > 0 && !isset($threadSkeleton->threadId), 400, 'You are creating threads too quick!');
        Condition::precondition($titleContentMissing, 400, 'Title and/or content is not set!');
        Condition::precondition(empty($threadSkeleton->categoryId), 400, 'Category ID is not set!');

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead,
            $threadSkeleton->categoryId, 'No permissions to access this category!');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canCreateThreads,
            $threadSkeleton->categoryId, 'No permissions to create threads in this category!');
    }

    private function validateQuest($threadSkeleton, $category, $categoryTemplates) {
        if ($category->template == $categoryTemplates->QUEST) {
            Condition::precondition(empty($threadSkeleton->badge), 400, 'Badge can not be empty!');
            Condition::precondition(!isset($threadSkeleton->tags) || count($threadSkeleton->tags) == 0, 400, 'You need at least one tag set!');
            Condition::precondition(!ctype_alnum($threadSkeleton->badge), 400, 'Badge can only be name, numbers & letters!');
        }
    }
}
