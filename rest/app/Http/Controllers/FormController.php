<?php

namespace App\Http\Controllers;

use App\Constants\CategoryOptions;
use App\Constants\GithubAuth;
use App\Constants\LogType;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Logger;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use App\Utils\CurlBuilder;
use App\Views\BugReportView;
use App\Views\ContactApplicationView;
use App\Views\JobApplicationView;
use Illuminate\Http\Request;

class FormController extends Controller {
    private $myCategoryRepository;

    public function __construct(CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myCategoryRepository = $categoryRepository;
    }

    public function createApplication(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'A Habbo needs to be set!');
        Condition::precondition(!isset($data->discord) || empty($data->discord), 400, 'A Discord needs to be set!');
        Condition::precondition(!isset($data->country) || empty($data->country), 400, 'A Country needs to be set!');
        Condition::precondition(!isset($data->job) || empty($data->job), 400, 'A Job needs to be set!');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write something about yourself!');
        Condition::precondition(!preg_match('/[a-zA-Z0-9]+#[0-9]{4}/i', $data->discord), 400, 'Discord format must be name#xxxx!');

        $threadSkeleton = JobApplicationView::of($data);
        $jobCategories = $this->myCategoryRepository->getCategoriesWithOption(CategoryOptions::JOB_APPLICATIONS_GO_HERE);

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), LogType::CREATED_APPLICATION);
        return response()->json();
    }

    public function createContact(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to apply!');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'A Habbo needs to be set!');
        Condition::precondition(!isset($data->reason) || empty($data->reason), 400, 'A Reason needs to be set!');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'You need to write why you\'re contacting us!');

        $threadSkeleton = ContactApplicationView::of($data);
        $jobCategories = $this->myCategoryRepository->getCategoriesWithOption(CategoryOptions::CONTACT_POSTS_GO_HERE);

        foreach ($jobCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), LogType::CREATED_CONTACT);
        return response()->json();
    }

    public function createBugReport(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(!$user || $user->userId == 0, 400, 'You need to be logged in to report a bug!');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'You must set a title for the bug!');
        Condition::precondition(!isset($data->description) || empty($data->description), 400, 'You must describe the bug!');
        Condition::precondition(!isset($data->steps) || empty($data->steps), 400, 'You must describe how to make the bug happen!');
        Condition::precondition(!isset($data->expected) || empty($data->expected), 400, 'You must tell us what you expected to happen!');
        Condition::precondition(!isset($data->expected) || empty($data->actual), 400, 'You must tell us what actually happened!');


        $postFields = json_encode(BugReportView::of($user, $data));

        $owner = GithubAuth::OWNER;
        $repo = GithubAuth::REPOSITORY;
        $auth = 'Authorization: Token '.GithubAuth::TOKEN;

        return CurlBuilder::newBuilder("https://api.github.com/repos/{$owner}/{$repo}/issues")
            ->withHeaders(['Content-Type: application/json', $auth])
            ->asPostMethod()
            ->withBody($postFields)
            ->exec();
    }
}
