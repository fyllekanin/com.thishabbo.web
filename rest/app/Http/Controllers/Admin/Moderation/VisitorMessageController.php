<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\User\VisitorMessage;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class VisitorMessageController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    /**
     * @param Request $request
     * @param $visitorMessageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteVisitorMessage(Request $request, $visitorMessageId) {
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        Condition::precondition(!$visitorMessage, 404, 'There is not visitor message with this ID');

        $visitorMessage->isDeleted = true;
        $visitorMessage->save();

        if (!$visitorMessage->isComment()) {
            VisitorMessage::withParent($visitorMessage->visitorMessageId)->update(['isDeleted' => true]);
        }

        Logger::mod($this->user->userId, $request->ip(), Action::DELETED_VISITOR_MESSAGE, [], $visitorMessage->visitorMessageId);
        return response()->json();
    }
}
