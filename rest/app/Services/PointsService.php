<?php

namespace App\Services;

use App\EloquentModels\Forum\Category;
use App\Helpers\UserHelper;

class PointsService {

    public function givePointsFromCategory($userId, $categoryId) {
        $category = Category::where('categoryId', $categoryId)->first(['xp', 'credits']);
        if (!$category) {
            return;
        }

        $this->addUserPoints($userId, $category->credits, $category->xp);
    }

    public function givePointsFromModel($userId, $model) {
        $this->addUserPoints($userId, $model['credits'], $model['xp']);
    }

    private function addUserPoints($userId, $credits, $xp) {
        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->xp += $xp;
        $userData->credits += $credits;
        $userData->save();
    }
}
