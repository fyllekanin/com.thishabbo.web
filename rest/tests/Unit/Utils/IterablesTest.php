<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Utils\Iterables;

class IterablesTest extends TestCase {

    public function testThatFindMethodReturnsObjectIfFound() {
        // Given
        $item1 = (object) [ 'id' => 1, 'value' => 'test' ];
        $item2 = (object) [ 'id' => 2, 'value' => 'no' ];
        $items = [
            $item1,
            $item2
        ];

        // When
        $result = Iterables::find($items, function($item) {
            return $item->id == 1;
        });

        // Then
        $this->assertEquals('test', $result->value);
    }

    public function testThatFindMethodReturnsNullIfNotFound() {
        // Given
        $items = [];

        // When
        $result = Iterables::find($items, function($item) {
            return $item->id == 1;
        });

        // Then
        $this->assertEquals(null, $result);
    }

    public function testThatUniqueMethodRemovesDuplicateValues() {
        // Given
        $item1 = (object) [ 'id' => 1 ];
        $item2 = (object) [ 'id' => 1 ];
        $items = [$item1, $item2];

        // When
        $result = Iterables::unique($items, 'id');

        // Then
        $this->assertEquals(1, count($result));
    }

    public function testThatFilterMethodRemovesItemsMatchingFilter() {
        // Given
        $items = [1, 2, 3];

        // When
        $result = Iterables::filter($items, function($item) {
            return $item > 2;
        });

        // Then
        $this->assertEquals([3], $result);
    }

    public function testThatSortByPropertyWorksOnObjects() {
        // Given
        $item1 = (object) [ 'id' => 1 ];
        $item2 = (object) [ 'id' => 2 ];
        $items = [$item2, $item1];

        // When
        $result = Iterables::sortByPropertyAsc($items, 'id');

        // Then
        $this->assertEquals($item1, $result[0]);
    }

    public function testThatSortByPropertyWorksOnArrays() {
        // Given
        $item1 = [ 'id' => 1 ];
        $item2 = [ 'id' => 2 ];
        $items = [$item2, $item1];

        // When
        $result = Iterables::sortByPropertyAsc($items, 'id');

        // Then
        $this->assertEquals($item1, $result[0]);
    }

    public function testThatEveryReturnsFalseIfOneIsNotCorrect() {
        // Given
        $items = [1, 1, 2];

        // When
        $result = Iterables::every($items, function($item) {
            return $item == 1;
        });

        // Then
        $this->assertFalse($result);
    }

    public function testThatEveryReturnsTrueIfAllIsCorrect() {
        // Given
        $items = [1, 1, 1];

        // When
        $result = Iterables::every($items, function($item) {
            return $item == 1;
        });

        // Then
        $this->assertTrue($result);
    }
}
