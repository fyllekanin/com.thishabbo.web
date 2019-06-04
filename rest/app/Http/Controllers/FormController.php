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
}
