<?php

namespace App\Http\Controllers;

use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\EloquentModels\User\UserBet;
use App\Helpers\DataHelper;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class BettingController extends Controller {
    private $creditsService;

    /**
     * BettingController constructor.
     *
     * @param CreditsService $creditsService
     */
    public function __construct(CreditsService $creditsService) {
        parent::__construct();
        $this->creditsService = $creditsService;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoulette(Request $request) {
        $user = $request->get('auth');

        return response()->json([
            'stats' => $this->getStats($user)
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRoulette(Request $request) {
        $user = $request->get('auth');
        $color = $request->input('color');
        $amount = $request->input('amount');

        Condition::precondition(true, 400, 'Disabled for now');
        Condition::precondition(!is_numeric($amount), 400, 'Needs to be a number!');
        Condition::precondition($amount <= 0, 400, 'Needs to be a positive number!');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, $amount), 400, 'Not enough credits!');

        $minimumBet = floor($this->creditsService->getUserCredits($user->userId) / 10);
        Condition::precondition($amount < $minimumBet, 400, 'You need to bet at least ' . $minimumBet . ' THC');

        $numbers = [];
        for ($i = 0; $i < 400; $i++) {
            if ($i % 7 == 0) {
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

        shuffle($numbers);
        $boxNumber = rand(0, 550);
        $winner = $numbers[$boxNumber];
        $isWin = $color == $winner['color'];
        $profit = $color == 'green' ? $amount * 5 : $amount * 2;

        if ($isWin) {
            $this->creditsService->giveCredits($user->userId, $profit);
            Logger::user($user->userId, $request->ip(), Action::WON_ROULETTE, ['profit' => $profit]);
        } else {
            $this->creditsService->takeCredits($user->userId, $amount);
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
    public function createPlaceBet(Request $request, $betId) {
        $user = $request->get('auth');
        $amount = $request->input('amount');
        $bet = Bet::find($betId);

        Condition::precondition(!$bet, 404, 'The bet does not exist!');
        Condition::precondition(!is_numeric($amount), 400, 'Amount needs to be a number!');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, $amount), 400, 'You do not have enough credits!');
        Condition::precondition($bet->isSuspended, 400, 'The bet is currently suspended!');

        $userBet = new UserBet([
            'userId' => $user->userId,
            'betId' => $bet->betId,
            'leftSide' => $bet->leftSide,
            'rightSide' => $bet->rightSide,
            'amount' => $amount
        ]);
        $userBet->save();
        $this->creditsService->takeCredits($user->userId, $amount);

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
    public function getBettingStats(Request $request) {
        $user = $request->get('auth');

        return response()->json($this->getStats($user));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardPage(Request $request) {
        $user = $request->get('auth');

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
    public function getMyActiveBets(Request $request) {
        $user = $request->get('auth');

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
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistoryPage(Request $request, $page) {
        $user = $request->get('auth');

        $betsSql = UserBet::where('userId', $user->userId)
            ->take($this->perPage)
            ->skip(DataHelper::getOffset($page))
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->select('user_bets.*', 'bets.name', 'bets.isFinished', 'bets.result');

        $total = DataHelper::getPage($betsSql->count('userBetId'));
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
            'total' => $total
        ]);
    }

    /**
     * @param $amount
     * @param $leftSide
     * @param $rightSide
     *
     * @return float|int
     */
    private function getExpected($amount, $leftSide, $rightSide) {
        $rightSide = round($amount / $rightSide);
        $profit = $leftSide * $rightSide;

        return $profit + $amount;
    }

    /**
     * @param $user
     *
     * @return array
     */
    private function getStats($user) {
        $betsWon = UserBet::where('userId', $user->userId)
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->where('bets.result', 1)
            ->count('userBetId');

        $betsLost = UserBet::where('userId', $user->userId)
            ->leftJoin('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->where('bets.result', 0)
            ->count('userBetId');

        return [
            'credits' => $this->creditsService->getUserCredits($user->userId),
            'diamonds' => 0,
            'betsWon' => $betsWon,
            'betsLost' => $betsLost
        ];
    }

    /**
     * Get the top 5 active bets with most backers
     *
     * @return array
     */
    private function getTrendingBets() {
        $bets = Bet::where('isFinished', false)->getQuery()->get()->map(function ($bet) {
            $bet->backersCount = UserBet::where('betId', $bet->betId)->count('userBetId');
            return $bet;
        })->toArray();
        return array_slice($bets, 0, 5, true);
    }

    /**
     * Get all categories and their current active bets
     *
     * @return array
     */
    private function getActiveBets() {
        return BetCategory::orderBy('displayOrder')->get()->map(function ($category) {
            $category->append('activeBets');
            return $category;
        });
    }
}
