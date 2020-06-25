<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\EloquentModels\Notice;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class NoticeController extends Controller {
    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
    }

    /**
     * Put request to update order of notices
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateNoticeOrder(Request $request) {
        $user = $request->get('auth');
        $notices = $request->input('notices');

        foreach ($notices as $notice) {
            $n = Notice::find($notice['noticeId']);
            $n->order = $notice['order'];
            $n->save();
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_NOTICES_ORDER);
        return response()->json();
    }

    /**
     * Get request to fetch all notices
     *
     * @return Notice[]| Collection
     */
    public function getNotices() {
        $notices = Notice::all();

        foreach ($notices as $notice) {
            $notice->text = nl2br(stripcslashes($notice->text));
        }

        return $notices;
    }

    /**
     * Delete request to delete given notice
     *
     * @param  Request  $request
     * @param $noticeId
     *
     * @return JsonResponse
     */
    public function deleteNotice(Request $request, $noticeId) {
        $user = $request->get('auth');

        $notice = Notice::find($noticeId);
        $notice->isDeleted = 1;
        $notice->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_NOTICE, ['notice' => $notice->title]);
        return response()->json();
    }

    /**
     * Post method to create a new notice
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createNotice(Request $request) {
        $user = $request->get('auth');
        $notice = json_decode($request->input('notice'));
        $backgroundImage = $request->file('backgroundImage');

        $haveCreatedNewToFast = Notice::where('createdAt', '>', $this->nowMinus15)->count('noticeId') > 0;

        Condition::precondition($haveCreatedNewToFast, 400, 'You are creating notices to fast');
        Condition::precondition(empty($notice->title), 400, 'Title can not be empty');
        Condition::precondition(empty($notice->text), 400, 'Text can not be empty');
        Condition::precondition(empty($notice->backgroundColor), 400, 'Background color can not be empty');

        $request->validate(
            [
                'backgroundImage' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]
        );

        $highestOrderNotice = Notice::orderBy('order', 'DESC')->first();
        $notice = new Notice(
            [
                'title' => $notice->title,
                'text' => $notice->text,
                'backgroundColor' => $notice->backgroundColor,
                'order' => Value::objectProperty($highestOrderNotice, 'order', 1),
                'userId' => $user->userId
            ]
        );
        $notice->save();

        $fileName = $notice->noticeId.'.gif';
        $target = $this->mySettingRepository->getResourcePath('images/notices');
        $backgroundImage->move($target, $fileName);

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_NOTICE, ['notice' => $notice->title]);
        return response()->json();
    }
}
