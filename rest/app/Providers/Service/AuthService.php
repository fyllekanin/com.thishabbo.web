<?php

namespace App\Providers\Service;

interface AuthService {


    /**
     * Checks if the repassword matches with the password
     *
     * @param  string  $repassword
     * @param  string  $password
     *
     * @return boolean
     */
    public function isRePasswordValid($repassword, $password);

    /**
     * Checks if the password is valid
     *
     * @param  string  $password
     *
     * @return bool
     */
    public function isPasswordValid($password);

    /**
     * Check if provided nickname is valid
     *
     * @param  string  $nickname
     * @param $user
     *
     * @return bool
     */
    public function isNicknameValid($nickname, $user = null);

    /**
     * Check if provided nickname is valid
     *
     * @param $username
     *
     * @return bool
     */
    public function isUsernameValid($username);

    /**
     * Check if nickname is unique or not
     *
     * @param $nickname
     *
     * @return bool
     */
    public function nicknameIsNotUnique($nickname);
}
