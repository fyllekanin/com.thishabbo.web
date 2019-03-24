<?php

$adminPermissions = new \stdClass();

$adminPermissions->canManageBadges = 1;
$adminPermissions->canManageForum = 2;
$adminPermissions->canManageForumPermissions = 4;

$adminPermissions->canManageGroups = 8;
$adminPermissions->canEditWebsiteSettings = 16;
$adminPermissions->canEditDefaultPermissions = 32;

$adminPermissions->canApprovePublicGroups = 64;
$adminPermissions->canManageBBcodes = 128;
$adminPermissions->canManagePrefixes = 256;
$adminPermissions->canManageGroupsList = 512;

$adminPermissions->canEditUserBasic = 1024;
$adminPermissions->canEditUserAdvanced = 2048;
$adminPermissions->canEditUserProfile = 4096;
$adminPermissions->canBanUser = 8192;
$adminPermissions->canMergeUsers =  16384;

$adminPermissions->canManageBetting = 32768;
$adminPermissions->canManageTHC = 65536;
$adminPermissions->canSeeIps = 131072;
$adminPermissions->canManageInfractions = 262144;
$adminPermissions->canDoInfractions = 524288;
$adminPermissions->canSeeLogs = 1048576;
$adminPermissions->canManageShop = 2097152;

$staffPermissions = new \stdClass();
$staffPermissions->canRadio = 1;
$staffPermissions->canEvent = 2;
$staffPermissions->canBookRadioForOthers = 4;
$staffPermissions->canBookEventForOthers = 8;
$staffPermissions->canManageEvents = 16;

$staffPermissions->canSeeIpOnRequests = 32;
$staffPermissions->canManagePermShows = 64;

$staffPermissions->canKickDjOffAir = 128;
$staffPermissions->canOverrideDjSays = 256;

$staffPermissions->canSeeBookingLogs = 512;
$staffPermissions->canEditRadioInfo = 1024;

$staffPermissions->canSeeDoNotHire = 2048;
$staffPermissions->canManageBanOnSight = 4096;
$staffPermissions->canSeeListeners = 8192;

$forumPermissions = new \stdClass();
$forumPermissions->canRead = 1;
$forumPermissions->canPost = 2;
$forumPermissions->canCreateThreads = 4;
$forumPermissions->canViewThreadContent = 128;
$forumPermissions->canViewOthersThreads = 2048;
$forumPermissions->canOpenCloseOwnThread = 65536;

// More moderation related
$forumPermissions->canEditOthersPosts = 8;
$forumPermissions->canDeletePosts = 32;
$forumPermissions->canStickyThread = 64;
$forumPermissions->canCloseOpenThread = 256;
$forumPermissions->canApproveThreads = 512;
$forumPermissions->canApprovePosts = 1024;
$forumPermissions->canManagePolls = 4096;
$forumPermissions->canChangeThreadOwner = 8192;
$forumPermissions->canMergePosts = 16384;
$forumPermissions->canMoveThreads = 32768;

$forumOptions = new \stdClass();
$forumOptions->threadsNeedApproval = 1;
$forumOptions->postsDontCount = 2;
$forumOptions->prefixMandatory = 4;
$forumOptions->threadsCanHavePolls = 8;
$forumOptions->reportPostsGoHere = 16;

$groupOptions = new \stdClass();
$groupOptions->contentNeedApproval = 1;
$groupOptions->canBeTagged = 2;

$postBitOptions = new \stdClass();
$postBitOptions->hideJoinDate = 1;
$postBitOptions->hidePostCount = 2;
$postBitOptions->hideLikesCount = 4;
$postBitOptions->hideSocials = 8;

return [
    'ADMIN' => $adminPermissions,
    'FORUM' => $forumPermissions,
    'FORUM_OPTIONS' => $forumOptions,
    'GROUP_OPTIONS' => $groupOptions,
    'STAFF' => $staffPermissions,
    'POST_BIT_OPTIONS' => $postBitOptions
];
