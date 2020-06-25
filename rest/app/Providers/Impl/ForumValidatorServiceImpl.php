<?php

namespace App\Providers\Impl;

use App\Constants\CategoryOptions;
use App\Constants\CategoryTemplates;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\Thread;
use App\Helpers\PermissionHelper;
use App\Providers\Service\ForumValidatorService;
use App\Utils\Condition;
use Illuminate\Foundation\Validation\ValidatesRequests;

class ForumValidatorServiceImpl implements ForumValidatorService {

    use ValidatesRequests;

    public function validateCreateUpdateThread($user, $threadSkeleton, $category, $request) {
        if (isset($threadSkeleton->prefixId) && $threadSkeleton->prefixId > 0) {
            $prefixExist = Prefix::where('prefixId', $threadSkeleton->prefixId)->exists();
            Condition::precondition(!$prefixExist, 404, 'Prefix does not exist!');
        }

        if (isset($threadSkeleton->poll)) {
            $this->validatePoll($threadSkeleton, $category);
        }

        if ($category->template !== CategoryTemplates::DEFAULT && $request->hasFile('thumbnail')) {
            $request->validate(
                [
                    'thumbnail.*' => 'required|mimes:jpg,jpeg,bmp,png,gif',
                ]
            );
        }

        $this->validateQuest($threadSkeleton, $category);
        $postedInRecently = Thread::where('userId', $user->userId)
            ->where('createdAt', '>', (time() - 15))
            ->count('threadId');

        $titleContentMissing = empty($threadSkeleton->title) || empty($threadSkeleton->content);
        Condition::precondition($postedInRecently > 0 && !isset($threadSkeleton->threadId), 400, 'You are creating threads too quick!');
        Condition::precondition($titleContentMissing, 400, 'Title and/or content is not set!');
        Condition::precondition(empty($threadSkeleton->categoryId), 400, 'Category ID is not set!');

        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $threadSkeleton->categoryId,
            'No permissions to access this category!'
        );
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_CREATE_THREADS,
            $threadSkeleton->categoryId,
            'No permissions to create threads in this category!'
        );
    }

    private function validatePoll($threadSkeleton, $category) {
        if (!isset($threadSkeleton->poll)) {
            return;
        }
        Condition::precondition(
            !isset($threadSkeleton->poll->question) || empty($threadSkeleton->poll->question),
            400,
            'Question can not be empty!'
        );
        Condition::precondition(!is_array($threadSkeleton->poll->answers), 400, 'There need to be at least 2 answers!');
        Condition::precondition(count($threadSkeleton->poll->answers) < 2, 400, 'There need to be at least 2 answers!');
        Condition::precondition(
            !($category->options & CategoryOptions::THREADS_CAN_HAVE_POLLS),
            400,
            'Threads in this category can not have polls!'
        );

        foreach ($threadSkeleton->poll->answers as $answer) {
            Condition::precondition(!isset($answer->label) || empty($answer->label), 400, 'An answer can not be empty!');
        }
    }

    private function validateQuest($threadSkeleton, $category) {
        if ($category->template == CategoryTemplates::QUEST) {
            Condition::precondition(empty($threadSkeleton->badges), 400, 'Badges cannot be empty!');

            $isTagSet = isset($threadSkeleton->tags) && count($threadSkeleton->tags) > 0;
            Condition::precondition(!$isTagSet, 400, 'You need at least one tag set!');
            $addedBadges = [];
            foreach ($threadSkeleton->badges as $badge) {
                $lowerCase = strtolower($badge);
                Condition::precondition(in_array($lowerCase, $addedBadges), 400, 'You can not have the same badge multiple times');
                Condition::precondition(!ctype_alnum($badge), 400, 'Badge can only be name, numbers & letters!');
                $addedBadges[] = $lowerCase;
            }
        }
    }
}
