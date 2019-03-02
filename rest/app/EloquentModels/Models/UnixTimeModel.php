<?php

namespace App\EloquentModels\Models;

use Illuminate\Database\Eloquent\Model;

class UnixTimeModel extends Model {
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public static $snakeAttributes = false;

    public function getDateFormat() {
        return 'U';
    }

    public function skipAppends() {
        $this->appends = [];
    }
}
