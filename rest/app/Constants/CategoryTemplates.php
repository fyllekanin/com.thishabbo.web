<?php

namespace App\Constants;

class CategoryTemplates {

    const DEFAULT = 'DEFAULT';
    const QUEST = 'QUEST';
    const MEDIA = 'MEDIA';

    public static function isValid(string $template) {
        return in_array($template, [self::DEFAULT, self::QUEST, self::MEDIA]);
    }
}
