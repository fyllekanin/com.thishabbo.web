<?php

namespace App\Http\Controllers\Admin\Betting;

use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class CategoryController extends Controller {

    /**
     * Get the specific betting category
     *
     * @param $bettingCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBetCategory ($bettingCategoryId) {
        $bettingCategory = BetCategory::find($bettingCategoryId);

        return response()->json($bettingCategory);
    }

    /**
     * Get the list of betting categories
     *
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBetCategories (Request $request, $page) {
        $filter = $request->input('filter');

        $getBetCategorySql = BetCategory::where('name', 'LIKE', '%' . $filter . '%')
            ->orderBy('name', 'ASC');
        $total = ceil($getBetCategorySql->count() / $this->perPage);

        return response()->json([
            'betCategories' => $getBetCategorySql->take($this->perPage)->skip($this->getOffset($page))->get(),
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * Post request to create a betting category
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBetCategory (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $betCategory = (object)$request->input('betCategory');

        $this->betCategoryConditionCollection($betCategory);

        $newBetCategory = new BetCategory([
            'name' => $betCategory->name,
            'displayOrder' => $betCategory->displayOrder
        ]);
        $newBetCategory->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_BETTING_CATEGORY, ['category' => $newBetCategory->name]);
        return $this->getBetCategory($newBetCategory->betCategoryId);
    }

    /**
     * Put request to update specified betting category
     *
     * @param Request $request
     * @param         $betCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateBetCategory (Request $request, $betCategoryId) {
        $user = UserHelper::getUserFromRequest($request);
        $newBetCategory = (object)$request->input('betCategory');

        $betCategory = BetCategory::find($betCategoryId);
        Condition::precondition(!$betCategory, 404, 'Bet category do not exist');

        $this->betCategoryConditionCollection($newBetCategory);

        $betCategory->name = $newBetCategory->name;
        $betCategory->displayOrder = $newBetCategory->displayOrder;
        $betCategory->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_BETTING_CATEGORY, ['category' => $betCategory->name]);
        return $this->getBetCategory($betCategory->betCategoryId);
    }

    /**
     * Delete request for specific beting category
     *
     * @param Request $request
     * @param         $betCategoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBetCategory (Request $request, $betCategoryId) {
        $user = UserHelper::getUserFromRequest($request);
        $betCategory = BetCategory::find($betCategoryId);
        Condition::precondition(!$betCategory, 404, 'Bet category do not exist');

        $betCategory->isDeleted = true;
        $betCategory->save();

        Bet::where('betCategoryId', $betCategory->betCategoryId)->update([
            'betCategoryId' => 0
        ]);

        Logger::admin($user->userId, $request->ip(), Action::DELETED_BETTING_CATEGORY, ['category' => $betCategory->name]);
        return response()->json();
    }

    /**
     * Collection of conditions that needs to be passed to create/update a betting category
     *
     * @param $betCategory
     */
    private function betCategoryConditionCollection ($betCategory) {
        Condition::precondition(!$betCategory, 400, 'Stupid developer');
        Condition::precondition(!isset($betCategory->name) || empty($betCategory->name),
            400, 'Name needs to be set');
        Condition::precondition(!isset($betCategory->displayOrder) || $betCategory->displayOrder < 1,
            400, 'Display order needs to be 1 or higher');

        $nameIsUnique = BetCategory::withName($betCategory->name)
                ->where('betCategoryId', '!=', Value::objectProperty($betCategory, 'betCategoryId', 0))
                ->count() == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name is already taken');
    }
}
