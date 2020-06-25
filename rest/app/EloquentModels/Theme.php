<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

/**
 * Class Theme
 *
 * @package App\EloquentModels
 *
 * @property mixed themeId
 * @property mixed title
 * @property mixed isDefault
 * @property mixed minified
 * @property mixed css
 */
class Theme extends DeletableModel {

    protected $table = 'themes';
    protected $primaryKey = 'themeId';
    protected $fillable = ['title', 'isDefault', 'minified', 'css'];
}
