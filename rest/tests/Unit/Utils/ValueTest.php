<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Utils\Value;

class ValueTest extends TestCase {

    public function testThatObjectPropertyReturnsTheValueIfItExists() {
        // Given
        $item1 = (object) [ 'id' => 1, 'value' => 'test' ];

        // When
        $result = Value::objectProperty($item1, 'value', '');

        // Then
        $this->assertEquals('test', $result);
    }

    public function testThatObjectPropertyReturnsTheElseValueIfPropertyDoNotExist() {
        // Given
        $item1 = (object) [ 'id' => 1, 'value' => 'test' ];

        // When
        $result = Value::objectProperty($item1, 'doNotExist', 'backupValue');

        // Then
        $this->assertEquals('backupValue', $result);
    }
}
