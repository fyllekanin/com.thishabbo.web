<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\User\VisitorMessage;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VisitorMessageController extends Controller {

    /**
     * @param Request $request
     * @param $visitorMessageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteVisitorMessage(Request $request, $visitorMessageId) {
        $user = Cache::get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        Condition::precondition(!$visitorMessage, 404, 'There is not visitor message with this ID');

        $visitorMessage->isDeleted = true;
        $visitorMessage->save();

        if (!$visitorMessage->isComment()) {
            VisitorMessage::withParent($visitorMessage->visitorMessageId)->update(['isDeleted' => true]);
        }

        Logger::mod($user->userId, $request->ip(), Action::DELETED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }
}
