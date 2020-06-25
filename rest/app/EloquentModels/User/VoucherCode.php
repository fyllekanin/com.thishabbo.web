<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed voucherCodeId
 * @property mixed code
 * @property mixed note
 * @property mixed value
 */
class VoucherCode extends DeletableModel {

    protected $table = 'voucher_codes';
    protected $primaryKey = 'voucherCodeId';
    protected $fillable = ['code', 'note', 'value', 'isActive'];
}
