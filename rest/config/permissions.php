<?php

return [
    'ADMIN' => [
        'canManageBadges' => 1,
        'canManageForum' => 2,
        'canManageForumPermissions' => 4,
        'canManageGroups' => 8,
        'canEditWebsiteSettings' => 16,
        'canManageSubscriptions' => 32,
        'canApprovePublicGroups' => 64,
        'canManageBBcodes' => 128,
        'canManagePrefixes' => 256,
        'canManageGroupsList' => 512,
        'canEditUserBasic' => 1024,
        'canEditUserAdvanced' => 2048,
        'canReadServerLogs' => 4096,
        'canBanUser' => 8192,
        'canMergeUsers' => 16384,
        'canManageBetting' => 32768,
        'canManageTHC' => 65536,
        'canSeeIps' => 131072,
        'canManageInfractions' => 262144,
        'canDoInfractions' => 524288,
        'canSeeLogs' => 1048576,
        'canManageShop' => 2097152,
        'canPassPrivate' => 4194304,
        'canRemoveEssentials' => 8388608,
        'canModerateVisitorMessage' => 16777216
    ],
    'FORUM' => [
        'canRead' => 1,
        'canPost' => 2,
        'canCreateThreads' => 4,
        'canViewThreadContent' => 128,
        'canViewOthersThreads' => 2048,
        'canOpenCloseOwnThread' => 65536,
        // Mod related
        'canEditOthersPosts' => 8,
        'canDeletePosts' => 32,
        'canStickyThread' => 64,
        'canCloseOpenThread' => 256,
        'canApproveThreads' => 512,
        'canApprovePosts' => 1024,
        'canManagePolls' => 4096,
        'canChangeOwner' => 8192,
        'canMergePosts' => 16384,
        'canMoveThreads' => 32768
    ],
    'FORUM_OPTIONS' => [
        'threadsNeedApproval' => 1,
        'postsDontCount' => 2,
        'prefixMandatory' => 4,
        'threadsCanHavePolls' => 8,
        'reportPostsGoHere' => 16,
        'jobApplicationsGoHere' => 32,
        'contactPostsGoHere' => 64
    ],
    'GROUP_OPTIONS' => [
        'contentNeedApproval' => 1,
        'canBeTagged' => 2
    ],
    'STAFF' => [
        'canRadio' => 1,
        'canEvent' => 2,
        'canBookRadioForOthers' => 4,
        'canBookEventForOthers' => 8,
        'canManageEvents' => 16,
        'canSeeIpOnRequests' => 32,
        'canManagePermShows' => 64,
        'canKickDjOffAir' => 128,
        'canOverrideDjSays' => 256,
        'canSeeBookingLogs' => 512,
        'canEditRadioInfo' => 1024,
        'canSeeDoNotHire' => 2048,
        'canManageBanOnSight' => 4096,
        'canSeeListeners' => 8192
    ],
    'POST_BIT_OPTIONS' => [
        'hideJoinDate' => 1,
        'hidePostCount' => 2,
        'hideLikesCount' => 4,
        'hideSocials' => 8
    ]
];
