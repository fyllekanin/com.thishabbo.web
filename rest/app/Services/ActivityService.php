<?php

namespace App\Services;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Log\LogUser;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Models\Logger\Action;
use App\Utils\Value;

class ActivityService {

    /**
     * @param $categoryIds
     * @param $userId
     *
     * @return array
     */
    public function getLatestActivities($categoryIds, $userId = null) {
        $supportedTypes = $this->getSupportedLogIds();

        $activities = [];
        $limit = 5;
        $lastItemId = null;

        while (count($activities) < $limit) {
            $item = null;
            $sql = null;
            if ($lastItemId) {
                $sql = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC')->where('logId', '<', $lastItemId);
            } else {
                $sql = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC');
            }

            if ($userId) {
                $sql->where('userId', $userId);
            }
            $item = $sql->first();

            if (!$item) {
                break;
            }

            $item->data = isset($item->data) && !empty($item->data) ? (object)json_decode($item->data) : new \stdClass();
            if ($this->isItemValid($item, $categoryIds)) {
                $activities[] = $this->convertItem($userId, $item);
            }
            $lastItemId = $item->logId;
        }

        return $activities;
    }

    /**
     * @param $item
     * @param $categoryIds
     *
     * @return bool
     */
    private function isItemValid($item, $categoryIds) {
        if (!$this->isThreadRelatedAction($item) && !$this->isPostRelatedAction($item)) {
            return true;
        }

        $itemExists = false;
        if ($this->isThreadRelatedAction($item)) {
            $itemExists = Thread::where('threadId', $item->contentId)->count() > 0;
        }
        if ($this->isPostRelatedAction($item)) {
            $itemExists = Post::where('postId', $item->contentId)->count() > 0;
        }
        return in_array($item->data->categoryId, $categoryIds) && $itemExists;
    }

    /**
     * @return array
     */
    private function getSupportedLogIds() {
        return array_map(function ($action) {
            return $action['id'];
        }, [
            Action::CREATED_POST,
            Action::CREATED_THREAD,
            Action::LIKED_POST,
            Action::LIKED_DJ,
            Action::STARTED_FASTEST_TYPE_GAME,
            Action::STARTED_SNAKE_GAME,
            Action::WON_ROULETTE,
            Action::LOST_ROULETTE
        ]);
    }

    /**
     * @param $userId
     * @param $item
     *
     * @return object
     */
    private function convertItem($userId, $item) {
        return (object)[
            'logId' => $item->logId,
            'user' => UserHelper::getSlimUser($item->userId),
            'type' => $item->action,
            'thread' => $this->isThreadRelatedAction($item) || $this->isPostRelatedAction($item) ?
                $this->createThreadItem($userId, $item) : null,
            'createdAt' => $item->createdAt->timestamp
        ];
    }

    private function createThreadItem($userId, $item) {
        $page = 1;
        $threadId = $item->contentId;
        if (in_array($item->action, [Action::CREATED_POST['id'], Action::LIKED_POST['id']])) {
            $post = Post::find($item->contentId);
            $threadId = $post->threadId;
            $page = $post->getPage(PermissionHelper::haveForumPermission($userId, ConfigHelper::getForumPermissions()->canApprovePosts,
                $post->thread->categoryId));
        }
        $thread = Thread::find($threadId);

        return [
            'title' => Value::objectProperty($thread, 'title', 'Unknown'),
            'threadId' => Value::objectProperty($thread, 'threadId', 0),
            'page' => $page
        ];
    }

    /**
     * @param $item
     *
     * @return bool
     */
    private function isThreadRelatedAction($item) {
        return in_array($item->action, [Action::CREATED_THREAD['id']]);
    }

    private function isPostRelatedAction($item) {
        return in_array($item->action, [Action::CREATED_POST['id'], Action::LIKED_POST['id']]);
    }
}