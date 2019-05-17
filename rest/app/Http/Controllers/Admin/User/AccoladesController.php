<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\User\Accolade;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class AccoladesController extends Controller {

    public function getAccoladePage(Request $request, $userId) {
        $user = $request->get('auth');
        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'You are not able to edit this user');

        return response()->json([
            'user' => UserHelper::getSlimUser($userId),
            'items' => Accolade::where('userId', $userId)->orderBy('start', 'ASC')->get([
                'accoladeId', 'role', 'start', 'end', 'type'
            ]),
            'types' => ConfigHelper::getAccoladeTypes()
        ]);
    }

    public function createAccolade(Request $request, $userId) {
        $data = (object)$request->input('data');
        $user = $request->get('auth');

        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'You are not able to edit this user');
        Condition::precondition(User::where('userId', $userId)->count() == 0, 404, 'User with that ID do not exist');
        $this->validateAccolade($data);

        $accolade = new Accolade([
            'userId' => $userId,
            'role' => $data->role,
            'start' => $data->start,
            'end' => $data->end,
            'type' => $data->type
        ]);
        $accolade->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_ACCOLADE, ['userId' => $userId], $accolade->accoladeId);
        return response()->json($accolade);
    }

    public function updateAccolade(Request $request, $userId, $accoladeId) {
        $data = (object)$request->input('data');
        $user = $request->get('auth');
        $accolade = Accolade::find($accoladeId);

        Condition::precondition(!$accolade, 404, 'No accolade with that ID');
        Condition::precondition(!UserHelper::canManageUser($user, $accolade->user->userId), 400, 'You are not able to edit this user');
        $this->validateAccolade($data);

        $accolade->role = $data->role;
        $accolade->start = $data->start;
        $accolade->end = $data->end;
        $accolade->type = $data->type;
        $accolade->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_ACCOLADE, ['userId' => $userId], $accolade->accoladeId);
        return response()->json($accolade);
    }

    public function deleteAccolade(Request $request, $userId, $accoladeId) {
        $user = $request->get('auth');
        $accolade = Accolade::find($accoladeId);
        Condition::precondition(!$accolade, 404, 'No accolade with that ID');
        Condition::precondition(!UserHelper::canManageUser($user, $accolade->user->userId), 400, 'You are not able to edit this user');

        $accolade->isDeleted = true;
        $accolade->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_ACCOLADE, ['userId' => $userId], $accolade->accoladeId);
        return response()->json();
    }

    private function validateAccolade($accolade) {
        Condition::precondition(!$accolade, 400, 'No data!');
        Condition::precondition(!isset($accolade->role) || empty($accolade->role), 400, 'Role can not be empty');
        Condition::precondition(!isset($accolade->start) || empty($accolade->start), 400, 'Start date can not be empty');
        Condition::precondition(!is_numeric($accolade->start), 400, 'Start date needs to be numeric');
        Condition::precondition(isset($accolade->end) && !is_numeric($accolade->end), 400, 'End date needs to be numeric');

        $type = Iterables::find((array)ConfigHelper::getAccoladeTypes(), function ($type) use ($accolade) {
            return $type['id'] == $accolade->type;
        });
        Condition::precondition(!$type, 400, 'Provided type do not exist');
    }
}
