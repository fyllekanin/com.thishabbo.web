<?php

namespace App\Providers\Impl;

use App\EloquentModels\Forum\Category;
use App\Helpers\UserHelper;
use App\Providers\Service\CreditsService;
use App\Providers\Service\PointsService;

class PointsServiceImpl implements PointsService {

    private $myCreditsService;

    public function __construct(CreditsService $creditsService) {
        $this->myCreditsService = $creditsService;
    }

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
        $this->myCreditsService->giveCredits($userId, $credits);
        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->xp += $experience;
        $userData->save();
    }
}
