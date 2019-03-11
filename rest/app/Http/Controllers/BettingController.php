<?php

namespace App\Http\Controllers;

use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\EloquentModels\User\UserBet;
use App\Helpers\UserHelper;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class BettingController extends Controller {

    public function getRoulette (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        return response()->json([
            'stats' => $this->getStats($user)
        ]);
    }

    public function createRoulette (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $color = $request->input('color');
        $amount = $request->input('amount');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        Condition::precondition(!is_numeric($amount), 400, 'Needs to be a number!');
        Condition::precondition($amount <= 0, 400, 'Needs to be a positive number!');
        Condition::precondition($userData->credits < $amount, 400, 'Not enough credits!');

        $numbers = [];
        for ($i = 0; $i < 500; $i++) {
            if ($i % 10 == 0) {
                $numbers[] = [
                    'number' => 0,
                    'color' => 'green'
                ];
            }
            $number = rand(1, 14);
            $rouletteNumber = [
                'number' => $number,
                'color' => $i % 2 == 0 ? 'black' : 'red'
            ];
            $numbers[] = $rouletteNumber;
        }

        $boxNumber = rand(0, 550);
        $winner = $numbers[$boxNumber];
        $isWin = $color == $winner['color'];
        $profit = $color == 'green' ? $amount * 5 : $amount * 2;

        if ($isWin) {
            $userData->credits += $profit;
            $userData->save();

            Logger::user($user->userId, $request->ip(), Action::WON_ROULETTE, ['profit' => $profit]);
        } else {
            $userData->credits -= $amount;
            $userData->save();
            Logger::user($user->userId, $request->ip(), Action::LOST_ROULETTE, ['amount' => $amount]);
        }

        return response()->json([
            'numbers' => $numbers,
            'isWin' => $isWin,
            'winner' => $winner,
            'profit' => $profit,
            'boxNumber' => $boxNumber,
        ]);
    }

    /**
     * @param Request $request
     * @param         $betId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPlaceBet (Request $request, $betId) {
        $user = UserHelper::getUserFromRequest($request);
        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $amount = $request->input('amount');
        $bet = Bet::find($betId);

        Condition::precondition(!$bet, 404, 'The bet does not exist!');
        Condition::precondition(!is_numeric($amount), 400, 'Amount needs to be a number!');
        Condition::precondition($amount > $userData->credits, 400, 'You do not have enough credits!');
        Condition::precondition($bet->isSuspended, 400, 'The bet is currently suspended!');

        $userBet = new UserBet([
            'userId' => $user->userId,
            'betId' => $bet->betId,
            'leftSide' => $bet->leftSide,
            'rightSide' => $bet->rightSide,
            'amount' => $amount
        ]);
        $userBet->save();
        $userData->credits -= $amount;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::PLACED_BET, [
            'bet' => $bet->name,
            'amount' => $amount
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardPage (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        return response()->json([
            'stats' => $this->getStats($user),
            'trendingBets' => $this->getTrendingBets(),
            'activeBets' => $this->getActiveBets()
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMyActiveBets (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        $bets = UserBet::where('userId', $user->userId)
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 0)
            ->select('user_bets.*', 'bets.name', 'bets.isFinished')
            ->get()->map(function ($bet) {
                return [
                    'name' => $bet->name,
                    'odds' => $bet->leftSide . '/' . $bet->rightSide,
                    'placed' => $bet->amount,
                    'expected' => $this->getExpected($bet->amount, $bet->leftSide, $bet->rightSide)
                ];
            });

        return response()->json([
            'stats' => $this->getStats($user),
            'bets' => $bets
        ]);
    }

    /**
     * @param Request $request
     *
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistoryPage (Request $request, $page) {
        $user = UserHelper::getUserFromRequest($request);

        $betsSql = UserBet::where('userId', $user->userId)
            ->take($this->perPage)
            ->skip($this->getOffset($page))
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->select('user_bets.*', 'bets.name', 'bets.isFinished', 'bets.result');

        $bets = $betsSql->orderBy('user_bets.userBetId', 'DESC')->get()->map(function ($bet) {
            return [
                'name' => $bet->name,
                'result' => $bet->result,
                'placed' => $bet->amount,
                'won' => $bet->result ? $this->getExpected($bet->amount, $bet->leftSide, $bet->rightSide) : 0
            ];
        });

        return response()->json([
            'stats' => $this->getStats($user),
            'history' => $bets,
            'page' => $page,
            'total' => ceil($betsSql->count() / $this->perPage)
        ]);
    }

    /**
     * @param $amount
     * @param $leftSide
     * @param $rightSide
     *
     * @return float|int
     */
    private function getExpected ($amount, $leftSide, $rightSide) {
        $rightSide = round($amount / $rightSide);
        $profit = $leftSide * $rightSide;

        return $profit + $amount;
    }

    /**
     * @param $user
     *
     * @return array
     */
    private function getStats ($user) {
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        $betsWon = UserBet::where('userId', $user->userId)
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->where('bets.result', 1)
            ->count();

        $betsLost = UserBet::where('userId', $user->userId)
            ->leftJoin('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->where('bets.result', 0)
            ->count();

        return [
            'credits' => $userData->credits,
            'diamonds' => 0,
            'betsWon' => $betsWon,
            'betsLost' => $betsLost
        ];
    }

    /**
     * Get the top 5 active bets with most backers
     * @return array
     */
    private function getTrendingBets () {
        $bets = Bet::where('isFinished', false)->where('isDeleted', 0)->getQuery()->get()->toArray();
        foreach ($bets as $bet) {
            $bet->backersCount = UserBet::where('betId', $bet->betId)->count();
        }
        return array_slice($bets, 0, 5, true);
    }

    /**
     * Get all categories and their current active bets
     * @return array
     */
    private function getActiveBets () {
        return BetCategory::orderBy('displayOrder')->get()->map(function ($category) {
            $category->append('activeBets');
            return $category;
        });
    }
}
