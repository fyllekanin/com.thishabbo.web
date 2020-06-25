<?php


namespace App\Constants;

class CategoryOptions {

    const THREADS_NEED_APPROVAL = 1;
    const POSTS_DONT_COUNT = 2;
    const PREFIX_MANDATORY = 4;
    const THREADS_CAN_HAVE_POLLS = 8;
    const REPORT_POSTS_GO_HERE = 16;
    const JOB_APPLICATIONS_GO_HERE = 32;
    const CONTACT_POSTS_GO_HERE = 64;
    const IS_STANDALONE_LEADERBOARD = 128;

    public static function getAsOptions() {
        return [
            'threadsNeedApproval' => self::THREADS_NEED_APPROVAL,
            'postsDontCount' => self::POSTS_DONT_COUNT,
            'prefixMandatory' => self::PREFIX_MANDATORY,
            'threadsCanHavePolls' => self::THREADS_CAN_HAVE_POLLS,
            'reportPostsGoHere' => self::REPORT_POSTS_GO_HERE,
            'jobApplicationsGoHere' => self::JOB_APPLICATIONS_GO_HERE,
            'contactPostsGoHere' => self::CONTACT_POSTS_GO_HERE,
            'isStandaloneLeaderboard' => self::IS_STANDALONE_LEADERBOARD
        ];
    }
}
