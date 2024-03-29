<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\EloquentModels\Theme;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MatthiasMullie\Minify\CSS;

class ThemeController extends Controller {

    public function getThemes() {
        return response()->json(
            Theme::orderBy('title', 'ASC')->get()->map(
                function ($item) {
                    return [
                        'themeId' => $item->themeId,
                        'users' => User::where('theme', $item->themeId)->count(),
                        'title' => $item->title,
                        'isDefault' => $item->isDefault,
                        'createdAt' => $item->createdAt->timestamp,
                        'updatedAt' => $item->updatedAt->timestamp
                    ];
                }
            )
        );
    }

    /**
     * @param $themeId
     *
     * @return JsonResponse
     */
    public function getTheme($themeId) {
        $theme = Theme::find($themeId);
        Condition::precondition(!$theme, 404, 'No theme with that ID');

        $theme->makeHidden('minified');
        return response()->json($theme);
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createTheme(Request $request) {
        $user = $request->get('auth');
        $newTheme = (object) $request->input('theme');
        $this->validateTheme($newTheme);

        $cssMinified = new CSS();
        $minified = $cssMinified->add($newTheme->css)->minify();

        $theme = new Theme(
            [
                'title' => $newTheme->title,
                'minified' => $minified,
                'css' => $newTheme->css
            ]
        );
        $theme->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_THEME, ['theme' => $theme->title], $theme->themeId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $themeId
     *
     * @return JsonResponse
     */
    public function updateTheme(Request $request, $themeId) {
        $user = $request->get('auth');
        $newTheme = (object) $request->input('theme');
        $this->validateTheme($newTheme);

        $theme = Theme::find($themeId);

        $cssMinified = new CSS();
        $minified = $cssMinified->add($newTheme->css)->minify();

        $theme->title = $newTheme->title;
        $theme->minified = $minified;
        $theme->css = $newTheme->css;
        $theme->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_THEME, ['theme' => $theme->title], $theme->themeId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $themeId
     *
     * @return JsonResponse
     */
    public function deleteTheme(Request $request, $themeId) {
        $user = $request->get('auth');
        $theme = Theme::find($themeId);
        Condition::precondition(!$theme, 404, 'No theme with that ID');

        $theme->isDeleted = true;
        $theme->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_THEME, ['theme' => $theme->title], $theme->themeId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $themeId
     *
     * @return JsonResponse
     */
    public function makeThemeDefault(Request $request, $themeId) {
        $user = $request->get('auth');
        $theme = Theme::find($themeId);
        Condition::precondition(!$theme, 404, 'No theme with that ID');

        Theme::where('isDefault', true)->update(['isDefault' => 0]);
        $theme->isDefault = true;
        $theme->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::MADE_THEME_DEFAULT, ['theme' => $theme->title], $theme->themeId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function clearDefault(Request $request) {
        $user = $request->get('auth');

        Theme::where('isDefault', true)->update(['isDefault' => 0]);

        Logger::sitecp($user->userId, $request->ip(), LogType::CLEARED_THEME_DEFAULT);
        return response()->json();
    }

    private function validateTheme($theme) {
        Condition::precondition(
            !isset($theme->title) || empty($theme->title),
            400,
            'Title needs to be set'
        );
        Condition::precondition(
            !isset($theme->css) || empty($theme->css),
            400,
            'There needs to be come CSS code at least'
        );
    }
}
