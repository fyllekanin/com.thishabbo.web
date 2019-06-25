<?php

namespace App\Views;

use App\EloquentModels\User\User;

class BugReportView {

    public static function of(User $user, $data) {
        $reportData = new \stdClass();

        $reportData->title = "Bug reported by " . $user->username;

        $reportData->body = "#### Issue description
- " . $data->description . "

#### Steps to reproduce the issue
" . $data->steps . "

#### What's the expected result?
- " . $data->expected . "

#### What's the actual result?
- " . $data->actual . "

#### Additional details / screenshot
- " . $data->additional . "
- " . $data->screenshot;

        return $reportData;
    }
}