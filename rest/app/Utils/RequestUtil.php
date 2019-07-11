<?php

namespace App\Utils;

class RequestUtil {
    public static function getAccessToken ($request) {
        $authorization = $request->header('Authorization');
        $parts = explode(' ', $authorization);
        if (count($parts) < 2) {
            return null;
        }
        return $parts[1];
    }

    public static function getRefreshToken ($request) {
        return $request->header('RefreshAuthorization');
    }

    public static function getVersion($request) {
        return $request->header('ClientVersion');
    }
}