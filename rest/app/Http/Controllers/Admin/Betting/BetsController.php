<?php

namespace App\Http\Controllers\Admin\Betting;

use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\EloquentModels\User\UserBet;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class BetsController extends Controller {

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function setResult (Request $request, $betId) {
        $user = UserHelper::getUserFromRequest($request);
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

        Logger::admin($user->userId, $request->ip(), Action::SET_BET_RESULT, [
            'bet' => $bet->name,
            'result' => $result
        ]);
        return response()->json($bet);
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBets (Request $request, $page) {
        $filter = $request->input('filter');

        $getBadgeSql = Bet::where('name', 'LIKE', '%' . $filter . '%')
            ->orderBy('leftSide', 'ASC')->orderBy('rightSide', 'DESC');

        $bets = $getBadgeSql->take($this->perPage)->skip($this->getOffset($page))->get();

        return response()->json([
            'bets' => $bets,
            'page' => $page,
            'total' => ceil($getBadgeSql->count() / $this->perPage)
        ]);
    }

    /**
     * @param $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBet ($betId) {
        $bet = Bet::find($betId);

        return response()->json([
            'bet' => $bet ? $bet : new \stdClass(),
            'categories' => BetCategory::all()
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBet (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $bet = (object)$request->input('bet');

        $this->betConditionCollection($bet);

        $newBet = new Bet([
            'name' => $bet->name,
            'leftSide' => $bet->leftSide,
            'rightSide' => $bet->rightSide,
            'betCategoryId' => $bet->betCategoryId
        ]);
        $newBet->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_BET, ['bet' => $bet->name]);
        return $this->getBet($newBet->betId);
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateBet (Request $request, $betId) {
        $user = UserHelper::getUserFromRequest($request);
        $newBet = (object)$request->input('bet');

        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The bet do not exist');

        $this->betConditionCollection($newBet);

        $bet->name = $newBet->name;
        $bet->leftSide = $newBet->leftSide;
        $bet->rigthSide = $newBet->rightSide;
        $bet->betCategoryId = $newBet->betCategoryId;
        $bet->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_BET, ['bet' => $bet->name]);;
        return $this->getBet($newBet->betId);
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBet (Request $request, $betId) {
        $user = UserHelper::getUserFromRequest($request);

        $bet = Bet::find($betId);
        Condition::precondition(!$bet, 404, 'The bet do not exist');

        $bet->isDeleted = true;
        $bet->save();

        $this->deleteUserBets($betId);

        Logger::admin($user->userId, $request->ip(), Action::DELETED_BET, ['bet' => $bet->name]);
        return response()->json();
    }

    /**
     * Gives back the credits the user betted when deleted
     *
     * @param $betId
     */
    private function deleteUserBets ($betId) {
        $userBets = UserBet::where('betId', $betId)->get();

        foreach ($userBets as $userBet) {
            $userData = UserHelper::getUserDataOrCreate($userBet->userId);
            $userData->credits += $userBet->amount;
            $userData->save();

            $userBet->isDeleted = true;
            $userBet->save();
        }
    }

    /**
     * @param $bet
     */
    private function betConditionCollection ($bet) {
        Condition::precondition(!$bet, 400, 'Stupid developer');
        Condition::precondition(!isset($bet->name) || empty($bet->name), 400, 'Name can not be empty');

        Condition::precondition(!isset($bet->leftSide) || !is_numeric($bet->leftSide), 400, 'Left hand side is not a number');
        Condition::precondition(!isset($bet->rightSide) || !is_numeric($bet->rightSide), 400, 'Right hand side is not a number');

        $bettingCategory = BetCategory::find($bet->betCategoryId);
        Condition::precondition(!$bettingCategory, 404, 'Betting category needs to be set');
    }

    /**
     * @param $betId
     */
    private function giveUserPrizes ($betId) {
        $bets = UserBet::where('betId', $betId)->get();

        foreach ($bets as $bet) {
            $rightSide = round($bet->amount / $bet->rightSide);
            $profit = $bet->leftSide * $rightSide;

            $userData = UserHelper::getUserDataOrCreate($bet->userId);
            $userData->credits += ($profit + $bet->amount);
            $userData->save();
        }
    }
}
