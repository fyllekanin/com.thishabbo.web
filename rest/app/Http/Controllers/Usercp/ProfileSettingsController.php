<?php

namespace App\Http\Controllers\Usercp;

use App\Constants\LogType;
use App\Constants\Shop\ShopItemTypes;
use App\Constants\Shop\SubscriptionOptions;
use App\EloquentModels\Shop\ShopItem;
use App\EloquentModels\User\Avatar;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\EloquentModels\User\UserProfile;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class ProfileSettingsController extends Controller {

    private $mySettingRepository;
    private $myAvatarRepository;

    public function __construct(SettingRepository $settingRepository, AvatarRepository $avatarRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
        $this->myAvatarRepository = $avatarRepository;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getProfile(Request $request) {
        $user = $request->get('auth');
        $profile = UserProfile::where('userId', $user->userId)->first();

        if (!$profile) {
            return response()->json();
        }

        return response()->json(
            [
                'isPrivate' => $profile->isPrivate,
                'youtube' => $profile->youtube,
                'relations' => [
                    'love' => isset($profile->love) ? UserHelper::getSlimUser($profile->love)->nickname : null,
                    'like' => isset($profile->like) ? UserHelper::getSlimUser($profile->like)->nickname : null,
                    'hate' => isset($profile->hate) ? UserHelper::getSlimUser($profile->hate)->nickname : null
                ]
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
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

        $youtubeRegExp = '/[a-z0-9_-]{11}/';
        Condition::precondition(!empty($data->youtube) && preg_match($youtubeRegExp, $data->youtube), 400, 'YouTube ID Invalid');

        Condition::precondition(
            !empty($data->relations->love) && !$love,
            400,
            'No user with the nickname: '.$data->relations->love
        );
        Condition::precondition(
            !empty($data->relations->like) && !$like,
            400,
            'No user with the nickname: '.$data->relations->like
        );
        Condition::precondition(
            !empty($data->relations->hate) && !$hate,
            400,
            'No user with the nickname: '.$data->relations->hate
        );

        $profile->isPrivate = Value::objectProperty($data, 'isPrivate', false);
        $profile->youtube = Value::objectProperty($data, 'youtube', null);
        $profile->love = $love ? $love->userId : null;
        $profile->like = $like ? $like->userId : null;
        $profile->hate = $hate ? $hate->userId : null;
        $profile->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_PROFILE);
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getSocialNetworks(Request $request) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        return response()->json(
            [
                'discord' => $userData->discord,
                'twitter' => $userData->twitter
            ]
        );
    }

    /**
     * @param  Request  $request
     */
    public function updateSocialNetworks(Request $request) {
        $user = $request->get('auth');
        $twitter = $request->input('twitter');
        $discord = $request->input('discord');

        Condition::precondition(
            isset($twitter) && !preg_match('/^@?(\w){1,15}$/', $twitter),
            400,
            'Twitter format is invalid'
        );
        Condition::precondition(
            isset($discord) && !preg_match('/^((.+?)#\d{4})/', $discord),
            400,
            'Discord format is invalid'
        );

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->discord = $discord;
        $userData->twitter = $twitter;
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_SOCIAL_NETWORKS);
    }

    /**
     * Get request for getting the maximum size of avatar the
     * requested user can use.
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getAvatarSize(Request $request) {
        $user = $request->get('auth');
        $avatarSize = $this->myAvatarRepository->getMaxAvatarSizeForUser($user->userId);

        return response()->json(
            [
                'width' => $avatarSize->width,
                'height' => $avatarSize->height,
                'oldAvatarIds' => Avatar::where('userId', $user->userId)->take(5)->orderBy('updatedAt', 'DESC')->skip(1)->pluck('avatarId'),
                'user' => UserHelper::getUser($user->userId)
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateCover(Request $request) {
        $user = $request->get('auth');
        $cover = $request->file('cover');

        $request->validate(
            [
                'cover' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]
        );

        $fileName = $user->userId.'.gif';
        $target = $this->mySettingRepository->getResourcePath('images/covers');
        $cover->move($target, $fileName);

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->avatarUpdatedAt = time();
        $userData->save();
        Logger::user($user->userId, $request->ip(), LogType::UPDATED_COVER);
        return response()->json();
    }

    /**
     * Post method to update the avatar used by a user.
     * POST is used because PUT can not have FormData and therefor no files
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateAvatar(Request $request) {
        $user = $request->get('auth');
        $avatar = $request->file('avatar');
        $resizeForMe = $request->input('resizeForMe');
        $avatarSize = $this->myAvatarRepository->getMaxAvatarSizeForUser($user->userId);

        $dimensionValidation = $resizeForMe ? '' : '|dimensions:max_width='.$avatarSize->width.',max_height='.$avatarSize->height;
        $request->validate(
            [
                'avatar' => 'required|mimes:jpg,jpeg,bmp,png,gif'.$dimensionValidation,
            ]
        );

        $this->myAvatarRepository->backupCurrentAvatarForUser($user->userId);
        $target = $this->mySettingRepository->getResourcePath("images/users/{$user->userId}.gif");
        if ($resizeForMe) {
            $img = Image::make($avatar);
            $img->resize($avatarSize->width, $avatarSize->height);
            $img->save($target);
        } else {
            $avatar->move($this->mySettingRepository->getResourcePath('images/users/'), $user->userId.'.gif');
        }

        $dimensions = getimagesize($target);
        $avatar = new Avatar(
            [
                'userId' => $user->userId,
                'width' => $dimensions[0],
                'height' => $dimensions[1]
            ]
        );
        $avatar->save();

        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        $userdata->avatarUpdatedAt = time();
        $userdata->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_AVATAR);
        return $this->getAvatarSize($request);
    }

    public function switchToAvatar(Request $request, $avatarId) {
        $user = $request->get('auth');
        $avatar = Avatar::find($avatarId);
        $avatarSize = $this->myAvatarRepository->getMaxAvatarSizeForUser($user->userId);

        Condition::precondition(!$avatar, 404, 'No avatar saved with that ID');
        Condition::precondition(
            $avatar->userId != $user->userId,
            400,
            'This is not your old avatar'
        );

        $size = getimagesize($this->mySettingRepository->getResourcePath('images/old-avatars/'.$avatar->avatarId.'.gif'));

        Condition::precondition(
            $size[0] > $avatarSize->width || $size[1] > $avatarSize->height,
            400,
            'The avatar size is bigger then the size you can have'
        );

        $this->myAvatarRepository->backupCurrentAvatarForUser($user->userId);
        File::copy(
            $this->mySettingRepository->getResourcePath("images/old-avatars/{$avatar->avatarId}.gif"),
            $this->mySettingRepository->getResourcePath("images/users/{$user->userId}.gif")
        );

        $avatar->updatedAt = time();
        $avatar->save();
        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        $userdata->avatarUpdatedAt = time();
        $userdata->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_AVATAR);
        return $this->getAvatarSize($request);
    }

    /**
     * Get request to fetch the users current signature
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getSignature(Request $request) {
        $user = $request->get('auth');
        $userdata = UserHelper::getUserDataOrCreate($user->userId);

        return response()->json(
            [
                'signature' => $userdata->signature,
                'parsedSignature' => $userdata->getParsedSignature()
            ]
        );
    }

    /**
     * Put request to update the user signature
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateSignature(Request $request) {
        $user = $request->get('auth');
        $signature = $request->input('signature');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->signature = $signature;
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_SIGNATURE);
        return response()->json(
            [
                'signature' => $signature,
                'parsedSignature' => $userData->getParsedSignature()
            ]
        );
    }

    /**
     * Get request to fetch the users current name settings
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getNameSettings(Request $request) {
        $user = $request->get('auth');

        $userdata = UserHelper::getUserDataOrCreate($user->userId);

        $iconPosition = Value::objectProperty($userdata, 'iconPosition', 'left');
        $availableNameIconIds = UserItem::where('userId', $user->userId)->where('type', ShopItemTypes::NAME_ICON)->pluck('itemId');
        $availableEffectIds = UserItem::where('userId', $user->userId)->where('type', ShopItemTypes::NAME_EFFECT)->pluck('itemId');
        return response()->json(
            [
                'iconId' => Value::objectProperty($userdata, 'iconId', null),
                'iconPosition' => $iconPosition,
                'effectId' => Value::objectProperty($userdata, 'effectId', null),
                'availableNameIcons' => ShopItem::whereIn('shopItemId', $availableNameIconIds)->get(),
                'availableNameEffects' => ShopItem::whereIn('shopItemId', $availableEffectIds)->get(),
                'colors' => Value::objectJsonProperty($userdata, 'nameColor', []),
                'canUpdateSettings' => UserHelper::hasSubscriptionFeature($user->userId, SubscriptionOptions::CUSTOM_NAME_COLOR),
                'user' => UserHelper::getSlimUser($user->userId)
            ]
        );
    }

    /**
     * Put request to update the user name settings
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateNameSettings(Request $request) {
        $user = $request->get('auth');

        $colors = $request->input('colors');

        Condition::precondition(
            $colors && !UserHelper::hasSubscriptionFeature(
                $user->userId,
                SubscriptionOptions::CUSTOM_NAME_COLOR
            ),
            400,
            'You do not have the permissions to edit the name colour!'
        );

        Condition::precondition(!Value::validateHexColors($colors), 400, 'Invalid Hex Code!');

        $iconId = $request->input('iconId');
        Condition::precondition(
            $iconId && UserItem::where('userId', $user->userId)->where('itemId', $iconId)->count() == 0,
            400,
            'You do not own this icon!'
        );

        $effectId = $request->input('effectId');
        Condition::precondition(
            $effectId && UserItem::where('userId', $user->userId)->where('itemId', $effectId)->count() == 0,
            400,
            'You do not own this effect!'
        );

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->iconId = $iconId;
        $userData->effectId = $effectId;
        $userData->iconPosition = $request->input('iconPosition');
        $userData->nameColor = $colors && count($colors) > 0 ? json_encode($colors) : null;
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_NAME_COLORS);
        return response()->json(
            [
                'colors' => $colors
            ]
        );
    }
}
