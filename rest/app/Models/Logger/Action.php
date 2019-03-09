<?php

namespace App\Models\Logger;

use ReflectionClass;

/**
 * This will suppress all the PMD warnings in
 * this class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassLength)
 */
class Action {

    public static function getAction ($action) {
        return $action['id'];
    }

    /**
     * @return array
     * @throws \ReflectionException
     */
    public static function getAllConsts () {
        return (new ReflectionClass(get_class()))->getConstants();
    }

    const WON_ROULETTE = [
        'id' => 1,
        'description' => 'User won a roulette game',
        'data' => [
            'profit' => 'Amount user won'
        ]
    ];

    const LOST_ROULETTE = [
        'id' => 2,
        'description' => 'User lost a roulette game',
        'data' => [
            'amount' => 'Amount that user lost'
        ]
    ];

    const PLACED_BET = [
        'id' => 3,
        'description' => 'User placed a bet',
        'data' => [
            'bet' => 'Name on bet',
            'amount' => 'Amount that was betted'
        ]
    ];

    const REGISTERED = [
        'id' => 4,
        'description' => 'User registered',
        'data' => [
            'name' => 'Name of user that registered'
        ]
    ];

    const UPDATED_SOCIAL_NETWORKS = [
        'id' => 5,
        'description' => 'User updated social networks',
        'data' => []
    ];

    const UPDATED_AVATAR = [
        'id' => 6,
        'description' => 'User updated avatar',
        'data' => []
    ];

    const UPDATED_SIGNATURE = [
        'id' => 7,
        'description' => 'User updated signature',
        'data' => []
    ];

    const APPLIED_FOR_GROUP = [
        'id' => 8,
        'description' => 'User applied for group',
        'data' => [
            'name' => 'Name of group'
        ]
    ];

    const LEFT_GROUP = [
        'id' => 9,
        'description' => 'User left group',
        'data' => [
            'name' => 'Name of group'
        ]
    ];

    const UPDATED_IGNORED_NOTIFICATIONS = [
        'id' => 10,
        'description' => 'User updated their ignored notifications',
        'data' => []
    ];

    const UPDATED_HOMEPAGE = [
        'id' => 11,
        'description' => 'User updated their homepage',
        'data' => [
            'homepage' => 'Homepage that was set'
        ]
    ];

    const UPDATED_PASSWORD = [
        'id' => 12,
        'description' => 'User updated password',
        'data' => []
    ];

    const UPDATED_POSTBIT = [
        'id' => 14,
        'description' => 'User updated their postBit',
        'data' => []
    ];

    const REQUESTED_THC_FOR_USER = [
        'id' => 15,
        'description' => 'User requested THC for another user',
        'data' => [
            'name' => 'User the request was for'
        ]
    ];

    const UPDATED_DJ_SAYS = [
        'id' => 16,
        'description' => 'Updated the DJ says',
        'data' => [
            'says' => 'Updated the says to'
        ]
    ];

    const KICKED_DJ_OFF = [
        'id' => 17,
        'description' => 'Kicked current DJ off air',
        'data' => [
            'dj' => 'DJ that was on air'
        ]
    ];

    const LIKED_DJ = [
        'id' => 18,
        'description' => 'Liked the current DJ',
        'data' => [
            'dj' => 'DJ that was liked'
        ]
    ];

    const DID_RADIO_REQUEST = [
        'id' => 19,
        'description' => 'Sent a request to current DJ',
        'data' => []
    ];

    const UNBOOKED_RADIO_SLOT = [
        'id' => 20,
        'description' => 'User unbooked slot',
        'data' => [
            'timetableId' => 'Day the slot was on'
        ]
    ];

    const BOOKED_RADIO_SLOT = [
        'id' => 21,
        'description' => 'User booked slot',
        'data' => [
            'timetableId' => 'timetableId'
        ]
    ];

    const BOOKED_PERM_SLOT = [
        'id' => 22,
        'description' => 'User booked permanent slot',
        'data' => [
            'timetableId' => 'ID of booking'
        ]
    ];

    const EDITED_PERM_SLOT = [
        'id' => 23,
        'description' => 'User edited a permanent slot',
        'data' => [
            'show' => 'Name of the perm show'
        ]
    ];

    const DELETED_PERM_SLOT = [
        'id' => 24,
        'description' => 'User deleted a permanent slot',
        'data' => [
            'timetableId' => 'ID of booking'
        ]
    ];

    const CREATED_EVENT_TYPE = [
        'id' => 25,
        'description' => 'User created event type',
        'data' => [
            'event' => 'Name of event'
        ]
    ];

    const UPDATED_EVENT_TYPE = [
        'id' => 26,
        'description' => 'User created event type',
        'data' => [
            'event' => 'Name of event'
        ]
    ];

    const DELETED_EVENT_TYPE = [
        'id' => 27,
        'description' => 'User deleted event type',
        'data' => [
            'event' => 'Name of event'
        ]
    ];

    const UNBOOKED_EVENT_SLOT = [
        'id' => 28,
        'description' => 'User unbooked slot',
        'data' => [
            'timetableId' => 'ID of slot that got unbooked'
        ]
    ];

    const BOOKED_EVENT_SLOT = [
        'id' => 29,
        'description' => 'User booked slot',
        'data' => [
            'day' => 'Day the slot was on',
            'hour' => 'Hour the slot was on',
            'name' => 'User that have the slot'
        ]
    ];

    const DELETED_POST = [
        'id' => 30,
        'description' => 'User deleted post',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const APPROVED_POST = [
        'id' => 31,
        'description' => 'User approved post',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const UNAPPROVED_POST = [
        'id' => 32,
        'description' => 'User unapproved post',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const STICKIED_THREAD = [
        'id' => 33,
        'description' => 'User stickied thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const UNSTICKIED_THREAD = [
        'id' => 34,
        'description' => 'User unstickied thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const APPROVED_THREAD = [
        'id' => 35,
        'description' => 'User approved thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const UNAPPROVED_THREAD = [
        'id' => 36,
        'description' => 'User unapproved thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const DELETED_THREAD = [
        'id' => 37,
        'description' => 'User deleted thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const UPDATED_THREAD = [
        'id' => 38,
        'description' => 'User updated thread',
        'data' => [
            'thread' => 'Name of thread',
            'postId' => 'ID of post for the thread'
        ]
    ];

    const UPDATED_POST = [
        'id' => 39,
        'description' => 'User updated post',
        'data' => [
            'thread' => 'Name of thread',
            'postId' => 'ID of post for the thread',
            'oldContent' => 'Content before update',
            'newContent' => 'Content after update'
        ]
    ];

    const CREATED_POST = [
        'id' => 40,
        'description' => 'User created post',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const LIKED_POST = [
        'id' => 41,
        'description' => 'User liked post',
        'data' => []
    ];

    const UNLIKED_POST = [
        'id' => 42,
        'description' => 'User liked post',
        'data' => []
    ];

    const STARTED_SNAKE_GAME = [
        'id' => 43,
        'description' => 'User started snake game',
        'data' => []
    ];

    const FINISHED_SNAKE_GAME = [
        'id' => 44,
        'description' => 'User finished snake game',
        'data' => [
            'score' => 'Score the user got in the game'
        ]
    ];

    const STARTED_FASTEST_TYPE_GAME = [
        'id' => 45,
        'description' => 'User started fastest type game',
        'data' => []
    ];

    const FINISHED_FASTEST_TYPE_GAME = [
        'id' => 46,
        'description' => 'User finished fastest type game',
        'data' => [
            'score' => 'Score the user got in the game'
        ]
    ];

    const TURNED_ON_MAINTENANCE = [
        'id' => 47,
        'description' => 'User turned on maintenance mode',
        'data' => []
    ];

    const TURNED_OFF_MAINTENANCE = [
        'id' => 48,
        'description' => 'User turned off maintenance mode',
        'data' => []
    ];

    const UPDATED_WELCOME_BOT = [
        'id' => 49,
        'description' => 'User updated the welcome bot',
        'data' => []
    ];

    const CREATED_PREFIX = [
        'id' => 50,
        'description' => 'User created a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ]
    ];

    const UPDATED_PREFIX = [
        'id' => 51,
        'description' => 'User updated a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ]
    ];

    const DELETED_PREFIX = [
        'id' => 52,
        'description' => 'User deleted a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ]
    ];

    const UPDATED_GROUP_LIST = [
        'id' => 53,
        'description' => 'User updated group list',
        'data' => []
    ];

    const APPROVED_GROUP_APPLICATION = [
        'id' => 54,
        'description' => 'User approved group application',
        'data' => [
            'group' => 'Name of group',
            'name' => 'Name of user that got approved'
        ]
    ];

    const DENIED_GROUP_APPLICATION = [
        'id' => 55,
        'description' => 'User denied group application',
        'data' => [
            'group' => 'Name of group',
            'name' => 'Name of user that got approved'
        ]
    ];

    const DELETED_GROUP = [
        'id' => 56,
        'description' => 'User deleted group',
        'data' => [
            'group' => 'Name of group'
        ]
    ];

    const CREATED_GROUP = [
        'id' => 57,
        'description' => 'User created group',
        'data' => [
            'group' => 'Name of group'
        ]
    ];

    const UPDATED_GROUP = [
        'id' => 58,
        'description' => 'User updated group',
        'data' => [
            'group' => 'Name of group'
        ]
    ];

    const CREATED_BBCODE = [
        'id' => 59,
        'description' => 'User created bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ]
    ];

    const UPDATED_BBCODE = [
        'id' => 60,
        'description' => 'User updated bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ]
    ];

    const DELETED_BBCODE = [
        'id' => 61,
        'description' => 'User deleted bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ]
    ];

    const UPDATED_NOTICES_ORDER = [
        'id' => 62,
        'description' => 'User updated order of notices',
        'data' => []
    ];

    const DELETED_NOTICE = [
        'id' => 63,
        'description' => 'User deleted notice',
        'data' => [
            'notice' => 'Title of notice'
        ]
    ];

    const CREATED_NOTICE = [
        'id' => 64,
        'description' => 'User created notice',
        'data' => [
            'notice' => 'Title of notice'
        ]
    ];

    const UPDATED_USERS_WITH_BADGE = [
        'id' => 65,
        'description' => 'User managed users with badge',
        'data' => [
            'badge' => 'Name of badge'
        ]
    ];

    const DELETED_BADGE = [
        'id' => 66,
        'description' => 'User deleted badge',
        'data' => [
            'badge' => 'Name of badge'
        ]
    ];

    const CREATED_BADGE = [
        'id' => 67,
        'description' => 'User created badge',
        'data' => [
            'badge' => 'Name of badge'
        ]
    ];

    const UPDATED_BADGE = [
        'id' => 68,
        'description' => 'User updated badge',
        'data' => [
            'badge' => 'Name of badge'
        ]
    ];

    const UPDATED_USERS_CREDITS = [
        'id' => 69,
        'description' => 'Updated users credits',
        'data' => [
            'name' => 'Name of user',
            'amount' => 'Amount set'
        ]
    ];

    const MANAGED_THC_REQUESTS = [
        'id' => 70,
        'description' => 'Dealt with THC reqeusts',
        'data' => []
    ];

    const UPDATED_USERS_GROUPS = [
        'id' => 71,
        'description' => 'Updated users groups',
        'data' => [
            'name' => 'Name of user',
            'before' => 'Usergroups before update',
            'after' => 'Usergroups after update'
        ]
    ];

    const UPDATED_USERS_BASIC_SETTINGS = [
        'id' => 72,
        'description' => 'Updated basic settings of user',
        'data' => [
            'name' => 'Name of user',
            'userId' => 'User id of affected user'
        ]
    ];

    const BANNED_USER = [
        'id' => 73,
        'description' => 'Banned user',
        'data' => [
            'name' => 'Name of user'
        ]
    ];

    const UNBANNED_USER = [
        'id' => 74,
        'description' => 'Unbanned user',
        'data' => [
            'name' => 'Name of user'
        ]
    ];

    const UPDATED_FORUM_PERMISSIONS = [
        'id' => 75,
        'description' => 'Updated forum permissions on group',
        'data' => [
            'wasCascade' => 'If it was cascading permissions'
        ]
    ];

    const UPDATED_CATEGORIES_ORDER = [
        'id' => 76,
        'description' => 'Updated display order of categories',
        'data' => []
    ];

    const CREATED_CATEGORY = [
        'id' => 77,
        'description' => 'User created category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const UPDATED_CATEGORY = [
        'id' => 78,
        'description' => 'User updated category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const DELETED_CATEGORY = [
        'id' => 79,
        'description' => 'User deleted category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const CREATED_BETTING_CATEGORY = [
        'id' => 80,
        'description' => 'User created betting category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const UPDATED_BETTING_CATEGORY = [
        'id' => 81,
        'description' => 'User updated betting category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const DELETED_BETTING_CATEGORY = [
        'id' => 82,
        'description' => 'User deleted betting category',
        'data' => [
            'category' => 'Title of category'
        ]
    ];

    const SET_BET_RESULT = [
        'id' => 83,
        'description' => 'User set result of bet',
        'data' => [
            'bet' => 'Name of bet',
            'result' => 'Win or lose'
        ]
    ];

    const CREATED_BET = [
        'id' => 84,
        'description' => 'User created bet',
        'data' => [
            'bet' => 'Name of bet'
        ]
    ];

    const DELETED_BET = [
        'id' => 85,
        'description' => 'User deleted bet',
        'data' => [
            'bet' => 'Name of bet'
        ]
    ];

    const UPDATED_BET = [
        'id' => 86,
        'description' => 'User updated bet',
        'data' => [
            'bet' => 'Name of bet'
        ]
    ];

    const UPDATED_SITE_RULES = [
        'id' => 87,
        'description' => 'User updated the site rules',
        'data' => []
    ];

    const CREATED_THREAD = [
        'id' => 88,
        'description' => 'User created thread',
        'data' => [
            'thread' => 'Name of thread'
        ]
    ];

    const UPDATED_DISPLAY_GROUP = [
        'id' => 89,
        'description' => 'User updated display group',
        'data' => [
            'group' => 'Name of group'
        ]
    ];

    const REPORTED_A_POST = [
        'id' => 90,
        'description' => 'User reported a post',
        'data' => []
    ];

    const VOTED_ON_POLL = [
        'id' => 91,
        'description' => 'User voted on a poll',
        'data' => []
    ];

    const DELETED_POLL = [
        'id' => 92,
        'description' => 'User deleted poll',
        'data' => [
            'poll' => 'Question of poll'
        ]
    ];

    const CLOSED_THREAD = [
        'id' => 93,
        'description' => 'Mod closed thread',
        'data' => [
            'thread' => 'Title of thread'
        ]
    ];

    const OPEN_THREAD = [
        'id' => 94,
        'description' => 'Mod opened thread',
        'data' => [
            'thread' => 'Title of thread'
        ]
    ];

    const SUBSCRIBE_CATEGORY = [
        'id' => 95,
        'description' => 'User subscribed to category',
        'data' => [
            'categoryId' => 'Id of category'
        ]
    ];

    const UNSUBSCRIBE_CATEGORY = [
        'id' => 96,
        'description' => 'User unsubscribed to category',
        'data' => [
            'categoryId' => 'Id of category'
        ]
    ];

    const CHANGE_THREAD_OWNER = [
        'id' => 97,
        'description' => 'Changed owner of thread',
        'data' => [
            'threadId' => 'Id of thread',
            'originalOwner' => 'Id of original owner',
            'newOwner' => 'Id of new owner'
        ]
    ];

    const MERGE_POSTS = [
        'id' => 98,
        'description' => 'Merged posts',
        'data' => [
            'postIds' => 'Ids of posts'
        ]
    ];

    const UPDATED_COVER = [
        'id' => 99,
        'description' => 'User updated cover',
        'data' => []
    ];

    const IGNORED_CATEGORY = [
        'id' => 100,
        'description' => 'User ignored category',
        'data' => [
            'categoryId' => 'ID of category that the user ignored'
        ]
    ];

    const UNIGNORED_CATEGORY = [
        'id' => 101,
        'description' => 'User un-ignored category',
        'data' => [
            'categoryId' => 'ID of category that the user un-ignored'
        ]
    ];

    const IGNORED_THREAD = [
        'id' => 102,
        'description' => 'User ignored thread',
        'data' => [
            'threadId' => 'ID of thread that the user ignored'
        ]
    ];

    const UNIGNORED_THREAD = [
        'id' => 103,
        'description' => 'User un-ignored thread',
        'data' => [
            'threadId' => 'ID of thread that the user un-ignored'
        ]
    ];
    const MOVE_THREADS = [
        'id' => 104,
        'description' => 'Moved threads',
        'data' => [
            'threadIds' => 'Ids of threads',
            'sourceId' => 'Category moved from',
            'destinationId' => 'Category moved to'
        ]
    ];

    const MERGED_USERS = [
        'id' => 105,
        'description' => 'Merged users',
        'data' => [
            'srcUserId' => 'Id of source user',
            'destUserId' => 'Id of destination user'
        ]
    ];

    const UPDATED_CONNECTION_INFORMATION = [
        'id' => 106,
        'description' => 'Updated radio connection information',
        'data' => [
            'oldInformation' => 'Old information.',
            'newInformation' => 'New information.'
        ]
    ];

    const CREATED_AUTO_BAN = [
        'id' => 107,
        'description' => 'Created auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ]
    ];

    const DELETED_AUTO_BAN = [
        'id' => 108,
        'description' => 'Deleted auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ]
    ];

    const UPDATED_AUTO_BAN = [
        'id' => 109,
        'description' => 'Deleted auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ]
    ];

    const UPDATED_STAFF_OF_THE_WEEK = [
        'id' => 110,
        'description' => 'Updated the staff of the week',
        'data' => []
    ];

    const UPDATED_MEMBER_OF_THE_MONTH = [
        'id' => 111,
        'description' => 'Updated the member of the month',
        'data' => []
    ];

    const DELETED_INFRACTION_LEVEL = [
        'id' => 112,
        'description' => 'Deleted infraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ]
    ];

    const CREATED_INFRACTION_LEVEL = [
        'id' => 113,
        'description' => 'Created infraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ]
    ];

    const UPDATED_INFRACTION_LEVEL = [
        'id' => 114,
        'description' => 'Update infraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ]
    ];

    const CREATED_INFRACTION = [
        'id' => 115,
        'description' => 'Infracted user',
        'data' => [
            'userId' => 'Id of user infracted',
            'reason' => 'Reason for infraction'
        ]
    ];

    const CREATED_DO_NOT_HIRE = [
        'id' => 116,
        'description' => 'Added Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ]
    ];

    const UPDATED_DO_NOT_HIRE = [
        'id' => 117,
        'description' => 'Updated Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ]
    ];

    const DELETED_DO_NOT_HIRE = [
        'id' => 118,
        'description' => 'Deleted Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ]
    ];

    const DELETED_INFRACTION = [
        'id' => 119,
        'description' => 'Deleted infraction',
        'data' => [
            'infractionId' => 'Id of infraction'
        ]
    ];

    const CREATED_BAN_ON_SIGHT = [
        'id' => 120,
        'description' => 'Added Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ]
    ];

    const UPDATED_BAN_ON_SIGHT = [
        'id' => 121,
        'description' => 'Updated Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ]
    ];

    const DELETED_BAN_ON_SIGHT = [
        'id' => 122,
        'description' => 'Deleted Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ]
    ];

    const CREATED_SHOP_CATEGORY = [
        'id' => 123,
        'description' => 'Created a shop category',
        'data' => [
            'title' => 'Created shop category with title'
        ]
    ];

    const UPDATED_SHOP_CATEGORY = [
        'id' => 124,
        'description' => 'Updated shop category',
        'data' => [
            'title' => 'Updated shop category with title'
        ]
    ];

    const DELETED_SHOP_CATEGORY = [
        'id' => 125,
        'description' => 'Deleted shop category',
        'data' => [
            'title' => 'Deleted shop category with title'
        ]
    ];

    const UPDATED_NAVIGATION = [
        'id' => 126,
        'description' => 'Updated navigation',
        'data' => [
            'oldNavigation' => 'Json formatted old navigation',
            'newNavigation' => 'Json formatted new navigation'
        ]
    ];

    const UPDATE_EMAIL = [
        'id' => 127,
        'description' => 'Updated Email',
        'data' => []
    ];

    const CREATED_SITE_MESSAGE = [
        'id' => 128,
        'description' => 'Created site message',
        'data' => [
            'siteMessageId' => 'Id of the site message'
        ]
    ];

    const UPDATED_SITE_MESSAGE = [
        'id' => 129,
        'description' => 'Updated site message',
        'data' => [
            'siteMessageId' => 'Id of the site message'
        ]
    ];

    const DELETED_SITE_MESSAGE = [
        'id' => 130,
        'description' => 'Deleted site message',
        'data' => [
            'siteMessageId' => 'Id of the site message'
        ]
    ];

    const CHANGED_NICKNAME = [
        'id' => 131,
        'description' => 'User changed nickname',
        'data' => [
            'old' => 'Old nickname',
            'new' => 'New nickname'
        ]
    ];

    const CREATED_PAGE = [
        'id' => 132,
        'description' => 'Created page',
        'data' => [
            'title' => 'Title of page'
        ]
    ];

    const UPDATED_PAGE = [
        'id' => 133,
        'description' => 'Updated page',
        'data' => [
            'title' => 'Title of page'
        ]
    ];

    const DELETED_PAGE = [
        'id' => 134,
        'description' => 'Deleted page',
        'data' => [
            'title' => 'Title of page'
        ]
    ];

    const SUSPENDED_BET = [
        'id' => 135,
        'description' => 'Suspended bet',
        'data' => [
            'bet' => 'Title bet'
        ]
    ];

    const UNSUSPENDED_BET = [
        'id' => 136,
        'description' => 'Unsuspended bet',
        'data' => [
            'bet' => 'Title bet'
        ]
    ];
}
