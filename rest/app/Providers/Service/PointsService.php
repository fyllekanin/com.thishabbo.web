<?php

namespace App\Providers\Service;

interface PointsService {


    /**
     * Give user xp and/or credits based from category
     *
     * @param $userId
     * @param $categoryId
     *
     * @return mixed
     */
    public function givePointsFromCategory($userId, $categoryId);

    /**
     * Give user xp and/or credits based of model
     *
     * @param $userId
     * @param $model
     *
     * @return mixed
     */
    public function givePointsFromModel($userId, $model);
}
