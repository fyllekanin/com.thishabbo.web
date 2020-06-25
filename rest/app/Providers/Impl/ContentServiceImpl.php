<?php

namespace App\Providers\Impl;

use App\EloquentModels\BBcode;
use App\Providers\Service\ContentService;
use Illuminate\Support\Facades\Cache;

class ContentServiceImpl implements ContentService {


    public function getContentEscapedArrows($content) {
        $content = str_replace(">", "&#62;", $content);
        $content = str_replace("<", "&#60;", $content);
        return $content;
    }

    public function getParsedContent($content, $nl2br = true) {
        $content = $this->getContentEscapedArrows($content);
        $content = $this->parseContent($this->getBbcodes(), $content);

        return $nl2br ? nl2br($content) : $content;
    }

    private function parseContent($bbcodes, $content) {
        foreach ($bbcodes as $bbcode) {
            if ($bbcode->isEmoji) {
                $content = str_replace(
                    $bbcode->pattern,
                    '<img src="/resources/images/emojis/'.$bbcode->bbcodeId.'.gif" />',
                    $content
                );
                continue;
            }
            while (preg_match($bbcode->pattern, $content)) {
                $content = preg_replace([$bbcode->pattern], [$bbcode->replace], $content);
            }
        }
        return $content;
    }

    private function getBbcodes() {
        $bbcodes = null;
        if (Cache::has('bbcodes')) {
            $bbcodes = Cache::get('bbcodes');
        } else {
            $bbcodes = BBcode::all();
            Cache::add('bbcodes', $bbcodes, 5);
        }
        return $bbcodes;
    }
}
