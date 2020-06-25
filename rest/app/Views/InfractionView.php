<?php

namespace App\Views;

use App\EloquentModels\Infraction\Infraction;
use App\EloquentModels\Infraction\InfractionLevel;
use App\EloquentModels\User\User;
use stdClass;

class InfractionView {

    public static function of(
        User $user,
        InfractionLevel $infractionLevel,
        Infraction $infraction,
        $type,
        $points,
        $reason
    ) {
        $threadSkeleton = new stdClass();
        $isWarning = $points < 1;
        $threadSkeleton->content = "Hey [mention]@".$user->nickname."[/mention] 
Below you can find information regarding the ".($isWarning ? 'infraction' : 'warning')." you have just been given.
[i]If you'd like to appeal against your infraction or warning, please speak to the Forum Admin.[/i]
        
[b]Details:[/b]
[quote]
".($isWarning ? 'Infraction' : 'Warning')." Type: ".$infractionLevel->title."
Penalty in credits: ".$infractionLevel->penalty." credits was taken
Reason: ".$infraction->reason."
Type: ".$type."
            
Current ".($isWarning ? 'Infraction' : 'Warning')."Points: ".$points."
[/quote]
";

        if ($reason) {
            $threadSkeleton->content .= "
[b]Content that caused the infraction:[/b]
[quote]
".$reason."
[/quote]";
        }

        $threadSkeleton->title = $user->nickname." received ".($isWarning ? 'an infraction' : 'a warning');
        $threadSkeleton->categoryId = $infractionLevel->categoryId;

        return $threadSkeleton;
    }
}
