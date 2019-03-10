<?php

namespace App\Utils;

use App\EloquentModels\BBcode;
use Illuminate\Support\Facades\Cache;

class BBcodeUtil {

    public static function arrowsToEntry ($content) {
        $content = str_replace(">", "&#62;", $content);
        $content = str_replace("<", "&#60;", $content);
        return $content;
    }

    public static function bbcodeParser ($content, $nl2br = true) {
        $bbcodes = null;
        $content = self::arrowsToEntry($content);

        if (Cache::has('bbcodes')) {
            $bbcodes = Cache::get('bbcodes');
        } else {
            $bbcodes = BBcode::all();
            Cache::add('bbcodes', $bbcodes, 5);
        }

        foreach ($bbcodes as $bbcode) {
            if ($bbcode->isEmoji) {
                $content = str_replace($bbcode->pattern,
                    '<img src="/rest/resources/images/emojis/' . $bbcode->bbcodeId . '.gif" />', $content);
                continue;
            }
            $content = preg_replace([$bbcode->pattern], [$bbcode->replace], $content);
        }

        return $nl2br ? nl2br($content) : $content;
    }
}
