<?php

namespace App\Http\Controllers\Sitecp\Betting;

use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\EloquentModels\User\UserBet;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;
use stdClass;

class BetsController extends Controller {
    private $creditsService;

    /**
     * BetsController constructor.
     *
     * @param CreditsService $creditsService
     */
    public function __construct(CreditsService $creditsService) {
        parent::__construct();
        $this->creditsService = $creditsService;
    }

    /**
     * @param Request $request
     * @param $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function suspendBet(Request $request, $betId) {
        $user = $request->get('auth');
        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The specific bet do not exist');
        Condition::precondition($bet->isSuspended, 400, 'The bet is already suspended');

        $bet->isSuspended = true;
        $bet->save();

        Logger::sitecp($user->userId, $request->ip(), Action::SUSPENDED_BET, [
            'bet' => $bet->name
        ], $bet->betId);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unsuspendBet(Request $request, $betId) {
        $user = $request->get('auth');
        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The specific bet do not exist');
        Condition::precondition(!$bet->isSuspended, 400, 'The bet is not suspended');

        $bet->isSuspended = false;
        $bet->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UNSUSPENDED_BET, [
            'bet' => $bet->name
        ], $bet->betId);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function setResult(Request $request, $betId) {
        $user = $request->get('auth');
        $result = $request->input('result');
        $bet = Bet::find($betId);

        Condition::precondition(!$bet, 404, 'The specific bet do not exist');
        Condition::precondition(!is_bool($result), 400, 'Result is not valid');

        $bet->isFinished = true;
        $bet->result = $result;
        $bet->save();

        if ($result) {
            $this->giveUserPrizes($bet->betId);
        }

        Logger::sitecp($user->userId, $request->ip(), Action::SET_BET_RESULT, [
            'bet' => $bet->name,
            'result' => $result
        ], $bet->betId);
        return response()->json($bet);
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBets(Request $request, $page) {
        $filter = $request->input('filter');
        $status = $request->input('status');

        $getBadgeSql = Bet::where('name', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('displayOrder', 'ASC');

        if ($status) {
            switch ($status) {
                case 'suspended':
                    $getBadgeSql->where('isSuspended', true);
                    break;
                case 'finished':
                    $getBadgeSql->where('isFinished', true);
                    break;
                case 'ongoing':
                    $getBadgeSql->where('isSuspended', false)->where('isFinished', false);
                    break;
            }
        }

        $total = DataHelper::getPage($getBadgeSql->count('betId'));
        $bets = $getBadgeSql->take($this->perPage)->skip(DataHelper::getOffset($page))->get();

        return response()->json([
            'bets' => $bets,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * @param $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBet($betId) {
        $bet = Bet::find($betId);

        return response()->json([
            'bet' => $bet ? $bet : new stdClass(),
            'categories' => BetCategory::all()
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBet(Request $request) {
        $user = $request->get('auth');
        $bet = (object)$request->input('bet');

        $this->betConditionCollection($bet);
        $newBet = new Bet([
            'name' => $bet->name,
            'leftSide' => $bet->leftSide,
            'rightSide' => $bet->rightSide,
            'betCategoryId' => $bet->betCategoryId,
            'displayOrder' => $bet->displayOrder
        ]);
        $newBet->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_BET, ['bet' => $bet->name], $bet->betId);
        return $this->getBet($newBet->betId);
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateBet(Request $request, $betId) {
        $user = $request->get('auth');
        $newBet = (object)$request->input('bet');

        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The bet does not exist!');

        $this->betConditionCollection($newBet);

        $bet->name = $newBet->name;
        $bet->leftSide = $newBet->leftSide;
        $bet->rightSide = $newBet->rightSide;
        $bet->betCategoryId = $newBet->betCategoryId;
        $bet->displayOrder = $newBet->displayOrder;
        $bet->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_BET, ['bet' => $bet->name], $bet->betId);;
        return $this->getBet($newBet->betId);
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBet(Request $request, $betId) {
        $user = $request->get('auth');

        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The bet does not exist!');

        $bet->isDeleted = true;
        $bet->save();

        $this->deleteUserBets($betId);

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_BET, ['bet' => $bet->name], $bet->betId);
        return response()->json();
    }

    /**
     * Gives back the credits the user betted when deleted
     *
     * @param $betId
     */
    private function deleteUserBets($betId) {
        $userBets = UserBet::where('betId', $betId)->get();

        foreach ($userBets as $userBet) {
            $this->creditsService->giveCredits($userBet->userId, $userBet->amount);
            $userBet->isDeleted = true;
            $userBet->save();
        }
    }

    /**
     * @param $bet
     */
    private function betConditionCollection($bet) {
        Condition::precondition(!$bet, 400, 'Stupid developer');
        Condition::precondition(!isset($bet->name) || empty($bet->name), 400, 'Name can not be empty');

        Condition::precondition(!isset($bet->leftSide) || !is_numeric($bet->leftSide), 400, 'Left hand side is not a number');
        Condition::precondition(!isset($bet->rightSide) || !is_numeric($bet->rightSide), 400, 'Right hand side is not a number');

        $bettingCategory = BetCategory::find($bet->betCategoryId);
        Condition::precondition(!$bettingCategory, 404, 'Betting category needs to be set');

        Condition::precondition(!isset($bet->displayOrder) || !is_numeric($bet->displayOrder), 400, 'Display order is not a number');

    }

    /**
     * @param $betId
     */
    private function giveUserPrizes($betId) {
        $bets = UserBet::where('betId', $betId)->get();

        foreach ($bets as $bet) {
            $rightSide = round($bet->amount / $bet->rightSide);
            $profit = $bet->leftSide * $rightSide;

            $this->creditsService->giveCredits($bet->userId, ($profit + $bet->amount));
        }
    }
}
