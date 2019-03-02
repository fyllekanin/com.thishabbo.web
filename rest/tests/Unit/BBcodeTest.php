<?php

namespace Tests\Unit;

use App\Utils\BBcodeUtil;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BBcodeTest extends TestCase {

    use RefreshDatabase;

    public function testThatArrowsToEntryConvertArrowsToHTMLEntry() {
        // Given
        $content = '< < < > > >';

        // When
        $result = BBcodeUtil::arrowsToEntry($content);

        // Then
        $this->assertEquals('&#60; &#60; &#60; &#62; &#62; &#62;', $result);
    }

    public function testThatbbcodeParserCanParseSimpleBBCode() {
        // Given
        $bbcode = factory('App\EloquentModels\BBcode')->make();
        $bbcode->name = 'bold';
        $bbcode->example = '[b]test[/b]';
        $bbcode->content = '';
        $bbcode->replace = '<strong>$1</strong>';
        $bbcode->pattern = '/\[b\](.*?)\[\/b\]/s';
        $bbcode->save();

        // When
        $result = BBcodeUtil::bbcodeParser('[b]test[/b]');

        // Then
        $this->assertEquals('<strong>test</strong>', $result);
    }
}
