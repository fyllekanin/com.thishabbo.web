<?php

namespace App\Http\Controllers\Admin\Content;

use App\EloquentModels\BBcode;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class BBcodeController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    /**
     * Post request to create a new bbcode
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBBcode(Request $request) {
        $file = $request->file('image');
        $bbcode = (object)json_decode($request->input('bbcode'));
        $this->bbcodeChecker($bbcode, $request, true);

        $newBbcode = new BBcode([
            'name' => $bbcode->name,
            'example' => Value::objectProperty($bbcode, 'example', null),
            'pattern' => $bbcode->pattern,
            'replace' => Value::objectProperty($bbcode, 'reeplace', null),
            'content' => Value::objectProperty($bbcode, 'content', null),
            'isEmoji' => $bbcode->isEmoji
        ]);
        $newBbcode->save();

        if ($bbcode->isEmoji) {
            $fileName = $newBbcode->bbcodeId . '.gif';
            $destination = base_path('/public/rest/resources/images/emojis');
            $file->move($destination, $fileName);
        }

        Logger::admin($this->user->userId, $request->ip(), Action::CREATED_BBCODE,
            ['bbcode' => $newBbcode->name], $newBbcode->bbcodeId);
        return $this->getBBcode($newBbcode->bbcodeId);
    }

    /**
     * Put request to update given bbcode
     *
     * @param Request $request
     * @param         $bbcodeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateBBcode(Request $request, $bbcodeId) {
        $bbcode = (object)json_decode($request->input('bbcode'));
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
            $fileName = $existing->bbcodeId . '.gif';
            $destination = base_path('/public/rest/resources/images/emojis');
            $file->move($destination, $fileName);
        }

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_BBCODE, ['bbcode' => $existing->name], $existing->bbcodeId);
        return $this->getBBcode($bbcodeId);
    }

    /**
     * Get request to get resource of given bbcode
     *
     * @param $bbcodeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBBcode($bbcodeId) {
        $bbcode = BBcode::find($bbcodeId);
        Condition::precondition(!$bbcode, 404, 'BBcode do not exist');

        return response()->json($bbcode);
    }

    /**
     * Delete request to delete given bbcode
     *
     * @param Request $request
     * @param         $bbcodeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBBcode(Request $request, $bbcodeId) {
        $bbcode = BBcode::find($bbcodeId);

        Condition::precondition(!$bbcode, 404, 'BBcode do not exist');
        Condition::precondition($bbcode->isSystem, 400, 'Can not delete system defined bbcode');

        $bbcode->delete();
        Logger::admin($this->user->userId, $request->ip(), Action::DELETED_BBCODE, ['bbcode' => $bbcode->name], $bbcode->bbcodeId);
        return response()->json();
    }

    /**
     * Get request to fetch array of all available bbcodes
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBBcodes() {
        return response()->json(BBcode::get());
    }

    /**
     * Condition collection for creating or updating a bbcode
     *
     * @param      $bbcode
     * @param      $request
     *
     * @param bool $isImageRequired
     *
     */
    private function bbcodeChecker($bbcode, $request, $isImageRequired) {
        Condition::precondition(!$bbcode, 400, 'No bbcode sent for creation');
        Condition::precondition(!isset($bbcode->name), 400, 'Name needs to be present');
        Condition::precondition(!isset($bbcode->pattern), 400, 'Pattern needs to be present');
        Condition::precondition(!is_int(preg_match($bbcode->pattern, '')), 400, 'Pattern is invalid');
        Condition::precondition($isImageRequired && BBcode::where('pattern', $bbcode->pattern)->count('bbcodeId') > 0,
            404, 'Pattern already exists');
        if ($bbcode->isEmoji) {
            $this->validate($request, [
                'image' => ($isImageRequired ? 'required|' : '') . 'mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=22,max_height=22',
            ]);
        } else {
            Condition::precondition(!isset($bbcode->example), 400, 'Example needs to be present');
            Condition::precondition(!isset($bbcode->replace), 400, 'Replace needs to be present');
            Condition::precondition(!isset($bbcode->content), 400, 'Content needs to be present');
        }
    }
}
