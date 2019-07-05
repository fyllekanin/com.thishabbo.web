<?php

namespace App\Helpers;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;

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

    /**
     * @param $template
     *
     * @return bool
     */
    public static function isValidTemplate($template) {
        $templates = (array)ConfigHelper::getCategoryTemplatesConfig();
        return in_array($template, $templates);
    }

    public static function isCategoryAuthOnly($categoryId) {
        return ForumPermission::where('categoryId', $categoryId)->where('isAuthOnly', true)->count() > 0;
    }
}
