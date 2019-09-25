<?php

namespace App\Http\Controllers;

use App\EloquentModels\Forum\Category;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Views\BugReportView;
use App\Views\ContactApplicationView;
use App\Views\JobApplicationView;
use Illuminate\Http\Request;

class FormController extends Controller {

    public function createApplication(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'A Habbo needs to be set!');
        Condition::precondition(!isset($data->discord) || empty($data->discord), 400, 'A Discord needs to be set!');
        Condition::precondition(!isset($data->country) || empty($data->country), 400, 'A Country needs to be set!');
        Condition::precondition(!isset($data->job) || empty($data->job), 400, 'A Job needs to be set!');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write something about yourself!');
        Condition::precondition(!preg_match('/[a-zA-Z0-9]+#[0-9]{4}/i', $data->discord), 400, 'Discord format must be name#xxxx!');

        $threadSkeleton = JobApplicationView::of($data);
        $jobCategories = Category::isJobCategory()->get();

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), Action::CREATED_APPLICATION);
        return response()->json();
    }

    public function createContact(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'A Habbo needs to be set!');
        Condition::precondition(!isset($data->reason) || empty($data->reason), 400, 'A Reason needs to be set!');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write why you\'re contacting us!');

        $threadSkeleton = ContactApplicationView::of($data);
        $jobCategories = Category::isContactCategory()->get();

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), Action::CREATED_CONTACT);
        return response()->json();
    }

    public function createBugReport(Request $request) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to report a bug!');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'You must set a title for the bug!');
        Condition::precondition(!isset($data->description) || empty($data->description), 400, 'You must describe the bug!');
        Condition::precondition(!isset($data->steps) || empty($data->steps), 400, 'You must describe how to make the bug happen!');
        Condition::precondition(!isset($data->expected) || empty($data->expected), 400, 'You must tell us what you expected to happen!');
        Condition::precondition(!isset($data->expected) || empty($data->actual), 400, 'You must tell us what actually happened!');


        $postFields = json_encode(BugReportView::of($user, $data));

        $githubSettings = ConfigHelper::getGithubSettings();

        $owner = $githubSettings->owner;
        $repo = $githubSettings->repository;
        $token = $githubSettings->token;

        $auth = 'Authorization: Token ' . $token;

        $curl = DataHelper::getBasicCurl('https://api.github.com/repos/' . $owner . '/' . $repo . '/issues');
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', $auth));
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postFields);

        $data = curl_exec($curl);
        curl_close($curl);

        return $data;
    }
}
