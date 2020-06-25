<?php

namespace App\Http\Impl\Sitecp;

use App\Constants\LogType;
use App\EloquentModels\User\User;

class LogsControllerImpl {

    public function getFormattedContent($item, $data) {
        switch ($item->action) {
            case LogType::getAction(LogType::UPDATED_USERS_THC):
                $user = User::find($item->contentId);
                return $data->before.' -> '.$data->after.' for '.$user->nickname;
            case LogType::getAction(LogType::SENT_THC):
                $user = User::find($item->contentId);
                return 'To: '.($user ? $user->nickname : 'unknown').' '.'Amount: '.$data->amount;
            case LogType::getAction(LogType::CREATED_DO_NOT_HIRE):
            case LogType::getAction(LogType::UPDATED_DO_NOT_HIRE):
            case LogType::getAction(LogType::DELETED_DO_NOT_HIRE):
                return $data->nickname;
            case LogType::getAction(LogType::CREATED_BAN_ON_SIGHT):
            case LogType::getAction(LogType::UPDATED_BAN_ON_SIGHT):
            case LogType::getAction(LogType::DELETED_BAN_ON_SIGHT):
                return $data->name;
            case LogType::getAction(LogType::PLACED_BET):
                if (!$data) {
                    return null;
                }
                return 'Bet: '.$data->bet->name.' '.'Amount: '.$data->userBet->amount;
            case LogType::getAction(LogType::MANAGED_THC_REQUESTS):
                if (!$data || !isset($data->forUserId)) {
                    return $data->forUser;
                }
                return User::where('userId', $data->forUserId)->value('nickname').' - '.$data->amount.' thc';
            default:
                return null;
        }
    }
}
