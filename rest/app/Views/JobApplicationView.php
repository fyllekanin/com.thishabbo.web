<?php

namespace App\Views;

use stdClass;

class JobApplicationView {

    public static function of($data) {
        $threadSkeleton = new stdClass();

        $threadSkeleton->content = "[b]Habbo[/b]
        ".$data->habbo."
        
        [b]Discord[/b]
        ".$data->discord."
        
        [b]Job/Interested in[/b]
        ".$data->job."
        
        [b]Country[/b]
        ".$data->country."
        
        [b]About me[/b]
        [quote]".$data->content."[/quote]";
        $threadSkeleton->title = 'Application: '.$data->job;

        return $threadSkeleton;
    }
}
