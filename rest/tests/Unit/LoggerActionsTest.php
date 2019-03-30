<?php

namespace Tests\Unit;

use App\Models\Logger\Action;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoggerActionsTest extends TestCase {

    use RefreshDatabase;

    public function testThatActionsHaveCorrectFieldsAndNoDuplicates () {
        $usedIds = [];
        try {
            $actions = Action::getAllConstants();

            foreach ($actions as $value) {
                $this->assertTrue(!in_array($value['id'], $usedIds), $value['id'] . ' Is duplicated');
                $usedIds[] = $value['id'];

                $this->assertNotNull($value['id']);
                $this->assertNotNull($value['description']);
                $this->assertNotNull($value['data']);
            }

        } catch (\ReflectionException $e) {
        }

        $this->assertTrue(true);
    }
}
