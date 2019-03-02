<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class PermissionTest extends TestCase {

    use RefreshDatabase;

    public function testThatNumbersAreBitWiseNumbers () {
        $permissions = Config::get('permissions');

        foreach ($permissions as $permission) {
            $collection = (array)$permission;

            foreach ($collection as $key => $value) {
                $i = 1;
                while (true) {
                    if ($i == $value) {
                        break;
                    }
                    if ($i > $value) {
                        $this->assertTrue(false, $key . ' is not a correct bitwise number');
                    }
                    $i = $i * 2;
                }
            }
        }

        // Then
        $this->assertTrue(true);
    }
}
