<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\Avatar;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserProfile;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProfileSettingsController extends Controller {

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request) {
        $user = $request->get('auth');
        $profile = UserProfile::where('userId', $user->userId)->first();

        if (!$profile) {
            return response()->json();
        }

        return response()->json([
            'isPrivate' => $profile->isPrivate,
            'youtube' => $profile->youtube,
            'relations' => [
                'love' => isset($profile->love) ? UserHelper::getSlimUser($profile->love)->nickname : null,
                'like' => isset($profile->like) ? UserHelper::getSlimUser($profile->like)->nickname : null,
                'hate' => isset($profile->hate) ? UserHelper::getSlimUser($profile->hate)->nickname : null
            ]
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request) {
        $user = $request->get('auth');
        $profile = UserProfile::where('userId', $user->userId)->first();
        $data = json_decode(json_encode($request->input('data')), false);

        if (!$profile) {
            $profile = new UserProfile(['userId' => $user->userId]);
            $profile->save();
        }

        $love = User::withNickname($data->relations->love)->first();
        $like = User::withNickname($data->relations->like)->first();
        $hate = User::withNickname($data->relations->hate)->first();

        Condition::precondition(!empty($data->relations->love) && !$love, 404,
            'No user with the nickname: ' . $data->relations->love);
        Condition::precondition(!empty($data->relations->like) && !$like, 404,
            'No user with the nickname: ' . $data->relations->like);
        Condition::precondition(!empty($data->relations->hate) && !$hate, 404,
            'No user with the nickname: ' . $data->relations->hate);


        $profile->isPrivate = Value::objectProperty($data, 'isPrivate', false);
        $profile->youtube = Value::objectProperty($data, 'youtube', null);
        $profile->love = $love ? $love->userId : null;
        $profile->like = $like ? $like->userId : null;
        $profile->hate = $hate ? $hate->userId : null;
        $profile->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_PROFILE);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSocialNetworks(Request $request) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        return response()->json([
            'discord' => $userData->discord,
            'twitter' => $userData->twitter
        ]);
    }

    /**
     * @param Request $request
     */
    public function updateSocialNetworks(Request $request) {
        $user = $request->get('auth');
        $twitter = $request->input('twitter');
        $discord = $request->input('discord');

        Condition::precondition(isset($twitter) && !preg_match('/^@?(\w){1,15}$/', $twitter),
            400, 'Twitter format is invalid');
        Condition::precondition(isset($discord) && !preg_match('/^((.+?)#\d{4})/', $discord),
            400, 'Discord format is invalid');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->discord = $discord;
        $userData->twitter = $twitter;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_SOCIAL_NETWORKS);
    }

    /**
     * Get request for getting the maximum size of avatar the
     * requested user can use.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvatarSize(Request $request) {
        $user = $request->get('auth');
        $avatarSize = UserHelper::getMaxAvatarSize($user->userId);

        return response()->json([
            'width' => $avatarSize->width,
            'height' => $avatarSize->height,
            'oldAvatarIds' => Avatar::where('userId', $user->userId)->take(5)->orderBy('avatarId', 'DESC')->pluck('avatarId')
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCover(Request $request) {
        $user = $request->get('auth');
        $cover = $request->file('cover');

        $this->validate($request, [
            'cover' => 'required|mimes:jpg,jpeg,bmp,png,gif',
        ]);

        $fileName = $user->userId . '.gif';
        $destination = base_path('/public/rest/resources/images/covers');
        $cover->move($destination, $fileName);

        Logger::user($user->userId, $request->ip(), Action::UPDATED_COVER);
        return response()->json();
    }

    /**
     * Post method to update the avatar used by a user.
     * POST is used because PUT can not have FormData and therefor no files
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAvatar(Request $request) {
        $user = $request->get('auth');
        $avatar = $request->file('avatar');
        $avatarSize = UserHelper::getMaxAvatarSize($user->userId);

        $request->validate([
            'avatar' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=' . $avatarSize->width . ',max_height=' . $avatarSize->height,
        ]);

        $this->backupOldAvatarIfExist($user);

        $fileName = $user->userId . '.gif';
        $destination = base_path('/public/rest/resources/images/users');
        $avatar->move($destination, $fileName);

        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        $userdata->avatarUpdatedAt = time();
        $userdata->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_AVATAR);
        return $this->getAvatarSize($request);
    }

    public function switchToAvatar(Request $request, $avatarId) {
        $user = $request->get('auth');
        $avatar = Avatar::find($avatarId);
        $avatarSize = UserHelper::getMaxAvatarSize($user->userId);

        Condition::precondition(!$avatar, 404, 'No avatar saved with that ID');
        Condition::precondition($avatar->userId != $user->userId, 400,
            'This is not your old avatar');

        $size = getimagesize(base_path('public/rest/resources/images/old-avatars/') . $avatar->avatarId . '.gif');

        Condition::precondition($size[0] > $avatarSize->width || $size[1] > $avatarSize->height, 400,
            'The avatar size is bigger then the size you can have');

        $this->backupOldAvatarIfExist($user);
        File::copy(base_path('public/rest/resources/images/old-avatars/') . $avatar->avatarId . '.gif',
            base_path('public/rest/resources/images/users/' . $user->userId . '.gif'));

        Logger::user($user->userId, $request->ip(), Action::UPDATED_AVATAR);
        return $this->getAvatarSize($request);
    }

    /**
     * Get request to fetch the users current signature
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSignature(Request $request) {
        $user = $request->get('auth');
        $userdata = UserData::where('userId', $user->userId)->first();

        return response()->json([
            'signature' => Value::objectProperty($userdata, 'signature', ''),
            'parsedSignature' => BBcodeUtil::bbcodeParser(Value::objectProperty($userdata, 'signature', ''))
        ]);
    }

    /**
     * Put request to update the user signature
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSignature(Request $request) {
        $user = $request->get('auth');
        $signature = $request->input('signature');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->signature = $signature;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_SIGNATURE);
        return response()->json([
            'signature' => $signature,
            'parsedSignature' => BBcodeUtil::bbcodeParser($signature)
        ]);
    }

    /**
     * Get request to fetch the users current name colours
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNameColours(Request $request) {
        $user = $request->get('auth');

        $subscription = UserSubscription::where('userId', $user->userId)->first();
        $canUpdateColour = $subscription && ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor & $subscription->subscription->options;
        $userdata = UserData::where('userId', $user->userId)->first();
        return response()->json([
            'colours' => Value::objectJsonProperty($userdata, 'nameColours', []),
            'canUpdateColour' => $canUpdateColour
        ]);
    }

    /**
     * Put request to update the user name colours
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNameColours(Request $request) {
        $user = $request->get('auth');

        $subscription = UserSubscription::where('userId', $user->userId)->first();
        $canUpdateColour = $subscription && ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor & $subscription->subscription->options;

        Condition::precondition(!$canUpdateColour, 400, 'You do not have the permissions to edit name colour!');
        $colours = $request->input('colours');

        $valid = true;
        $regex = '/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/';
        foreach($colours as $colour) {
            if(!preg_match($regex, $colour)) {
                $valid = false;
            }
        }
        Condition::precondition(!$valid, 400, 'Invalid Hex Codes');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->nameColours = json_encode($colours);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_NAME_COLOURS);
        return response()->json([
            'colours' => $colours
        ]);
    }

    private function backupOldAvatarIfExist($user) {
        if (!File::exists(base_path('public/rest/resources/images/users/' . $user->userId . '.gif'))) {
            return;
        }

        $avatar = new Avatar([
            'userId' => $user->userId
        ]);
        $avatar->save();

        File::move(base_path('public/rest/resources/images/users/' . $user->userId . '.gif'),
            base_path('public/rest/resources/images/old-avatars/') . $avatar->avatarId . '.gif');
    }
}
