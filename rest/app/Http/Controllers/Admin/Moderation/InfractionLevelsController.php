<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\Infraction\InfractionLevel;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class InfractionLevelsController extends Controller {

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractionLevels(Request $request, $page) {
        $filter = $request->input('filter');
        $infractionLevelsSql = InfractionLevel::where('title', 'LIKE', '%' . $filter . '%');

        return response()->json([
            'page' => $page,
            'total' => $infractionLevelsSql->count(),
            'items' => $infractionLevelsSql->take($this->perPage)
                ->skip($this->getOffset($page))
                ->get()
        ]);
    }

    /**
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractionLevel($infractionLevelId) {
        $infractionLevel = InfractionLevel::find($infractionLevelId);
        Condition::precondition(!$infractionLevel, 404, 'No infraction level with this ID exists');

        return response()->json([
            'infractionLevelId' => $infractionLevel->infractionLevelId,
            'title' => $infractionLevel->title,
            'points' => $infractionLevel->points,
            'lifeTime' => ($infractionLevel->lifeTime / 86400),
            'createdAt' => $infractionLevel->createdAt->timestamp
        ]);
    }

    /**
     * @param Request $request
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateInfractionLevel(Request $request, $infractionLevelId) {
        $user = UserHelper::getUserFromRequest($request);
        $newInfractionLevel = (object) $request->input('infractionLevel');
        $infractionLevel = InfractionLevel::find($infractionLevelId);
        Condition::precondition(!$infractionLevel, 404, 'No infraction level with that ID exists');

        $this->validateInfractionLevel($newInfractionLevel);

        $infractionLevel->title = $newInfractionLevel->title;
        $infractionLevel->points = $newInfractionLevel->points;
        $infractionLevel->lifeTime = $newInfractionLevel->lifeTime  * 86400;
        $infractionLevel->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ]);
        return $this->getInfractionLevel($infractionLevel->infractionLevelId);
    }

    /**
     * @param Request $request
     * @param         $infractionLevelId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteInfractionLevel(Request $request, $infractionLevelId) {
        $user = UserHelper::getUserFromRequest($request);

        $infractionLevel = InfractionLevel::find($infractionLevelId);
        Condition::precondition(!$infractionLevel, 404, 'No infraction level with this ID exists');

        $infractionLevel->isDeleted = true;
        $infractionLevel->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createInfractionLevel(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $newInfractionLevel = (object) $request->input('infractionLevel');
        $this->validateInfractionLevel($newInfractionLevel);

        $infractionLevel = new InfractionLevel([
            'title' => $newInfractionLevel->title,
            'points' => $newInfractionLevel->points,
            'lifeTime' => $newInfractionLevel->lifeTime * 86400
        ]);
        $infractionLevel->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_INFRACTION_LEVEL, [
            'infractionLevelId' => $infractionLevel->infractionLevelId
        ]);
        return $this->getInfractionLevel($infractionLevel->infractionLevelId);
    }

    private function validateInfractionLevel($infractionLevel) {
        Condition::precondition(!isset($infractionLevel->title) || empty($infractionLevel->title),
            400, 'Title needs to be set');
        Condition::precondition(!isset($infractionLevel->points) || !is_numeric($infractionLevel->points),
            400, 'Points needs to be set as a number');
        Condition::precondition(!isset($infractionLevel->lifeTime) || !is_numeric($infractionLevel->lifeTime),
            400, 'Life time needs to be set as a number');
    }
}
