<?php

namespace App\Http\Controllers\Sitecp\Content;

use App\Constants\LogType;
use App\EloquentModels\BBcode;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BBcodeController extends Controller {
    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
    }

    /**
     * Post request to create a new bbcode
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createBbcode(Request $request) {
        $user = $request->get('auth');
        $file = $request->file('image');
        $bbcode = (object) json_decode($request->input('bbcode'));
        $this->bbcodeChecker($bbcode, $request, true);

        $newBbcode = new BBcode(
            [
                'name' => $bbcode->name,
                'example' => Value::objectProperty($bbcode, 'example', null),
                'pattern' => $bbcode->pattern,
                'replace' => Value::objectProperty($bbcode, 'replace', null),
                'content' => Value::objectProperty($bbcode, 'content', null),
                'isEmoji' => $bbcode->isEmoji
            ]
        );
        $newBbcode->save();

        if ($bbcode->isEmoji) {
            $fileName = $newBbcode->bbcodeId.'.gif';
            $target = $this->mySettingRepository->getResourcePath('images/emojis');
            $file->move($target, $fileName);
        }

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_BBCODE,
            ['bbcode' => $newBbcode->name],
            $newBbcode->bbcodeId
        );
        return $this->getBbcode($newBbcode->bbcodeId);
    }

    /**
     * Put request to update given bbcode
     *
     * @param  Request  $request
     * @param $bbcodeId
     *
     * @return JsonResponse
     */
    public function updateBbcode(Request $request, $bbcodeId) {
        $user = $request->get('auth');
        $bbcode = (object) json_decode($request->input('bbcode'));
        $file = $request->file('image');

        $existing = BBcode::find($bbcodeId);
        Condition::precondition(!$existing, 404, 'BBcode does not exist');
        Condition::precondition($existing->isSystem, 400, 'Can not edit a system defined bbcode');
        $this->bbcodeChecker($bbcode, $request, false);

        $existing->name = isset($bbcode->name) ? $bbcode->name : $existing->name;
        $existing->example = isset($bbcode->example) ? $bbcode->example : $existing->example;
        $existing->pattern = isset($bbcode->pattern) ? $bbcode->pattern : $existing->pattern;
        $existing->replace = isset($bbcode->replace) ? $bbcode->replace : $existing->replace;
        $existing->content = isset($bbcode->content) ? $bbcode->content : $existing->content;
        $existing->isEmoji = isset($bbcode->isEmoji) ? $bbcode->isEmoji : $existing->isEmoji;
        $existing->save();

        if ($request->has('image')) {
            $fileName = $existing->bbcodeId.'.gif';
            $target = $this->mySettingRepository->getResourcePath('images/emojis');
            $file->move($target, $fileName);
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_BBCODE, ['bbcode' => $existing->name], $existing->bbcodeId);
        return $this->getBbcode($bbcodeId);
    }

    /**
     * Get request to get resource of given bbcode
     *
     * @param $bbcodeId
     *
     * @return JsonResponse
     */
    public function getBbcode($bbcodeId) {
        $bbcode = BBcode::find($bbcodeId);
        Condition::precondition(!$bbcode, 404, 'BBcode do not exist');

        return response()->json($bbcode);
    }

    /**
     * Delete request to delete given bbcode
     *
     * @param  Request  $request
     * @param $bbcodeId
     *
     * @return JsonResponse
     */
    public function deleteBbcode(Request $request, $bbcodeId) {
        $user = $request->get('auth');
        $bbcode = BBcode::find($bbcodeId);

        Condition::precondition(!$bbcode, 404, 'BBcode do not exist');
        Condition::precondition($bbcode->isSystem, 400, 'Can not delete system defined bbcode');

        $bbcode->delete();
        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_BBCODE, ['bbcode' => $bbcode->name], $bbcode->bbcodeId);
        return response()->json();
    }

    /**
     * Get request to fetch array of all available bbcodes
     *
     * @return JsonResponse
     */
    public function getBbcodes() {
        return response()->json(BBcode::get());
    }

    /**
     * Condition collection for creating or updating a bbcode
     *
     * @param $bbcode
     * @param $request
     *
     * @param  bool  $isImageRequired
     */
    private function bbcodeChecker($bbcode, $request, $isImageRequired) {
        Condition::precondition(!$bbcode, 400, 'No bbcode sent for creation');
        Condition::precondition(!isset($bbcode->name), 400, 'Name needs to be present');
        Condition::precondition(!isset($bbcode->pattern), 400, 'Pattern needs to be present');
        Condition::precondition(!is_int(preg_match($bbcode->pattern, '')), 400, 'Pattern is invalid');
        Condition::precondition(
            $isImageRequired && BBcode::where('pattern', $bbcode->pattern)->count('bbcodeId') > 0,
            404,
            'Pattern already exists'
        );
        if ($bbcode->isEmoji) {
            $request->validate(
                [
                    'image' => ($isImageRequired ? 'required|' : '').'mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=22,max_height=22',
                ]
            );
        } else {
            Condition::precondition(!isset($bbcode->example), 400, 'Example needs to be present');
            Condition::precondition(!isset($bbcode->replace), 400, 'Replace needs to be present');
            Condition::precondition(!isset($bbcode->content), 400, 'Content needs to be present');
        }
    }
}
