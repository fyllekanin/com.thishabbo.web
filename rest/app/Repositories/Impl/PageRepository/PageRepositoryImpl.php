<?php

namespace App\Repositories\Impl\PageRepository;

use App\Repositories\Repository\PageRepository;

class PageRepositoryImpl implements PageRepository {
    private $myPageDBO;

    public function __construct() {
        $this->myPageDBO = new PageDBO();
    }

    public function getPageByPath(string $path) {
        return $this->myPageDBO->query()
            ->wherePath($path)
            ->first();
    }
}
