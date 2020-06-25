<?php

namespace App\Constants\Permission;

class CategoryPermissions {

    const CAN_READ = 1;
    const CAN_POST = 2;
    const CAN_CREATE_THREADS = 4;
    const CAN_EDIT_OTHERS_POSTS = 8;

    const CAN_DELETE_POSTS = 32;
    const CAN_STICKY_THREAD = 64;
    const CAN_VIEW_THREAD_CONTENT = 128;
    const CAN_CLOSE_OPEN_THREAD = 256;
    const CAN_APPROVE_THREADS = 512;
    const CAN_APPROVE_POSTS = 1024;
    const CAN_VIEW_OTHERS_THREADS = 2048;
    const CAN_MANAGE_POLLS = 4096;
    const CAN_CHANGE_OWNER = 8192;
    const CAN_MERGE_THREADS_AND_POSTS = 16384;
    const CAN_MOVE_THREADS = 32768;
    const CAN_OPEN_CLOSE_OWN_THREAD = 65536;
    const CAN_POST_IN_OTHERS_THREADS = 131072;
    const CAN_THREAD_BAN = 262144;
    const CAN_SEE_NON_PUBLIC_POLL_RESULTS = 524288;

    public static function getAsOptions() {
        return [
            'canRead' => self::CAN_READ,
            'canPost' => self::CAN_POST,
            'canCreateThreads' => self::CAN_CREATE_THREADS,
            'canViewThreadContent' => self::CAN_VIEW_THREAD_CONTENT,
            'canViewOthersThreads' => self::CAN_VIEW_OTHERS_THREADS,
            'canOpenCloseOwnThread' => self::CAN_OPEN_CLOSE_OWN_THREAD,
            'canPostInOthersThreads' => self::CAN_POST_IN_OTHERS_THREADS,
            'canEditOthersPosts' => self::CAN_EDIT_OTHERS_POSTS,
            'canDeletePosts' => self::CAN_DELETE_POSTS,
            'canStickyThread' => self::CAN_STICKY_THREAD,
            'canCloseOpenThread' => self::CAN_CLOSE_OPEN_THREAD,
            'canApproveThreads' => self::CAN_APPROVE_THREADS,
            'canApprovePosts' => self::CAN_APPROVE_POSTS,
            'canManagePolls' => self::CAN_MANAGE_POLLS,
            'canChangeOwner' => self::CAN_CHANGE_OWNER,
            'canMergeThreadsAndPosts' => self::CAN_MERGE_THREADS_AND_POSTS,
            'canMoveThreads' => self::CAN_MOVE_THREADS,
            'canThreadBan' => self::CAN_THREAD_BAN,
            'canSeeNonPublicPollResults' => self::CAN_SEE_NON_PUBLIC_POLL_RESULTS
        ];
    }
}
