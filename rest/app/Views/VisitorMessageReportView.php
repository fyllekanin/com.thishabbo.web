<?php

namespace App\Views;

use App\EloquentModels\User\User;
use App\EloquentModels\User\VisitorMessage;
use App\Helpers\DataHelper;
use stdClass;

class VisitorMessageReportView {

    public static function of(User $user, VisitorMessage $visitorMessage, $message) {
        $threadSkeleton = new stdClass();

        $subjectId = $visitorMessage->isComment() ? $visitorMessage->parentId : $visitorMessage->visitorMessageId;
        $page = DataHelper::getPage(VisitorMessage::where('hostId', $visitorMessage->hostId)
            ->isSubject()
            ->where('visitorMessageId', '<', $subjectId)
            ->where('hostId', $visitorMessage->hostId)
            ->count('visitorMessageId'));
        $threadSkeleton->content = "[mention]@" . $user->nickname . "[/mention] reported a visitor message.

        [b]User reported:[/b] [mention]@" . $visitorMessage->user->nickname . "[/mention]
        [b]Message:[/b] [url=/user/profile/" . $visitorMessage->host->nickname . "/page/" . $page . "?scrollTo=vmId-" . $visitorMessage->visitorMessageId . "]Click here to go to message.[/url]
        
        [b]Reason:[/b]
        [quote]" . $message . "[/quote]
        
        [b]Original message:[/b]
        [quote]" . $visitorMessage->content . "[/quote]";
        $threadSkeleton->title = 'Report by ' . $user->nickname;

        return $threadSkeleton;
    }
}