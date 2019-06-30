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

    private function addUserPoints($userId, $credits, $experience) {
        if ($credits == 0 && $experience == 0) {
            return;
        }
        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->xp += $experience;
        $userData->credits += $credits;
        $userData->save();
    }
}
