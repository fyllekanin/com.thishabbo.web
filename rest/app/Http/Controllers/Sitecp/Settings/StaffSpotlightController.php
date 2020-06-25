<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\Constants\SettingsKeys;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\SubscriptionRepository;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffSpotlightController extends Controller {
    private $myForumService;
    private $mySettingRepository;
    private $mySubscriptionRepository;

    public function __construct(
        ForumService $forumService,
        SettingRepository $settingRepository,
        SubscriptionRepository $subscriptionRepository
    ) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->mySettingRepository = $settingRepository;
        $this->mySubscriptionRepository = $subscriptionRepository;
    }

    /**
     * Get method to fetch the current motm
     *
     * @return JsonResponse
     */
    public function getMemberOfTheMonth() {
        $motm = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::MEMBER_OF_THE_MONTH);

        return response()->json(
            [
                'member' => Value::objectProperty($motm, 'member', null),
                'photo' => Value::objectProperty($motm, 'photo', null),
                'month' => Value::objectProperty($motm, 'month', null),
                'year' => Value::objectProperty($motm, 'year', date('Y'))
            ]
        );
    }

    /**
     * Post request for updating the member of the month
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */

    public function updateMemberOfTheMonth(Request $request) {
        $user = $request->get('auth');
        $information = (object) $request->input('information');

        foreach ($information as $key => $value) {
            Condition::precondition(!isset($value) || empty($value), 400, $key.' is missing');
        }

        Condition::precondition(
            !empty($information->member) && User::withNickname($information->member)->count('userId') == 0,
            404,
            'No member with that nickname'
        );
        Condition::precondition(
            !empty($information->photo) && User::withNickname($information->photo)->count('userId') == 0,
            404,
            'No staff with that nickname'
        );

        $newInformation = [
            'member' => $information->member,
            'photo' => $information->photo,
            'month' => $information->month,
            'year' => $information->year || date('Y')
        ];

        $this->mySettingRepository->createOrUpdate(SettingsKeys::MEMBER_OF_THE_MONTH, json_encode($newInformation));
        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_MEMBER_OF_THE_MONTH);
        return response()->json();
    }

    /**
     * Get method to fetch the current OS
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getOutstandingStaff(Request $request) {
        $user = $request->get('auth');
        $outstandingStaff = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::OUTSTANDING_STAFF);

        return response()->json(
            [
                'categoryId' => Value::objectProperty($outstandingStaff, 'categoryId', null),
                'subscriptionId' => Value::objectProperty($outstandingStaff, 'subscriptionId', null),
                'title' => Value::objectProperty($outstandingStaff, 'title', ''),
                'content' => Value::objectProperty($outstandingStaff, 'content', ''),
                'members' => array_map(
                    function ($member) {
                        return [
                            'nickname' => User::where('userId', $member->userId)->value('nickname'),
                            'replacer' => $member->replacer
                        ];
                    },
                    Value::objectProperty($outstandingStaff, 'members', [])
                ),
                'subscriptions' => Subscription::select(['title', 'subscriptionId'])->get(),
                'categories' => $this->myForumService->getCategoryTree($user)
            ]
        );
    }

    /**
     * Post request for updating the outstanding staff
     *
     * @param  Request  $request
     *
     * @param  ThreadCrudController  $threadCrudController
     *
     * @return JsonResponse
     */

    public function updateOutstandingStaff(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $outstandingStaff = (object) $request->input('information');

        Condition::precondition(
            $outstandingStaff->categoryId && Category::where('categoryId', $outstandingStaff->categoryId)->count() == 0,
            400,
            'No category with that ID'
        );
        Condition::precondition(
            $outstandingStaff->categoryId && empty($outstandingStaff->content),
            400,
            'Content can not be empty if category ID is set'
        );
        Condition::precondition(
            $outstandingStaff->categoryId && empty($outstandingStaff->title),
            400,
            'Title can not be empty if category ID is set'
        );
        Condition::precondition(
            $outstandingStaff->subscriptionId && Subscription::where('subscriptionId', $outstandingStaff->subscriptionId)->count() == 0,
            400,
            'No subscription with that ID'
        );

        $usedReplacers = [];
        $updatedMembers = [];
        foreach ($outstandingStaff->members as $item) {
            $member = (object) $item;
            $existingUser = User::withNickname($member->nickname)->first();
            Condition::precondition(!$existingUser, 400, "No user with the nickname {$member->nickname}");
            Condition::precondition(!isset($member->replacer) || empty($member->replacer), 400, 'Replacer needs to be set');
            Condition::precondition(in_array($member->replacer, $usedReplacers), 400, 'All replacers need to be unique');

            $usedReplacers[] = $member->replacer;
            $updatedMembers[] = (object) [
                'userId' => $existingUser->userId,
                'replacer' => $member->replacer
            ];
        }


        $data = (object) [
            'categoryId' => $outstandingStaff->categoryId,
            'subscriptionId' => $outstandingStaff->subscriptionId,
            'members' => $updatedMembers,
            'title' => $outstandingStaff->title,
            'content' => $outstandingStaff->content
        ];
        $this->mySettingRepository->createOrUpdate(SettingsKeys::OUTSTANDING_STAFF, json_encode($data));
        $this->postThreadIfApplicable($outstandingStaff, $threadCrudController, $user);
        $this->giveSubscriptionIfApplicable($data);

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_OUTSTANDING_STAFF, [$data]);
        return response()->json();
    }

    private function postThreadIfApplicable($outstandingStaff, ThreadCrudController $threadCrudController, $user) {
        if (!$outstandingStaff->categoryId) {
            return;
        }

        $threadSkeleton = (object) [];
        $threadSkeleton->categoryId = $outstandingStaff->categoryId;
        $threadSkeleton->content = $outstandingStaff->content;
        $threadSkeleton->title = $outstandingStaff->title;

        foreach ($outstandingStaff->members as $item) {
            $member = (object) $item;
            $threadSkeleton->content = str_replace($member->replacer, '@'.$member->nickname, $threadSkeleton->content);
        }

        $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
    }

    private function giveSubscriptionIfApplicable($data) {
        $twoWeeks = 1209600;
        $subscription = $this->mySubscriptionRepository->getSubscriptionWithId($data->subscriptionId);
        if (!$subscription) {
            return;
        }
        foreach ($data->members as $member) {
            $this->mySubscriptionRepository->createOrExtendUserSubscription($member->userId, $subscription->subscriptionId, $twoWeeks);
        }
    }
}
