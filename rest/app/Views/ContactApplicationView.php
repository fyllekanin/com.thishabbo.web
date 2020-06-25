<?php

namespace App\Views;

use stdClass;

class ContactApplicationView {


    public static function of($data) {
        $threadSkeleton = new stdClass();

        $threadSkeleton->content = "[b]Habbo[/b]
        ".$data->habbo."
        
        [b]Reason[/b]
        ".$data->reason."
        
        [b]Text[/b]
        [quote]".$data->content."[/quote]";
        $threadSkeleton->title = 'Contact: '.$data->reason;

        return $threadSkeleton;
    }
}
