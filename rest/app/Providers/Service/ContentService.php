<?php

namespace App\Providers\Service;

interface ContentService {


    /**
     * Escape "<" and ">" in given content
     *
     * @param  string  $content
     *
     * @return string
     */
    public function getContentEscapedArrows($content);

    /**
     * Parse content to be presentable
     *
     * @param  string  $content
     * @param  bool  $nl2br
     *
     * @return string
     */
    public function getParsedContent($content, $nl2br = true);
}
