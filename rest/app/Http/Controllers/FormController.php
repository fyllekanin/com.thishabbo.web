<?php

namespace App\Http\Controllers;

use App\EloquentModels\Forum\Category;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Utils\Condition;
use App\Views\ContactApplicationView;
use App\Views\JobApplicationView;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Helpers\ConfigHelper;
use League\Flysystem\Config;
use App\Views\BugReportView;

class FormController extends Controller {

    public function createApplication(Request $request, ForumService $forumService, ForumValidatorService $validatorService) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'Habbo needs to be set');
        Condition::precondition(!isset($data->discord) || empty($data->discord), 400, 'Discord needs to be set');
        Condition::precondition(!isset($data->country) || empty($data->country), 400, 'Country needs to be set');
        Condition::precondition(!isset($data->job) || empty($data->job), 400, 'Job needs to be set');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write something about yourself');
        Condition::precondition(!preg_match('/[a-zA-Z0-9]+#[0-9]{4}/i', $data->discord), 400, 'Discord format most be name#xxxx');

        $threadSkeleton = JobApplicationView::of($data);
        $jobCategories = Category::isJobCategory()->get();
        $threadController = new ThreadCrudController($forumService, $validatorService);

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            try {
                $threadController->doThread($user, null, $threadSkeleton, null, true);
            } catch (ValidationException $e) {
            }
        }

        Logger::user($user->userId, $request->ip(), Action::CREATED_APPLICATION);
        return response()->json();
    }

    public function createContact(Request $request, ForumService $forumService, ForumValidatorService $validatorService) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'Habbo needs to be set');
        Condition::precondition(!isset($data->reason) || empty($data->reason), 400, 'Reason needs to be set');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write something about yourself');

        $threadSkeleton = ContactApplicationView::of($data);
        $jobCategories = Category::isContactCategory()->get();
        $threadController = new ThreadCrudController($forumService, $validatorService);

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            try {
                $threadController->doThread($user, null, $threadSkeleton, null, true);
            } catch (ValidationException $e) {
            }
        }

        Logger::user($user->userId, $request->ip(), Action::CREATED_CONTACT);
        return response()->json();
    }

    public function createBugReport(Request $request) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to report a bug!');
        Condition::precondition(!isset($data->description) || empty($data->description), 400, 'You must describe the bug!');
        Condition::precondition(!isset($data->steps) || empty($data->steps), 400, 'You must describe how to make the bug happen!');
        Condition::precondition(!isset($data->expected) || empty($data->expected), 400, 'You must tell us what you expected to happen!');
        Condition::precondition(!isset($data->expected) || empty($data->actual), 400, 'You must tell us what actually happened!');


        $postFields = json_encode(BugReportView::of($user, $data));

        $owner = ConfigHelper::getGithubSettings()->owner;
        $repo = ConfigHelper::getGithubSettings()->repository;
        $token = ConfigHelper::getGithubSettings()->token;

        $auth = 'Authorization: Bearer ' . $token;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://api.github.com/repos/' . $owner . '/' . $repo . '/issues');
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', $auth));
        curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl, CURLOPT_TIMEOUT, 5);

        $data = curl_exec($curl);
        curl_close($curl);

        return $data;
    }
}
