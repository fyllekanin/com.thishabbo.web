<?php

namespace App\Services;

use App\EloquentModels\User\User;

class AuthService {

    /**
     * Checks if the repassword matches with the password
     *
     * @param $repassword
     * @param $password
     *
     * @return bool
     */
    public function isRePasswordValid($repassword, $password) {
        return isset($repassword) &&
            !empty($repassword) &&
            $password == $repassword;
    }

    /**
     * Checks if the password is valid
     *
     * @param $password
     *
     * @return bool
     */
    public function isPasswordValid($password) {
        return isset($password) &&
            !empty($password) &&
            strlen($password) >= 8;
    }

    /**
     * Check if provided nickname is valid
     *
     * @param $nickname
     *
     * @return bool
     */
    public function isNicknameValid($nickname) {
        return isset($nickname) &&
            !empty($nickname) &&
            strlen($nickname) >= 3 &&
            !self::nicknameIsNotUnique($nickname) &&
            ctype_alnum($nickname);
    }

    /**
     * Check if provided nickname is valid
     *
     * @param $username
     *
     * @return bool
     */
    public function isUsernameValid($username) {
        return isset($username) &&
            !empty($username) &&
            strlen($username) >= 3 &&
            !self::nicknameIsNotUnique($username) &&
            ctype_alnum($username);
    }

    /**
     * Check if nickname is unique or not
     *
     * @param $nickname
     *
     * @return bool
     */
    public function nicknameIsNotUnique($nickname) {
        return User::withNickname($nickname)->count('userId') > 0;
    }
}
