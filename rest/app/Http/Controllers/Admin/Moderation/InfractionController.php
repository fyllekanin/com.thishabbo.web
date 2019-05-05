<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\Infraction\AutoBan;
use App\EloquentModels\Infraction\Infraction;
use App\EloquentModels\Infraction\InfractionLevel;
use App\EloquentModels\User\Ban;
use App\EloquentModels\User\Token;
use App\EloquentModels\User\User;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class InfractionController extends Controller {
    private $forumService;
    private $validatorService;
    private $creditsService;

    private $oneYear = 31449600;

    /**
     * InfractionController constructor.
     *
     * @param ForumService $forumService
     * @param ForumValidatorService $validatorService
     * @param CreditsService $creditsService
     */
    public function __construct(ForumService $forumService, ForumValidatorService $validatorService, CreditsService $creditsService) {
        parent::__construct();
        $this->forumService = $forumService;
        $this->validatorService = $validatorService;
        $this->creditsService = $creditsService;
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractions(Request $request, $page) {
        $filter = $request->input('filter');

        $userIds = User::withNicknameLike($filter)->pluck('userId');
        $infractionsSql = Infraction::whereIn('infractedId', $userIds)
            ->withoutGlobalScope('nonHardDeleted')
            ->orderBy('createdAt', 'DESC');

        $total = DataHelper::getPage($infractionsSql->count('infractionId'));
        $items = $infractionsSql->take($this->perPage)->skip($this->getOffset($page))
            ->get()->map(function ($infraction) {
                return [
                    'infractionId' => $infraction->infractionId,
                    'title' => $infraction->level->title,
                    'reason' => $infraction->reason,
                    'user' => UserHelper::getSlimUser($infraction->infractedId),
                    'by' => UserHelper::getSlimUser($infraction->userId),
                    'isDeleted' => $infraction->isDeleted,
                    'createdAt' => $infraction->createdAt->timestamp
                ];
            });

        return response()->json([
            'page' => $page,
            'total' => $total,
            'items' => $items
        ]);
    }

    /**
     * @param Request $request
     * @param         $infractionId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteInfraction(Request $request, $infractionId) {
        $user = Cache::get('auth');
        $infraction = Infraction::find($infractionId);

        Condition::precondition(!$infraction, 404, 'No infraction with that ID exists');

        $infraction->isDeleted = true;
        $infraction->save();

        NotificationFactory::newInfractionDeleted($infraction->infractedId, $user->userId, $infraction->infractionId);
        Logger::mod($user->userId, $request->ip(), Action::DELETED_INFRACTION, ['infractionId' => $infraction->infractionId]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createInfraction(Request $request) {
        $user = Cache::get('auth');
        $data = (object)$request->input('infraction');
        $this->validateInfraction($data);

        $infractionLevel = InfractionLevel::find($data->infractionLevelId);

        $infraction = new Infraction([
            'infractionLevelId' => $data->infractionLevelId,
            'infractedId' => $data->userId,
            'reason' => $data->reason,
            'userId' => $user->userId,
            'expiresAt' => time() + ($infractionLevel->lifeTime < 0 ? $this->oneYear : $infractionLevel->lifeTime)
        ]);
        $infraction->save();

        if (isset($infractionLevel->categoryId) && $infractionLevel->categoryId > 0 && $this->botAccountExists()) {
            $this->createInfractionThread($infractionLevel, $infraction);
        } else {
            NotificationFactory::newInfractionGiven($data->userId, $user->userId, $infraction->infractionId);
        }

        $this->checkAutomaticBan($user, $data->userId);
        $this->creditsService->takeCredits($data->userId, $infractionLevel->penalty);

        Logger::mod($user->userId, $request->ip(), Action::CREATED_INFRACTION, [
            'userId' => $data->userId,
            'reason' => $data->reason
        ]);
        return response()->json();
    }

    /**
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfractionContext($userId) {
        $user = UserHelper::getSlimUser($userId);
        Condition::precondition(!$user, 404, 'No user with that ID');

        return response()->json([
            'levels' => InfractionLevel::all(),
            'history' => Infraction::where('infractedId', $userId)->take(5)->get()->map(function ($infraction) {
                return [
                    'title' => $infraction->level->title,
                    'user' => UserHelper::getSlimUser($infraction->userId),
                    'createdAt' => $infraction->createdAt->timestamp
                ];
            }),
            'user' => $user
        ]);
    }

    /**
     * @param $infractionLevel
     * @param $infraction
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    private function createInfractionThread($infractionLevel, $infraction) {
        $threadController = new ThreadCrudController($this->forumService, $this->validatorService);
        $threadSkeleton = new \stdClass();
        $infracted = UserHelper::getUserFromId($infraction->infractedId);
        $points = Infraction::isActive()
            ->where('infractedId', $infracted->userId)
            ->get()
            ->reduce(function ($prev, $curr) {
                return $prev + $curr->level()->value('points');
            }, 0);

        $threadSkeleton->content = "Hey [mention]@" . $infracted->nickname . "[/mention] 
Below you can find information regarding the infraction you were just given.
[i]Use this thead if you wanna appeal your infraction[/i]
        
[quote]
[b]Infraction Type:[/b] " . $infractionLevel->title . "
[b]Penalty in credits:[/b] " . $infractionLevel->penalty . " credits was taken
[b]Reason:[/b] " . $infraction->reason . "
            
[b]Current infraction points:[/b] " . $points . "
[/quote]";
        $threadSkeleton->title = $infracted->nickname . " received an infraction";
        $threadSkeleton->categoryId = $infractionLevel->categoryId;

        $botId = SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->botUserId);
        $bot = UserHelper::getUserFromId($botId);
        $threadController->doThread($bot, null, $threadSkeleton, null, true);
    }

    private function botAccountExists() {
        return UserHelper::getUserFromId(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->botUserId));
    }

    private function validateInfraction($infraction) {
        Condition::precondition(!isset($infraction->reason) || empty($infraction->reason), 400,
            'Reason needs to be set');

        Condition::precondition(!isset($infraction->infractionLevelId), 400, 'Infraction level needs to be set');
        Condition::precondition(InfractionLevel::where('infractionLevelId', $infraction->infractionLevelId)->count('infractionLevelId') == 0,
            404, 'Infraction level do not exist');

        Condition::precondition(!isset($infraction->userId) || empty($infraction->userId), 400,
            'No user to infract set');
        Condition::precondition(User::where('userId', $infraction->userId)->count('userId') == 0, 404,
            'User do not exist');
    }

    private function checkAutomaticBan($user, $userId) {
        $points = Infraction::isActive()
            ->where('infractedId', $userId)
            ->get()
            ->reduce(function ($prev, $curr) {
                return $prev + $curr->level()->value('points');
            }, 0);

        $autoBan = AutoBan::where('amount', '<=', $points)->orderBy('amount', 'DESC')->first();
        if ($autoBan && User::getImmunity($user->userId) > User::getImmunity($userId)) {
            $ban = new Ban([
                'bannedId' => $userId,
                'userId' => $user->userId,
                'reason' => $autoBan->reason,
                'expiresAt' => time() + $autoBan->banLength
            ]);
            $ban->save();
            Token::where('userId', $userId)->delete();
        }
    }
}
