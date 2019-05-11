<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserProfile;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

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
        $avatarHeight = $this->getMaxAvatarHeight($user);
        $avatarWidth = $this->getMaxAvatarWidth($user);

        return response()->json([
            'width' => $avatarWidth,
            'height' => $avatarHeight
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
        $avatarHeight = $this->getMaxAvatarHeight($user);
        $avatarWidth = $this->getMaxAvatarWidth($user);

        $this->validate($request, [
            'avatar' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=' . $avatarWidth . ',max_height=' . $avatarHeight,
        ]);

        $fileName = $user->userId . '.gif';
        $destination = base_path('/public/rest/resources/images/users');
        $avatar->move($destination, $fileName);

        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        $userdata->avatarUpdatedAt = time();
        $userdata->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_AVATAR);
        return response()->json(time());
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
     * Get the maximum width the supplied user can use
     *
     * @param $user
     *
     * @return int
     */
    private function getMaxAvatarWidth($user) {
        $width = 200;

        foreach ($user->groups as $group) {
            $width = $group->avatarWidth > $width ? $group->avatarWidth : $width;
        }
        return $width;
    }

    /**
     * Get the maximum height the supplied user can use
     *
     * @param $user
     *
     * @return int
     */
    private function getMaxAvatarHeight($user) {
        $height = 200;

        foreach ($user->groups as $group) {
            $height = $group->avatarHeight > $height ? $group->avatarHeight : $height;
        }
        return $height;
    }
}
