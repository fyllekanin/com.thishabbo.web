<?php

namespace App\Helpers;

use App\EloquentModels\Forum\Category;

class ForumHelper {

    /**
     * Get all category ids which has the template quest
     *
     * @return mixed
     */
    public static function getQuestCategoryIds() {
        return Category::where('template', ConfigHelper::getCategoryTemplatesConfig()->QUEST)
            ->pluck('categoryId')
            ->toArray();
    }
}
