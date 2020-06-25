<?php

namespace App\Http\Controllers\Sitecp\Moderation;

use App\Constants\LogType;
use App\EloquentModels\User\VisitorMessage;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorMessageController extends Controller {

    /**
     * @param  Request  $request
     * @param $visitorMessageId
     *
     * @return JsonResponse
     */
    public function deleteVisitorMessage(Request $request, $visitorMessageId) {
        $user = $request->get('auth');
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        Condition::precondition(!$visitorMessage, 404, 'There is not visitor message with this ID');

        $visitorMessage->isDeleted = true;
        $visitorMessage->save();

        if (!$visitorMessage->isComment()) {
            VisitorMessage::withParent($visitorMessage->visitorMessageId)->update(['isDeleted' => true]);
        }

        Logger::mod($user->userId, $request->ip(), LogType::DELETED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }
}
