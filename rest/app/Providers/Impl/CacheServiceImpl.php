<?php

namespace App\Providers\Impl;

use App\Providers\Service\CacheService;
use Illuminate\Support\Facades\Cache;
use Psr\SimpleCache\InvalidArgumentException;

class CacheServiceImpl implements CacheService {

    const REDIS = 'redis';

    public function has(string $key) {
        try {
            return Cache::store(self::REDIS)->has($key);
        } catch (InvalidArgumentException $e) {
            return false;
        }
    }

    public function put(string $key, $value, int $seconds) {
        Cache::store(self::REDIS)->put($key, $value, $seconds);
    }

    public function get(string $key) {
        try {
            return Cache::store(self::REDIS)->get($key, null);
        } catch (InvalidArgumentException $e) {
            return null;
        }
    }
}
