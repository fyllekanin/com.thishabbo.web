<?php

namespace App\Services;

use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\Thread;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Utils\Condition;
use Illuminate\Foundation\Validation\ValidatesRequests;

class ForumValidatorService {
    use ValidatesRequests;

    /**
     * @param $threadSkeleton
     */
    public function validatePoll($threadSkeleton) {
        if (!isset($threadSkeleton->poll)) {
            return;
        }
        Condition::precondition(!isset($threadSkeleton->poll->question) || empty($threadSkeleton->poll->question), 400,
            'Question can not be empty');
        Condition::precondition(!is_array($threadSkeleton->poll->answers), 400, 'There need to be at least 2 answers');
        Condition::precondition(count($threadSkeleton->poll->answers) < 2, 400, 'There need to be at least 2 answers');

        foreach ($threadSkeleton->poll->answers as $answer) {
            Condition::precondition(!isset($answer->label) || empty($answer->label), 400, 'A answer can not be empty');
        }
    }

    /**
     * @param $user
     * @param $threadSkeleton
     * @param $category
     * @param $request
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function validateCreateUpdateThread($user, $threadSkeleton, $category, $request) {
        if (isset($threadSkeleton->prefixId) && $threadSkeleton->prefixId > 0) {
            $prefixExist = Prefix::where('prefixId', $threadSkeleton->prefixId)->exists();
            Condition::precondition(!$prefixExist, 404, 'Prefix do not exist');
        }
        $categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();

        if (isset($threadSkeleton->poll)) {
            $this->validatePoll($threadSkeleton);
        }

        if ($category->template !== $categoryTemplates->DEFAULT && $request->hasFile('thumbnail')) {
            $this->validate($request, [
                'thumbnail.*' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]);
        }

        if ($category->template == $categoryTemplates->QUEST) {
            Condition::precondition(empty($threadSkeleton->badge), 400, 'Badge can not be empty');
            Condition::precondition(!isset($threadSkeleton->tags) || count($threadSkeleton->tags) == 0, 400, 'You need at least one tag set');
            Condition::precondition(!ctype_alnum($threadSkeleton->badge), 400, 'Badge can only be name, numbers & letters!');
        }

        $postedInRecently = Thread::where('userId', $user->userId)
            ->where('createdAt', '>', (time() - 15))
            ->count('threadId');

        $titleContentMissing = empty($threadSkeleton->title) || empty($threadSkeleton->content);
        Condition::precondition($postedInRecently > 0 && !isset($threadSkeleton->threadId), 400, 'You are creating threads to quick!');
        Condition::precondition($titleContentMissing, 400, 'Title and/or content is not set!');
        Condition::precondition(empty($threadSkeleton->categoryId), 400, 'Category ID is not set!');

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead,
            $threadSkeleton->categoryId, 'No permissions to access this category');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canCreateThreads,
            $threadSkeleton->categoryId, 'No permissions to create threads in this category');
    }
}
