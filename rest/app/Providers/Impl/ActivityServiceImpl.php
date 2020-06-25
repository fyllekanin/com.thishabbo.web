<?php

namespace App\Providers\Impl;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Log\LogUser;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Providers\Service\ActivityService;
use App\Utils\Value;
use Illuminate\Support\Collection;
use stdClass;

/**
 * Service to get activies on the site based on user logs
 *
 * @package App\Providers\Impl
 */
class ActivityServiceImpl implements ActivityService {


    public function getLatestActivities($user, Collection $categoryIds, array $ignoredThreadIds, int $byUserId = 0) {
        $supportedTypes = $this->getSupportedLogIds();

        $activities = [];
        $limit = 5;
        $lastItemId = 0;
        $isRunning = true;

        while ($isRunning) {
            $item = $this->getLogEntry($supportedTypes, $lastItemId, $byUserId);
            if (!$item) {
                break;
            }

            $item->data = isset($item->data) && !empty($item->data) ? (object) json_decode($item->data) : new stdClass();
            if ($this->isItemValid($item, $categoryIds, $ignoredThreadIds, $user->userId)) {
                $activities[] = $this->convertItem($user->userId, $item);
                $isRunning = count($activities) < $limit;
            }
            $lastItemId = $item->logId;
        }

        return $activities;
    }

    private function getLogEntry(array $supportedTypes, int $lastItemId, int $byUserId) {
        $query = null;
        if ($lastItemId > 0) {
            $query = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC')->where('logId', '<', $lastItemId);
        } else {
            $query = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC');
        }

        if ($byUserId > 0) {
            $query->where('userId', $byUserId);
        }
        return $query->first();
    }

    private function isItemValid($item, Collection $categoryIds, $ignoredThreadIds, $userId) {
        if (!$this->isThreadRelatedAction($item) && !$this->isPostRelatedAction($item)) {
            return true;
        }

        $itemIsValid = false;
        if ($this->isThreadRelatedAction($item)) {
            $thread = Thread::where('threadId', $item->contentId)->first();
            $itemIsValid = $thread && $this->isThreadItemValid($thread, $userId, $ignoredThreadIds);
        }
        if ($this->isPostRelatedAction($item)) {
            $post = Post::with('thread')->where('postId', $item->contentId)->first();
            $itemIsValid = $post && $this->isThreadItemValid($post->thread, $userId, $ignoredThreadIds);
        }
        return $categoryIds->contains($item->data->categoryId) && $itemIsValid;
    }

    private function isThreadItemValid($thread, $userId, $ignoredThreadIds) {
        return ($thread->userId == $userId ||
                PermissionHelper::haveForumPermission($userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS, $thread->categoryId))
            && !in_array($thread->threadId, $ignoredThreadIds) && $thread->isApproved;
    }

    private function getSupportedLogIds() {
        $types = [
            LogType::CREATED_POST,
            LogType::CREATED_THREAD,
            LogType::LIKED_POST,
            LogType::LIKED_DJ,
            LogType::LIKED_HOST
        ];

        return array_map(
            function ($action) {
                return $action['id'];
            },
            $types
        );
    }

    private function convertItem($userId, $item) {
        $isThreadItem = $this->isThreadRelatedAction($item) || $this->isPostRelatedAction($item);
        return (object) [
            'logId' => $item->logId,
            'user' => UserHelper::getSlimUser($item->userId),
            'type' => $item->action,
            'thread' => $isThreadItem ? $this->createThreadItem($userId, $item) : null,
            'createdAt' => $item->createdAt->timestamp
        ];
    }

    private function createThreadItem($userId, $item) {
        $page = 1;
        $threadId = $item->contentId;
        if (in_array($item->action, [LogType::CREATED_POST['id'], LogType::LIKED_POST['id']])) {
            $post = Post::find($item->contentId);
            $threadId = $post->threadId;
            $page = $post->getPage(
                PermissionHelper::haveForumPermission(
                    $userId,
                    CategoryPermissions::CAN_APPROVE_POSTS,
                    $post->thread->categoryId
                )
            );
        }
        $thread = Thread::find($threadId);

        return [
            'title' => Value::objectProperty($thread, 'title', 'Unknown'),
            'threadId' => Value::objectProperty($thread, 'threadId', 0),
            'page' => $page
        ];
    }

    private function isThreadRelatedAction($item) {
        return in_array($item->action, [LogType::CREATED_THREAD['id']]);
    }

    private function isPostRelatedAction($item) {
        return in_array($item->action, [LogType::CREATED_POST['id'], LogType::LIKED_POST['id']]);
    }
}
