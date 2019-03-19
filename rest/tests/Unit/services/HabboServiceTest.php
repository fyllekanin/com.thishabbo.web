<?php

namespace Tests\Unit;

use App\Services\HabboService;
use Tests\TestCase;

class HabboServiceTest extends TestCase {
    private $habboService;

    public function setUp(): void
    {
        parent::setUp();
        $this->habboService = new HabboService();
    }

    public function testThatGetHabboByNameReturnsNullIfNoHabboFound() {
        // Given
        $name = 'thisNameShouldNotExistAtAll123';

        // When
        $result = $this->habboService->getHabboByName($name);

        // Then
        $this->assertNull($result);
    }

    public function testThatGetHabboByNameReturnsTheHabboIfFound() {
        // Given
        $name = 'bear94';

        // When
        $result = $this->habboService->getHabboByName($name);

        // Then
        $this->assertNotNull($result);
        $this->assertEquals('bear94', $result->name);
    }
}
