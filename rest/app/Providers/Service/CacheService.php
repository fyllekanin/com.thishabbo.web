<?php

namespace App\Providers\Service;

interface CacheService {


    /**
     * Check if the cache has the specified key in storage
     *
     * @param  string  $key
     *
     * @return bool
     */
    public function has(string $key);

    /**
     * Add/Update the prov
     *
     * @param  string  $key  to store it on
     * @param  mixed  $value  to store
     * @param  int  $seconds
     */
    public function put(string $key, $value, int $seconds);

    /**
     * Get the value of provided key
     *
     * @param  string  $key  to get value of
     *
     * @return mixed | null
     */
    public function get(string $key);
}
