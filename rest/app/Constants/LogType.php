<?php

namespace App\Constants;

use App\Utils\Iterables;
use ReflectionClass;
use ReflectionException;

/**
 * This will suppress all the PMD warnings in
 * this class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassLength)
 */
class LogType {


    public static function getAction($action) {
        return $action['id'];
    }

    public static function getActionFromId($actionId) {
        try {
            return (object) Iterables::find(
                self::getAllConstants(),
                function ($action) use ($actionId) {
                    return $action['id'] == $actionId;
                }
            );
        } catch (ReflectionException $e) {
            return null;
        }
    }

    public static function getActionsByLog($log) {
        try {
            return Iterables::filter(
                self::getAllConstants(),
                function ($action) use ($log) {
                    return $action['log'] == $log;
                }
            );
        } catch (ReflectionException $e) {
            return null;
        }
    }

    /**
     * @return array
     * @throws ReflectionException
     */
    public static function getAllConstants() {
        return (new ReflectionClass(get_class()))->getConstants();
    }

    const WON_ROULETTE = [
        'id' => 1,
        'description' => 'User won a roulette game',
        'data' => [
            'profit' => 'Amount user won'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const LOST_ROULETTE = [
        'id' => 2,
        'description' => 'User lost a roulette game',
        'data' => [
            'amount' => 'Amount that user lost'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const PLACED_BET = [
        'id' => 3,
        'description' => 'User placed a bet',
        'data' => [
            'bet' => 'Bet object',
            'userBet' => 'Bet object of the user bet'
        ],
        'log' => 'log_user',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const REGISTERED = [
        'id' => 4,
        'description' => 'User registered',
        'data' => [
            'name' => 'Name of user that registered'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_SOCIAL_NETWORKS = [
        'id' => 5,
        'description' => 'User updated social networks',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_AVATAR = [
        'id' => 6,
        'description' => 'User updated a avatar',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_SIGNATURE = [
        'id' => 7,
        'description' => 'User updated a signature',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const APPLIED_FOR_GROUP = [
        'id' => 8,
        'description' => 'User applied for a group',
        'data' => [
            'name' => 'Name of group'
        ],
        'log' => 'log_user',
        'contentId' => 'groupId',
        'contentTable' => 'groups',
        'contentSelect' => 'name'
    ];

    const LEFT_GROUP = [
        'id' => 9,
        'description' => 'User left a group',
        'data' => [
            'name' => 'Name of group'
        ],
        'log' => 'log_user',
        'contentId' => 'groupId',
        'contentTable' => 'groups',
        'contentSelect' => 'name'
    ];

    const UPDATED_IGNORED_NOTIFICATIONS = [
        'id' => 10,
        'description' => 'User updated their ignored notifications',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_HOMEPAGE = [
        'id' => 11,
        'description' => 'User updated their homepage',
        'data' => [
            'homepage' => 'Homepage that was set'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_PASSWORD = [
        'id' => 12,
        'description' => 'User updated a password',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_POSTBIT = [
        'id' => 14,
        'description' => 'User updated their a postbit',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const REQUESTED_THC_FOR_USER = [
        'id' => 15,
        'description' => 'User requested THC for another user',
        'data' => [
            'name' => 'User the request was for',
            'amount' => 'Amount of credits requested'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_DJ_SAYS = [
        'id' => 16,
        'description' => 'Updated the DJ Says',
        'data' => [
            'says' => 'Updated the says to'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const KICKED_DJ_OFF = [
        'id' => 17,
        'description' => 'Kicked a current DJ off air',
        'data' => [],
        'log' => 'log_staff',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const LIKED_DJ = [
        'id' => 18,
        'description' => 'Liked the current DJ',
        'data' => [],
        'log' => 'log_user',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const DID_RADIO_REQUEST = [
        'id' => 19,
        'description' => 'Sent a request to current DJ',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UNBOOKED_RADIO_SLOT = [
        'id' => 20,
        'description' => 'User unbooked a slot',
        'data' => [
            'timetableId' => 'ID of timetable that was unbooked'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const BOOKED_RADIO_SLOT = [
        'id' => 21,
        'description' => 'User booked a slot',
        'data' => [
            'timetableId' => 'timetableId'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const BOOKED_PERM_SLOT = [
        'id' => 22,
        'description' => 'User booked a permanent slot',
        'data' => [
            'timetableId' => 'ID of booking'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const EDITED_PERM_SLOT = [
        'id' => 23,
        'description' => 'User edited a permanent slot',
        'data' => [
            'show' => 'Name of the perm show'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_PERM_SLOT = [
        'id' => 24,
        'description' => 'User deleted a permanent slot',
        'data' => [
            'timetableId' => 'ID of booking'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_EVENT_TYPE = [
        'id' => 25,
        'description' => 'User created a event type',
        'data' => [
            'event' => 'Name of event'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_EVENT_TYPE = [
        'id' => 26,
        'description' => 'User created a event type',
        'data' => [
            'event' => 'Name of event'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_EVENT_TYPE = [
        'id' => 27,
        'description' => 'User deleted a event type',
        'data' => [
            'event' => 'Name of event'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UNBOOKED_EVENT_SLOT = [
        'id' => 28,
        'description' => 'User unbooked a slot',
        'data' => [
            'timetableId' => 'ID of slot that got unbooked'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const BOOKED_EVENT_SLOT = [
        'id' => 29,
        'description' => 'User booked a slot',
        'data' => [
            'timetableId' => 'ID of slot that got unbooked'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_POST = [
        'id' => 30,
        'description' => 'User deleted a post',
        'data' => [
            'thread' => 'Name of thread'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const APPROVED_POST = [
        'id' => 31,
        'description' => 'User approved a post',
        'data' => [
            'thread' => 'Name of thread'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UNAPPROVED_POST = [
        'id' => 32,
        'description' => 'User unapproved a post',
        'data' => [
            'thread' => 'Name of thread'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const STICKIED_THREAD = [
        'id' => 33,
        'description' => 'User stickied a thread',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UNSTICKIED_THREAD = [
        'id' => 34,
        'description' => 'User unstickied a thread',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const APPROVED_THREAD = [
        'id' => 35,
        'description' => 'User approved a thread',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UNAPPROVED_THREAD = [
        'id' => 36,
        'description' => 'User unapproved a thread',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const DELETED_THREAD = [
        'id' => 37,
        'description' => 'User deleted a thread',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UPDATED_THREAD = [
        'id' => 38,
        'description' => 'User updated a thread',
        'data' => [
            'thread' => 'Name of thread',
            'postId' => 'ID of post for the thread',
            'newContent' => 'New content',
            'oldContent' => 'Old content'
        ],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UPDATED_POST = [
        'id' => 39,
        'description' => 'User updated a post',
        'data' => [
            'thread' => 'Name of thread',
            'postId' => 'ID of post for the thread',
            'oldContent' => 'Content before update',
            'newContent' => 'Content after update'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_POST = [
        'id' => 40,
        'description' => 'User created a post',
        'data' => [
            'thread' => 'Name of thread',
            'threadId' => 'Id of thread',
            'categoryId' => 'Id of category'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const LIKED_POST = [
        'id' => 41,
        'description' => 'User liked a post',
        'data' => [
            'thread' => 'Name of thread',
            'threadId' => 'Id of thread',
            'categoryId' => 'Id of category'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UNLIKED_POST = [
        'id' => 42,
        'description' => 'User unliked a post',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const STARTED_SNAKE_GAME = [
        'id' => 43,
        'description' => 'User started snake a game',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const FINISHED_SNAKE_GAME = [
        'id' => 44,
        'description' => 'User finished snake a game',
        'data' => [
            'score' => 'Score the user got in the game'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const STARTED_FASTEST_TYPE_GAME = [
        'id' => 45,
        'description' => 'User started a fastest type game',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const FINISHED_FASTEST_TYPE_GAME = [
        'id' => 46,
        'description' => 'User finished a fastest type game',
        'data' => [
            'score' => 'Score the user got in the game'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const TURNED_ON_MAINTENANCE = [
        'id' => 47,
        'description' => 'User turned on maintenance mode',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const TURNED_OFF_MAINTENANCE = [
        'id' => 48,
        'description' => 'User turned off maintenance mode',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_BOT_SETTINGS = [
        'id' => 49,
        'description' => 'User updated the bot settings',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_PREFIX = [
        'id' => 50,
        'description' => 'User created a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'prefixId',
        'contentTable' => 'prefixes',
        'contentSelect' => 'text'
    ];

    const UPDATED_PREFIX = [
        'id' => 51,
        'description' => 'User updated a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'prefixId',
        'contentTable' => 'prefixes',
        'contentSelect' => 'text'
    ];

    const DELETED_PREFIX = [
        'id' => 52,
        'description' => 'User deleted a prefix',
        'data' => [
            'prefix' => 'Name of prefix'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'prefixId',
        'contentTable' => 'prefixes',
        'contentSelect' => 'text'
    ];

    const UPDATED_GROUP_LIST = [
        'id' => 53,
        'description' => 'User updated a group list',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const APPROVED_GROUP_APPLICATION = [
        'id' => 54,
        'description' => 'User approved a group application',
        'data' => [
            'group' => 'Name of group',
            'name' => 'Name of user that got approved'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DENIED_GROUP_APPLICATION = [
        'id' => 55,
        'description' => 'User denied a group application',
        'data' => [
            'group' => 'Name of group',
            'name' => 'Name of user that got approved'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_GROUP = [
        'id' => 56,
        'description' => 'User deleted a group',
        'data' => [
            'group' => 'Name of group'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'groupId',
        'contentTable' => 'groups',
        'contentSelect' => 'name'
    ];

    const CREATED_GROUP = [
        'id' => 57,
        'description' => 'User created a group',
        'data' => [
            'group' => 'Name of group'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'groupId',
        'contentTable' => 'groups',
        'contentSelect' => 'name'
    ];

    const UPDATED_GROUP = [
        'id' => 58,
        'description' => 'User updated a group',
        'data' => [
            'group' => 'Name of group',
            'sitecpPermissionsBefore' => 'Sitecp permissions before editing',
            'sitecpPermissionsAfter' => 'Sitecp permissions after editing',
            'staffcpPermissionsBefore' => 'Staffcp permissions before editing',
            'staffcpPermissionsAfter' => 'Staffcp permissions after editing',
        ],
        'log' => 'log_sitecp',
        'contentId' => 'groupId',
        'contentTable' => 'groups',
        'contentSelect' => 'name'
    ];

    const CREATED_BBCODE = [
        'id' => 59,
        'description' => 'User created a bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'bbcodeId',
        'contentTable' => 'bbcodes',
        'contentSelect' => 'name'
    ];

    const UPDATED_BBCODE = [
        'id' => 60,
        'description' => 'User updated a bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'bbcodeId',
        'contentTable' => 'bbcodes',
        'contentSelect' => 'name'
    ];

    const DELETED_BBCODE = [
        'id' => 61,
        'description' => 'User deleted a bbcode',
        'data' => [
            'bbcode' => 'name of bbcode'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'bbcodeId',
        'contentTable' => 'bbcodes',
        'contentSelect' => 'name'
    ];

    const UPDATED_NOTICES_ORDER = [
        'id' => 62,
        'description' => 'User updated order of a notice',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_NOTICE = [
        'id' => 63,
        'description' => 'User deleted a notice',
        'data' => [
            'notice' => 'Title of notice'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_NOTICE = [
        'id' => 64,
        'description' => 'User created a notice',
        'data' => [
            'notice' => 'Title of notice'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_USERS_WITH_BADGE = [
        'id' => 65,
        'description' => 'User managed users with a badge',
        'data' => [
            'badge' => 'Name of badge'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_BADGE = [
        'id' => 66,
        'description' => 'User deleted a badge',
        'data' => [
            'badge' => 'Name of badge'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'badgeId',
        'contentTable' => 'badges',
        'contentSelect' => 'name'
    ];

    const CREATED_BADGE = [
        'id' => 67,
        'description' => 'User created a badge',
        'data' => [
            'badge' => 'Name of badge'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'badgeId',
        'contentTable' => 'badges',
        'contentSelect' => 'name'
    ];

    const UPDATED_BADGE = [
        'id' => 68,
        'description' => 'User updated a badge',
        'data' => [
            'badge' => 'Name of badge'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'badgeId',
        'contentTable' => 'badges',
        'contentSelect' => 'name'
    ];

    const MANAGED_THC_REQUESTS = [
        'id' => 70,
        'description' => 'Dealt with a THC requests',
        'data' => [
            'forUser' => 'User to get the THC',
            'forUserId', 'Id of user that got the THC',
            'amount' => 'Amount that would be given',
            'wasApproved' => 'Was the request approved'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_USERS_GROUPS = [
        'id' => 71,
        'description' => 'Updated a users group',
        'data' => [
            'before' => 'Usergroup ids before update',
            'after' => 'Usergroup ids after update'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const UPDATED_USERS_BASIC_SETTINGS = [
        'id' => 72,
        'description' => 'Updated basic settings of a user',
        'data' => [
            'beforeNickname' => 'Nickname before change',
            'afterNickname' => 'Nickname after change',
            'beforeHabbo' => 'Habbo before change',
            'afterHabbo' => 'Habbo after change'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const BANNED_USER = [
        'id' => 73,
        'description' => 'Banned a user',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const UNBANNED_USER = [
        'id' => 74,
        'description' => 'Unbanned a user',
        'data' => [
            'name' => 'Name of user'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const UPDATED_FORUM_PERMISSIONS = [
        'id' => 75,
        'description' => 'Updated forum permission on group',
        'data' => [
            'wasCascade' => 'If it was cascading permissions',
            'permissionsBefore' => 'Forum perms before update',
            'permissionsAfter' => 'Forum perms after update'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const UPDATED_CATEGORIES_ORDER = [
        'id' => 76,
        'description' => 'Updated display order of a categories',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_CATEGORY = [
        'id' => 77,
        'description' => 'User created a category',
        'data' => [
            'category' => 'Title of category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const UPDATED_CATEGORY = [
        'id' => 78,
        'description' => 'User updated a category',
        'data' => [
            'before' => 'Before',
            'after' => 'After',
            'isCascade' => 'If the update was cascading for options'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const DELETED_CATEGORY = [
        'id' => 79,
        'description' => 'User deleted a category',
        'data' => [
            'category' => 'Category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const CREATED_BETTING_CATEGORY = [
        'id' => 80,
        'description' => 'User created a betting category',
        'data' => [
            'category' => 'Title of category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'bet_categories',
        'contentSelect' => 'name'
    ];

    const UPDATED_BETTING_CATEGORY = [
        'id' => 81,
        'description' => 'User updated a betting category',
        'data' => [
            'category' => 'Title of category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'bet_categories',
        'contentSelect' => 'name'
    ];

    const DELETED_BETTING_CATEGORY = [
        'id' => 82,
        'description' => 'User deleted a betting category',
        'data' => [
            'category' => 'Title of category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'bet_categories',
        'contentSelect' => 'name'
    ];

    const SET_BET_RESULT = [
        'id' => 83,
        'description' => 'User set result of a bet',
        'data' => [
            'bet' => 'Name of bet',
            'result' => 'Win or lose'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const CREATED_BET = [
        'id' => 84,
        'description' => 'User created a bet',
        'data' => [
            'bet' => 'Name of bet'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const DELETED_BET = [
        'id' => 85,
        'description' => 'User deleted a bet',
        'data' => [
            'bet' => 'Name of bet'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const UPDATED_BET = [
        'id' => 86,
        'description' => 'User updated a bet',
        'data' => [
            'bet' => 'Name of bet'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const CREATED_THREAD = [
        'id' => 88,
        'description' => 'User created a thread',
        'data' => [
            'thread' => 'Name of thread',
            'threadId' => 'Id of thread',
            'categoryId' => 'Id of category'
        ],
        'log' => 'log_user',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UPDATED_DISPLAY_GROUP = [
        'id' => 89,
        'description' => 'User updated a display group',
        'data' => [
            'group' => 'Name of group'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const REPORTED_A_POST = [
        'id' => 90,
        'description' => 'User reported a post',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const VOTED_ON_POLL = [
        'id' => 91,
        'description' => 'User voted on a poll',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_POLL = [
        'id' => 92,
        'description' => 'User deleted a poll',
        'data' => [
            'poll' => 'Question of poll'
        ],
        'log' => 'log_mod',
        'contentId' => 'threadPollId',
        'contentTable' => 'thread_polls',
        'contentSelect' => 'question'
    ];

    const CLOSED_THREAD = [
        'id' => 93,
        'description' => 'Mod closed a thread',
        'data' => [
            'thread' => 'Title of thread'
        ],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const OPEN_THREAD = [
        'id' => 94,
        'description' => 'Mod opened a thread',
        'data' => [
            'thread' => 'Title of thread'
        ],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const SUBSCRIBE_CATEGORY = [
        'id' => 95,
        'description' => 'User subscribed to a category',
        'data' => [
            'categoryId' => 'Id of category'
        ],
        'log' => 'log_user',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const UNSUBSCRIBE_CATEGORY = [
        'id' => 96,
        'description' => 'User unsubscribed to a category',
        'data' => [
            'categoryId' => 'Id of category'
        ],
        'log' => 'log_user',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const CHANGE_THREAD_OWNER = [
        'id' => 97,
        'description' => 'Changed owner of a thread',
        'data' => [
            'threadId' => 'Id of thread',
            'originalOwner' => 'Id of original owner',
            'newOwner' => 'Id of new owner'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const MERGE_POSTS = [
        'id' => 98,
        'description' => 'Merged posts',
        'data' => [
            'postIds' => 'Ids of posts'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_COVER = [
        'id' => 99,
        'description' => 'User updated cover',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const IGNORED_CATEGORY = [
        'id' => 100,
        'description' => 'User ignored category',
        'data' => [
            'categoryIds' => 'IDs of categories that the user ignored'
        ],
        'log' => 'log_user',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const UNIGNORED_CATEGORY = [
        'id' => 101,
        'description' => 'User unignored category',
        'data' => [
            'categoryId' => 'ID of category that the user unignored'
        ],
        'log' => 'log_user',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];

    const IGNORED_THREAD = [
        'id' => 102,
        'description' => 'User ignored thread',
        'data' => [
            'threadId' => 'ID of thread that the user ignored'
        ],
        'log' => 'log_user',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const UNIGNORED_THREAD = [
        'id' => 103,
        'description' => 'User unignored thread',
        'data' => [
            'threadId' => 'ID of thread that the user unignored'
        ],
        'log' => 'log_user',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];
    const MOVE_THREADS = [
        'id' => 104,
        'description' => 'Moved threads',
        'data' => [
            'threadIds' => 'Ids of threads',
            'sourceId' => 'Category moved from',
            'targetId' => 'Category moved to'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const MERGED_USERS = [
        'id' => 105,
        'description' => 'Merged users',
        'data' => [
            'sourceUser' => 'Source user',
            'targetUser' => 'Target user'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_CONNECTION_INFORMATION = [
        'id' => 106,
        'description' => 'Updated radio connection information',
        'data' => [
            'oldInformation' => 'Old information.',
            'newInformation' => 'New information.'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_AUTO_BAN = [
        'id' => 107,
        'description' => 'Created a auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'autoBanId',
        'contentTable' => 'auto_bans',
        'contentSelect' => 'title'
    ];

    const DELETED_AUTO_BAN = [
        'id' => 108,
        'description' => 'Deleted a auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'autoBanId',
        'contentTable' => 'auto_bans',
        'contentSelect' => 'title'
    ];

    const UPDATED_AUTO_BAN = [
        'id' => 109,
        'description' => 'Updated a auto ban',
        'data' => [
            'title' => 'Title of automatic ban'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'autoBanId',
        'contentTable' => 'auto_bans',
        'contentSelect' => 'title'
    ];

    const UPDATED_OUTSTANDING_STAFF = [
        'id' => 110,
        'description' => 'Updated the outstanding staff',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_MEMBER_OF_THE_MONTH = [
        'id' => 111,
        'description' => 'Updated the member of the month',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_INFRACTION_LEVEL = [
        'id' => 112,
        'description' => 'Deleted a infraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'infractionLevelId',
        'contentTable' => 'infraction_levels',
        'contentSelect' => 'title'
    ];

    const CREATED_INFRACTION_LEVEL = [
        'id' => 113,
        'description' => 'Created a infraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'infractionLevelId',
        'contentTable' => 'infraction_levels',
        'contentSelect' => 'title'
    ];

    const UPDATED_INFRACTION_LEVEL = [
        'id' => 114,
        'description' => 'Update a iinfraction level',
        'data' => [
            'infractionLevelId' => 'Id of infraction level'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'infractionLevelId',
        'contentTable' => 'infraction_levels',
        'contentSelect' => 'title'
    ];

    const CREATED_INFRACTION = [
        'id' => 115,
        'description' => 'Infracted a user',
        'data' => [
            'userId' => 'Id of user infracted',
            'reason' => 'Reason for infraction'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_DO_NOT_HIRE = [
        'id' => 116,
        'description' => 'Added a Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_DO_NOT_HIRE = [
        'id' => 117,
        'description' => 'Updated a Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_DO_NOT_HIRE = [
        'id' => 118,
        'description' => 'Deleted a Do Not Hire entry.',
        'data' => [
            'nickname' => 'Name of the user.'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_INFRACTION = [
        'id' => 119,
        'description' => 'Deleted a Infraction',
        'data' => [
            'infractionId' => 'Id of infraction'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_BAN_ON_SIGHT = [
        'id' => 120,
        'description' => 'Added a Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_BAN_ON_SIGHT = [
        'id' => 121,
        'description' => 'Updated a Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_BAN_ON_SIGHT = [
        'id' => 122,
        'description' => 'Deleted a Ban On Sight entry',
        'data' => [
            'name' => 'Name of the user'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_NAVIGATION = [
        'id' => 126,
        'description' => 'Updated site navigation',
        'data' => [
            'oldNavigation' => 'Json formatted old navigation',
            'newNavigation' => 'Json formatted new navigation'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_HABBO = [
        'id' => 127,
        'description' => 'Updated a Habbo name',
        'data' => [
            'from' => 'had habbo name',
            'to' => 'new habbo name'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_SITE_MESSAGE = [
        'id' => 128,
        'description' => 'Created a site message',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'siteMessageId',
        'contentTable' => 'site_messages',
        'contentSelect' => 'title'
    ];

    const UPDATED_SITE_MESSAGE = [
        'id' => 129,
        'description' => 'Updated a site message',
        'data' => [
            'siteMessageId' => 'Id of the site message'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'siteMessageId',
        'contentTable' => 'site_messages',
        'contentSelect' => 'title'
    ];

    const DELETED_SITE_MESSAGE = [
        'id' => 130,
        'description' => 'Deleted site message',
        'data' => [
            'siteMessageId' => 'Id of the site message'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'siteMessageId',
        'contentTable' => 'site_messages',
        'contentSelect' => 'title'
    ];

    const CHANGED_NICKNAME = [
        'id' => 131,
        'description' => 'User changed nickname',
        'data' => [
            'old' => 'Old nickname',
            'new' => 'New nickname',
            'stolenFromOld' => 'User that had the nickname before',
            'stolenFromNew' => 'Users new nickname'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_PAGE = [
        'id' => 132,
        'description' => 'Created a page',
        'data' => [
            'title' => 'Title of page'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_PAGE = [
        'id' => 133,
        'description' => 'Updated a page',
        'data' => [
            'title' => 'Title of page'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_PAGE = [
        'id' => 134,
        'description' => 'Deleted a page',
        'data' => [
            'title' => 'Title of page'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const SUSPENDED_BET = [
        'id' => 135,
        'description' => 'Suspended a bet',
        'data' => [
            'bet' => 'Title bet'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const UNSUSPENDED_BET = [
        'id' => 136,
        'description' => 'Unsuspended a bet',
        'data' => [
            'bet' => 'Title bet'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'betId',
        'contentTable' => 'bets',
        'contentSelect' => 'name'
    ];

    const CREATED_THEME = [
        'id' => 137,
        'description' => 'Created a Theme',
        'data' => [
            'theme' => 'Title of theme'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_THEME = [
        'id' => 138,
        'description' => 'Updated a Theme',
        'data' => [
            'theme' => 'Title of theme'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_THEME = [
        'id' => 139,
        'description' => 'Deleted a Theme',
        'data' => [
            'theme' => 'Title of theme'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const MADE_THEME_DEFAULT = [
        'id' => 140,
        'description' => 'Made theme default',
        'data' => [
            'theme' => 'Title of theme'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CLEARED_THEME_DEFAULT = [
        'id' => 141,
        'description' => 'Cleared default theme',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const SELECTED_THEME = [
        'id' => 142,
        'description' => 'User selected a theme',
        'data' => [
            'theme' => 'Title of the theme'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_VOUCHER_CODE = [
        'id' => 143,
        'description' => 'Created a voucher code',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_VOUCHER_CODE = [
        'id' => 144,
        'description' => 'Deleted a voucher code',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CLAIMED_VOUCHER_CODE = [
        'id' => 145,
        'description' => 'Claimed a voucher code',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CHANGE_POST_OWNER = [
        'id' => 146,
        'description' => 'Changed owner of post',
        'data' => [
            'postId' => 'Id of post',
            'originalOwner' => 'Id of original owner',
            'newOwner' => 'Id of new owner'
        ],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const FOLLOWED = [
        'id' => 147,
        'description' => 'Followed a user',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UNFOLLOWED = [
        'id' => 148,
        'description' => 'Followed a user',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_PROFILE = [
        'id' => 149,
        'description' => 'User updated profile a setting',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const APPROVED_FOLLOWER = [
        'id' => 150,
        'description' => 'Approved a follower request',
        'data' => [
            'user' => 'Nickname of user that got denied'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DENIED_FOLLOWER = [
        'id' => 151,
        'description' => 'Denied a follower request',
        'data' => [
            'user' => 'Nickname of user that got denied'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const REMOVED_FOLLOWER = [
        'id' => 152,
        'description' => 'Removed follower',
        'data' => [
            'user' => 'Nickname of user that got removed!'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_AVATAR = [
        'id' => 153,
        'description' => 'Deleted a avatar',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const DELETED_COVER_PHOTO = [
        'id' => 154,
        'description' => 'Deleted a cover photo',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const DELETED_SIGNATURE = [
        'id' => 155,
        'description' => 'Deleted a signature',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const CREATED_VISITOR_MESSAGE = [
        'id' => 156,
        'description' => 'Created a visitor message',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_VISITOR_MESSAGE_LIKE = [
        'id' => 157,
        'description' => 'Created a visitor message like',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_VISITOR_MESSAGE_LIKE = [
        'id' => 158,
        'description' => 'Deleted a visitor message like',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const REPORTED_VISITOR_MESSAGE = [
        'id' => 159,
        'description' => 'Reported a visitor message',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_VISITOR_MESSAGE = [
        'id' => 160,
        'description' => 'Deleted a visitor message',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const SEARCHED = [
        'id' => 162,
        'description' => 'User did a search',
        'data' => [
            'text' => 'Search text',
            'type' => 'Type of search'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_ACCOLADE = [
        'id' => 163,
        'description' => 'Created a accolade for user',
        'data' => [
            'accoladeId' => 'ID of accolade'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_ACCOLADE = [
        'id' => 164,
        'description' => 'Updated a accolade for user',
        'data' => [
            'accoladeId' => 'ID of accolade'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_ACCOLADE = [
        'id' => 165,
        'description' => 'Deleted a accolade for user',
        'data' => [
            'accoladeId' => 'ID of accolade'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_HOME_PAGE_THREADS = [
        'id' => 166,
        'description' => 'Updated a category id to fetch threads from',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const LIKED_HOST = [
        'id' => 167,
        'description' => 'Liked the current host',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_SUBSCRIPTION = [
        'id' => 168,
        'description' => 'Created a subscription',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'subscriptionId',
        'contentTable' => 'subscriptions',
        'contentSelect' => 'title'
    ];

    const UPDATED_SUBSCRIPTION = [
        'id' => 169,
        'description' => 'Updated a subscription',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'subscriptionId',
        'contentTable' => 'subscriptions',
        'contentSelect' => 'title'
    ];

    const DELETED_SUBSCRIPTION = [
        'id' => 170,
        'description' => 'Deleted a subscription',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => 'subscriptionId',
        'contentTable' => 'subscriptions',
        'contentSelect' => 'title'
    ];

    const CREATED_USER_SUBSCRIPTION = [
        'id' => 171,
        'description' => 'Created a user subscription',
        'data' => [
            'subscriptionId' => 'ID of subscription',
            'expiresAt' => 'When the subscription will expire'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const UPDATED_USER_SUBSCRIPTION = [
        'id' => 172,
        'description' => 'Updated a user subscription',
        'data' => [
            'subscriptionId' => 'ID of subscription',
            'beforeExpiresAt' => 'When the subscription will expire before update',
            'afterExpiresAt' => 'When the subscription will expire after update'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const DELETED_USER_SUBSCRIPTION = [
        'id' => 173,
        'description' => 'Deleted a user subscription',
        'data' => [
            'subscriptionId' => 'ID of subscription'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const UPDATED_NAME_COLORS = [
        'id' => 174,
        'description' => 'User updated name colors',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_APPLICATION = [
        'id' => 175,
        'description' => 'User created job application',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_CONTACT = [
        'id' => 176,
        'description' => 'User contacted',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_SHOP_ITEM = [
        'id' => 177,
        'description' => 'User created shop item',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_SHOP_ITEM = [
        'id' => 178,
        'description' => 'User updated shop item',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_SHOP_ITEM = [
        'id' => 179,
        'description' => 'User deleted shop item',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const READ_ALL_CATEGORIES = [
        'id' => 180,
        'description' => 'User read all categories',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const CREATED_LOOT_BOX = [
        'id' => 181,
        'description' => 'User created loot box',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_LOOT_BOX = [
        'id' => 182,
        'description' => 'User updated loot box',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_LOOT_BOX = [
        'id' => 183,
        'description' => 'User deleted loot box',
        'data' => [],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const OPENED_LOOT_BOX = [
        'id' => 184,
        'description' => 'User opened loot box',
        'data' => [
            'isWin' => 'Boolean',
            'shopItemId' => 'Item ID'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const BOUGHT_SUBSCRIPTION = [
        'id' => 185,
        'description' => 'User bought a subscription',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const SHOWED_USER_BAR = [
        'id' => 186,
        'description' => 'User showed userbar',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const HIDDEN_USER_BAR = [
        'id' => 187,
        'description' => 'User hidden userbar',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_TAB = [
        'id' => 188,
        'description' => 'User deleted one of their tabs',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const ADDED_TAB = [
        'id' => 189,
        'description' => 'User added one of their tabs',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    /**
     *
     *
     * @deprecated
     */
    const EDITED_TIMETABLE_SLOT = [
        'id' => 190,
        'description' => 'User edited timetable slot',
        'data' => [
            'userIdBefore' => 'Who had the slot before',
            'userIdAfter' => 'Who have the slow now',
            'eventIdBefore' => 'Event ID before',
            'eventIdAfter' => 'Event ID after'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const GAVE_USERS_ITEM = [
        'id' => 191,
        'description' => 'User gave users item',
        'data' => [
            'receiverIds' => 'User IDs of the receivers',
            'shopItemId' => 'Shop item ID of the item'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_USER_ITEM = [
        'id' => 192,
        'description' => 'User deleted another user an item',
        'data' => [
            'shopItemId' => 'ID of shop item',
            'userId' => 'ID of user that lost the item'
        ],
        'log' => 'log_sitecp',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const UPDATED_TABS = [
        'id' => 193,
        'description' => 'User updated their tabs',
        'data' => [],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const EDITED_EVENTS_TIMETABLE_SLOT = [
        'id' => 194,
        'description' => 'User edited events timetable slot',
        'data' => [
            'userIdBefore' => 'Who had the slot before',
            'userIdAfter' => 'Who have the slow now',
            'eventIdBefore' => 'Event ID before',
            'eventIdAfter' => 'Event ID after',
            'timetableId' => 'ID of timetable slot'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const EDITED_RADIO_TIMETABLE_SLOT = [
        'id' => 195,
        'description' => 'User edited radio timetable slot',
        'data' => [
            'userIdBefore' => 'Who had the slot before',
            'userIdAfter' => 'Who have the slow now',
            'eventIdBefore' => 'Event ID before',
            'eventIdAfter' => 'Event ID after',
            'timetableId' => 'ID of timetable slot'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const DELETED_RADIO_REQUEST = [
        'id' => 196,
        'description' => 'User deleted a radio request',
        'data' => [
            'content' => 'Text in request'
        ],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const SENT_THC = [
        'id' => 197,
        'description' => 'User send another user THC',
        'data' => [
            'receiver' => 'User that received the THC',
            'amount' => 'How much they received'
        ],
        'log' => 'log_user',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const MERGED_THREAD = [
        'id' => 198,
        'description' => 'User merged threads',
        'data' => [
            'sourceThread' => 'Name of source thread',
            'targetThread' => 'Name of target thread',
            'sourceThreadId' => 'ID of source thread',
            'targetThreadId' => 'ID of target thread'
        ],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const PAYPAL_SUBSCRIPTION = [
        'id' => 199,
        'description' => 'User bought subscription with paypal',
        'data' => [],
        'log' => 'log_user',
        'contentId' => 'subscriptionId',
        'contentTable' => 'subscriptions',
        'contentSelect' => 'title'
    ];

    const THREAD_BANNED = [
        'id' => 200,
        'description' => 'User banned user from thread',
        'data' => [
            'thread' => 'Thread the user got banned from'
        ],
        'log' => 'log_mod',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const THREAD_UNBANNED = [
        'id' => 201,
        'description' => 'User unbanned user from thread',
        'data' => [
            'thread' => 'Thread the user got unbanned from'
        ],
        'log' => 'log_mod',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    /**
     *
     *
     * @deprecated
     */
    const QUEST_ARTICLE_MESSAGE = [
        'id' => 202,
        'description' => 'The system created a site message from a quest article',
        'data' => [],
        'log' => 'log_mod',
        'contentId' => 'threadId',
        'contentTable' => 'threads',
        'contentSelect' => 'title'
    ];

    const CREATED_THREAD_TEMPLATE = [
        'id' => 203,
        'description' => 'User created a thread template',
        'data' => [
            'threadTemplate' => 'Thread template model'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'threadTemplateId',
        'contentTable' => 'thread_templates',
        'contentSelect' => 'name'
    ];

    const UPDATED_THREAD_TEMPLATE = [
        'id' => 204,
        'description' => 'User updated a thread template',
        'data' => [
            'threadTemplate' => 'Thread template model'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'threadTemplateId',
        'contentTable' => 'thread_templates',
        'contentSelect' => 'name'
    ];

    const DELETED_THREAD_TEMPLATE = [
        'id' => 205,
        'description' => 'User deleted a thread template',
        'data' => [
            'threadTemplate' => 'Thread template model'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'threadTemplateId',
        'contentTable' => 'thread_templates',
        'contentSelect' => 'name'
    ];

    const UPDATED_USERS_THC = [
        'id' => 206,
        'description' => 'User updated user THC',
        'data' => [
            'before' => 'Thc before',
            'after' => 'Thc after'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'userId',
        'contentTable' => 'users',
        'contentSelect' => 'nickname'
    ];

    const DELETED_ALL_RADIO_REQUEST = [
        'id' => 207,
        'description' => 'User deleted all radio requests',
        'data' => [],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const STARTED_AUTO_DJ = [
        'id' => 208,
        'description' => 'User started the auto dj',
        'data' => [],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const STOPPED_AUTO_DJ = [
        'id' => 209,
        'description' => 'User stopped the auto dj',
        'data' => [],
        'log' => 'log_staff',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const BOUGHT_ROTATED_SHOP_ITEM = [
        'id' => 210,
        'description' => 'User bought a rotated shop item',
        'data' => [
            'shopItemId' => 'Id of the shop item bought',
            'credits' => 'Amount of credits payed'
        ],
        'log' => 'log_user',
        'contentId' => null,
        'contentTable' => null,
        'contentSelect' => null
    ];

    const MERGED_CATEGORIES = [
        'id' => 211,
        'description' => 'User merged categories',
        'data' => [
            'sourceCategoryId' => 'Id of the source category',
            'targetCategoryId' => 'Id of the target category'
        ],
        'log' => 'log_sitecp',
        'contentId' => 'categoryId',
        'contentTable' => 'categories',
        'contentSelect' => 'title'
    ];
}
