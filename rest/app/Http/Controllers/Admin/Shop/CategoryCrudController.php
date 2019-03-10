<?php

namespace App\Http\Controllers\Admin\Shop;

use App\EloquentModels\Shop\ShopCategory;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class CategoryCrudController extends Controller {

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategories(Request $request, $page) {
        $filter = $request->input('filter');

        $categoriesSql = ShopCategory::where('title', 'LIKE', '%' . $filter . '%')
            ->orderBy('title', 'ASC');

        return response()->json([
            'total' => ceil($categoriesSql->count() / $this->perPage),
            'page' => $page,
            'items' => $categoriesSql->take($this->perPage)->skip($this->getOffset($page))
                ->get()->map(function($category) {
                    return [
                        'shopCategoryId' => $category->shopCategoryId,
                        'title' => $category->title,
                        'description' => $category->description,
                        'displayOrder' => $category->displayOrder,
                        'createdAt' => $category->createdAt->timestamp
                    ];
                })
        ]);
    }

    /**
     * @param $shopCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategory($shopCategoryId) {
        $shopCategory = ShopCategory::find($shopCategoryId);
        Condition::precondition(!$shopCategory, 404, 'No shop category with that ID');

        return response()->json([
            'shopCategoryId' => $shopCategory->shopCategoryId,
            'title' => $shopCategory->title,
            'description' => $shopCategory->description,
            'displayOrder' => $shopCategory->displayOrder,
            'createdAt' => $shopCategory->createdAt->timestamp
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCategory(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $category = (object) $request->input('category');
        $this->validateShopCategory($category);

        $shopCategory = new ShopCategory([
            'title' => $category->title,
            'description' => $category->description,
            'displayOrder' => $category->displayOrder
        ]);
        $shopCategory->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_SHOP_CATEGORY, [
            'title' => $category->title
        ]);
        return $this->getCategory($shopCategory->shopCategoryId);
    }

    /**
     * @param Request $request
     * @param         $shopCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCategory(Request $request, $shopCategoryId) {
        $user = UserHelper::getUserFromRequest($request);
        $category = (object) $request->input('category');
        $this->validateShopCategory($category);

        $shopCategory = ShopCategory::find($shopCategoryId);
        Condition::precondition(!$shopCategory, 404, 'No shop category with that ID');

        $shopCategory->title = $category->title;
        $shopCategory->description = $category->description;
        $shopCategory->displayOrder = $category->displayOrder;
        $shopCategory->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_SHOP_CATEGORY, [
            'title' => $shopCategory->title
        ]);
        return $this->getCategory($shopCategory->shopCategoryId);
    }

    /**
     * @param Request $request
     * @param         $shopCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteCategory(Request $request, $shopCategoryId) {
        $user = UserHelper::getUserFromRequest($request);
        $shopCategory = ShopCategory::find($shopCategoryId);
        Condition::precondition(!$shopCategory, 404, 'No shop category with that ID');

        $shopCategory->isDeleted = true;
        $shopCategory->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_SHOP_CATEGORY, [
            'title' => $shopCategory->title
        ]);
        return response()->json();
    }

    private function validateShopCategory($category) {
        Condition::precondition(!isset($category->title) || empty($category->title), 400,
            'Title needs to be set');
        Condition::precondition(!isset($category->description) || empty($category->description), 400,
            'Description needs to be set');
        Condition::precondition(!isset($category->displayOrder) || !is_numeric($category->displayOrder), 400,
            'Display order needs to be set and be numeric');
    }
}
