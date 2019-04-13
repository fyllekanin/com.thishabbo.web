<?php

namespace App\Http\Controllers;

use App\EloquentModels\BBcode;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Group\GroupList;
use App\EloquentModels\Notice;
use App\EloquentModels\Page;
use App\EloquentModels\Theme;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Utils\BBcodeUtil;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PageController extends Controller {
    private $categoryTemplates = null;

    /**
     * PageController constructor.
     * Store the possible category templates in instance variable
     */
    public function __construct () {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function loadInitial () {
        $user = Cache::get('auth');

        $navigation = null;
        try {
            $navigation = json_decode(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->navigation));
        } catch (\Exception $e) {
            $navigation = [];
        }

        $theme = Theme::where('themeId', Value::objectProperty($user, 'theme', 0))->orWhere('isDefault', true)->first();

        return response()->json([
            'navigation' => is_array($navigation) ? $navigation :  [],
            'theme' => $theme ? $theme->minified : ''
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroupList() {
        return response()->json(GroupList::orderBy('displayOrder', 'ASC')->get()->map(function($item) {
            return [
                'name' => $item->group->name,
                'color' => $item->color,
                'users' => $item->group->userGroup()->get()->map(function($relation) {
                    return UserHelper::getSlimUser($relation->userId);
                })
            ];
        }));
    }

    /**
     * @param $path
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCustomPage($path) {
        $page = Page::whereRaw('lower(path) = ?', [strtolower($path)])->first();

        return response()->json([
            'title' => $page ? $page->title : 'Not found',
            'content' => $page ? BBcodeUtil::bbcodeParser($page->content) : 'Page not found'
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEmojis() {
        return response()->json(BBcode::where('isEmoji', true)->orderByRaw("RAND()")->get());
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function parseContent(Request $request) {
        $content = $request->input('content');

        return response()->json(BBcodeUtil::bbcodeParser($content));
    }

    /**
     * Used for pages that don't load data to still see if they got connection
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPing() {
        return response()->json();
    }

    /**
     * Get request for fetching the current maintenance mode message
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaintenanceMessage () {
        $settingKeys = ConfigHelper::getKeyConfig();
        return response()->json([
            'content' => BBcodeUtil::bbcodeParser(SettingsHelper::getSettingValue($settingKeys->maintenanceContent))
        ]);
    }

    /**
     * Get the home page resource
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHomePage () {
        $user = Cache::get('auth');

        return response()->json([
            'articles' => $this->getArticles($user, 8, $this->categoryTemplates->QUEST),
            'mediaArticles' => $this->getArticles($user, 5, $this->categoryTemplates->MEDIA),
            'notices' => $this->getNotices()
        ]);
    }

    /**
     * Get the resource for register page, used for helping the user validation
     * without doing extra requests.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRegisterPage () {
        return response()->json([
            'names' => User::getQuery()->get(['nickname'])
        ]);
    }

    /**
     * Get an array of all the notices
     *
     * @return Notice[]|\Illuminate\Database\Eloquent\Collection
     */
    private function getNotices () {
        $notices = Notice::all();

        foreach ($notices as $notice) {
            $notice->makeHidden(['createdAt', 'updatedAt', 'userId', 'isDeleted']);
            $notice->text = nl2br(stripcslashes($notice->text));
        }

        return $notices;
    }

    /**
     * Get an array of all available articles
     *
     * @param $user
     * @param $amount
     * @param $type
     *
     * @return array
     */
    private function getArticles ($user, $amount, $type) {
        $categories = Category::where('template', $type)
            ->pluck('categoryId')->toArray();

        $categoryIds = Iterables::filter($categories, function ($categoryId) use ($user) {
            return PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canRead, $categoryId);
        });

        $threads = Thread::isApproved()->orderBy('threadId', 'DESC')->whereIn('categoryId', $categoryIds)->take($amount)->get();
        $articles = [];
        foreach ($threads as $thread) {
            $tags = isset($thread->templateData) ? (strpos($thread->templateData->tags, ',') !== false ?
                explode(',', $thread->templateData->tags) :
                [$thread->templateData->tags]) : null;

            $articles[] = [
                'threadId' => $thread->threadId,
                'badge' => isset($thread->templateData) ? $thread->templateData->badge : null,
                'title' => $thread->title,
                'content' => BBcodeUtil::bbcodeParser($thread->content, false),
                'tags' => $tags,
                'user' => UserHelper::getSlimUser($thread->userId),
                'createdAt' => $thread->createdAt->timestamp,
                'prefix' => $thread->prefix
            ];
        }

        return $articles;
    }
}
