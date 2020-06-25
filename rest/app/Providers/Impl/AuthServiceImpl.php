<?php

namespace App\Providers\Impl;

use App\EloquentModels\User\User;
use App\Providers\Service\AuthService;

class AuthServiceImpl implements AuthService {


    public function isRePasswordValid($repassword, $password) {
        return isset($repassword) &&
            !empty($repassword) &&
            $password == $repassword;
    }

    public function isPasswordValid($password) {
        return isset($password) &&
            !empty($password) &&
            strlen($password) >= 8;
    }

    public function isNicknameValid($nickname, $user = null) {
        return isset($nickname) &&
            !empty($nickname) &&
            strlen($nickname) >= 3 &&
            !($user && strtolower($user->nickname) == strtolower($nickname) ? false : self::nicknameIsNotUnique($nickname)) &&
            ctype_alnum($nickname);
    }

    public function isUsernameValid($username) {
        return isset($username) &&
            !empty($username) &&
            strlen($username) >= 3 &&
            !self::nicknameIsNotUnique($username) &&
            ctype_alnum($username);
    }

    public function nicknameIsNotUnique($nickname) {
        return User::withNickname($nickname)->count('userId') > 0;
    }
}
