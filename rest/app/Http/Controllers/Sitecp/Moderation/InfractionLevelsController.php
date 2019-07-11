<?php

namespace App\Http\Controllers\Sitecp\Moderation;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Infraction\InfractionLevel;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class InfractionLevelsController extends Controller {
    private $forumService;

    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractionLevels(Request $request, $page) {
        $filter = $request->input('filter');
        $infractionLevelsSql = InfractionLevel::where('title', 'LIKE', Value::getFilterValue($request, $filter));

        return response()->json([
            'page' => $page,
            'total' => $infractionLevelsSql->count('infractionLevelId'),
            'items' => $infractionLevelsSql->take($this->perPage)
                ->skip(DataHelper::getOffset($page))
                ->get()
        ]);
    }

    /**
     * @param Request $request
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractionLevel(Request $request, $infractionLevelId) {
        $user = $request->get('auth');
        $infractionLevel = InfractionLevel::find($infractionLevelId);
        $isNew = $infractionLevelId == 'new';

        if (!$isNew) {
            Condition::precondition(!$infractionLevel, 404, 'No infraction level with this ID exists');
        }

        return response()->json([
            'infractionLevelId' => $isNew ? null : $infractionLevel->infractionLevelId,
            'title' => $isNew ? null : $infractionLevel->title,
            'points' => $isNew ? null : $infractionLevel->points,
            'lifeTime' => $isNew ? null : ($infractionLevel->lifeTime / 86400),
            'createdAt' => $isNew ? null : $infractionLevel->createdAt->timestamp,
            'categoryId' => $isNew ? null : $infractionLevel->categoryId,
            'penalty' => $isNew ? 0 : $infractionLevel->penalty,
            'categories' => $this->forumService->getCategoryTree($user)
        ]);
    }

    /**
     * @param Request $request
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateInfractionLevel(Request $request, $infractionLevelId) {
        $user = $request->get('auth');
        $newInfractionLevel = (object)$request->input('infractionLevel');
        $infractionLevel = InfractionLevel::find($infractionLevelId);
        Condition::precondition(!$infractionLevel, 404, 'No infraction level with that ID exists');

        $this->validateInfractionLevel($newInfractionLevel);

        $infractionLevel->title = $newInfractionLevel->title;
        $infractionLevel->points = $newInfractionLevel->points;
        $infractionLevel->lifeTime = $newInfractionLevel->lifeTime * 86400;
        $infractionLevel->categoryId = Value::objectProperty($newInfractionLevel, 'categoryId', null);
        $infractionLevel->penalty = Value::objectProperty($newInfractionLevel, 'penalty', 0);
        $infractionLevel->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ], $infractionLevel->infractionLevelId);
        return $this->getInfractionLevel($request, $infractionLevel->infractionLevelId);
    }

    /**
     * @param Request $request
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteInfractionLevel(Request $request, $infractionLevelId) {
        $user = $request->get('auth');

        $infractionLevel = InfractionLevel::find($infractionLevelId);
        Condition::precondition(!$infractionLevel, 404, 'No infraction level with this ID exists');

        $infractionLevel->isDeleted = true;
        $infractionLevel->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ], $infractionLevel->infractionLevelId);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createInfractionLevel(Request $request) {
        $user = $request->get('auth');
        $newInfractionLevel = (object)$request->input('infractionLevel');
        $this->validateInfractionLevel($newInfractionLevel);

        $infractionLevel = new InfractionLevel([
            'title' => $newInfractionLevel->title,
            'points' => $newInfractionLevel->points,
            'lifeTime' => $newInfractionLevel->lifeTime * 86400,
            'categoryId' => Value::objectProperty($newInfractionLevel, 'categoryId', null),
            'penalty' => Value::objectProperty($newInfractionLevel, 'penalty', 0)
        ]);
        $infractionLevel->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ], $infractionLevel->infractionLevelId);
        return $this->getInfractionLevel($request, $infractionLevel->infractionLevelId);
    }

    /**
     * @param $infractionLevel
     */
    private function validateInfractionLevel($infractionLevel) {
        Condition::precondition(!isset($infractionLevel->title) || empty($infractionLevel->title),
            400, 'Title needs to be set');
        Condition::precondition(!isset($infractionLevel->points) || !is_numeric($infractionLevel->points),
            400, 'Points needs to be set as a number');
        Condition::precondition(!isset($infractionLevel->lifeTime) || !is_numeric($infractionLevel->lifeTime),
            400, 'Life time needs to be set as a number');
        Condition::precondition(isset($infractionLevel->categoryId) && Category::where('categoryId',
                $infractionLevel->categoryId)->count('categoryId') == 0, 400, 'Category with that ID do not exist');
        Condition::precondition(isset($infractionLevel->penalty) && !is_numeric($infractionLevel->penalty), 400,
            'Penalty needs to be numeric.');
        Condition::precondition(isset($infractionLevel->penalty) && $infractionLevel->penalty < 0, 400,
            'Penalty needs to be a positive number!');
    }
}
