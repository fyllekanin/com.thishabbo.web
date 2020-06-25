<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\PageRepository\PageDBO;

interface PageRepository {

    /**
     * Get a page DBO by given path
     *
     * @param  string  $path
     *
     * @return PageDBO
     */
    public function getPageByPath(string $path);
}
