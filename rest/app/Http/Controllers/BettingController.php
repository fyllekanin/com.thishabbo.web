<?php

namespace App\Http\Controllers;

use App\Constants\LogType;
use App\EloquentModels\Bet;
use App\EloquentModels\BetCategory;
use App\EloquentModels\User\UserBet;
use App\Logger;
use App\Providers\Service\CreditsService;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BettingController extends Controller {
    private $myCreditsService;

    public function __construct(CreditsService $creditsService) {
        parent::__construct();
        $this->myCreditsService = $creditsService;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getRoulette(Request $request) {
        $user = $request->get('auth');

        return response()->json(
            [
                'stats' => $this->getStats($user)
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createRoulette(Request $request) {
        $user = $request->get('auth');
        $color = $request->input('color');
        $amount = $request->input('amount');

        Condition::precondition(!is_numeric($amount), 400, 'Needs to be a number!');
        Condition::precondition($amount <= 0, 400, 'Needs to be a positive number!');
        Condition::precondition(!$this->myCreditsService->haveEnoughCredits($user->userId, $amount), 400, 'Not enough credits!');

        Condition::precondition($amount > 2500, 400, 'You can maximum bet 2,500 THC');

        $numbers = $this->getRouletteNumbers();
        $boxNumber = rand(0, 467);
        $winner = $numbers[$boxNumber];
        $isWin = $color == $winner['color'];
        $profit = $color == 'green' ? $amount * 3 : $amount;

        if ($isWin) {
            $this->myCreditsService->giveCredits($user->userId, $profit);
            Logger::user($user->userId, $request->ip(), LogType::WON_ROULETTE, ['profit' => $profit]);
        } else {
            $this->myCreditsService->takeCredits($user->userId, $amount);
            Logger::user($user->userId, $request->ip(), LogType::LOST_ROULETTE, ['amount' => $amount]);
        }

        return response()->json(
            [
                'numbers' => $numbers,
                'isWin' => $isWin,
                'winner' => $winner,
                'profit' => $profit,
                'boxNumber' => $boxNumber,
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $betId
     *
     * @return JsonResponse
     */
    public function createPlaceBet(Request $request, $betId) {
        $user = $request->get('auth');
        $amount = $request->input('amount');
        $bet = Bet::find($betId);

        Condition::precondition(!is_numeric($amount), 400, 'Amount needs to be a number!');
        Condition::precondition(
            !$this->myCreditsService->haveEnoughCredits($user->userId, $amount),
            400,
            'You do not have enough credits!'
        );
        Condition::precondition($bet->isSuspended, 400, 'The bet is currently suspended!');

        $userBet = new UserBet(
            [
                'userId' => $user->userId,
                'betId' => $bet->betId,
                'leftSide' => $bet->leftSide,
                'rightSide' => $bet->rightSide,
                'amount' => $amount
            ]
        );
        $userBet->save();
        $this->myCreditsService->takeCredits($user->userId, $amount);

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::PLACED_BET,
            [
                'bet' => $bet,
                'userBet' => $userBet
            ],
            $bet->betId
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getBettingStats(Request $request) {
        $user = $request->get('auth');

        return response()->json($this->getStats($user));
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getDashboardPage(Request $request) {
        $user = $request->get('auth');

        return response()->json(
            [
                'stats' => $this->getStats($user),
                'trendingBets' => $this->getTrendingBets(),
                'activeBets' => $this->getActiveBets()
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getMyActiveBets(Request $request) {
        $user = $request->get('auth');

        $bets = UserBet::where('userId', $user->userId)
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 0)
            ->select('user_bets.*', 'bets.name', 'bets.isFinished')
            ->get()->map(
                function ($bet) {
                    return [
                        'name' => $bet->name,
                        'odds' => $bet->leftSide.'/'.$bet->rightSide,
                        'placed' => $bet->amount,
                        'expected' => $this->getExpected($bet->amount, $bet->leftSide, $bet->rightSide)
                    ];
                }
            );

        return response()->json(
            [
                'stats' => $this->getStats($user),
                'bets' => $bets
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getHistoryPage(Request $request, $page) {
        $user = $request->get('auth');

        $betsSql = UserBet::where('userId', $user->userId)
            ->take($this->perPage)
            ->skip(PaginationUtil::getOffset($page))
            ->join('bets', 'bets.betId', '=', 'user_bets.betId')
            ->where('bets.isFinished', 1)
            ->select('user_bets.*', 'bets.name', 'bets.isFinished', 'bets.result');

        $total = PaginationUtil::getTotalPages($betsSql->count('userBetId'));
        $bets = $betsSql->orderBy('user_bets.userBetId', 'DESC')->get()->map(
            function ($bet) {
                return [
                    'name' => $bet->name,
                    'result' => $bet->result,
                    'placed' => $bet->amount,
                    'won' => $bet->result ? $this->getExpected($bet->amount, $bet->leftSide, $bet->rightSide) : 0
                ];
            }
        );

        return response()->json(
            [
                'stats' => $this->getStats($user),
                'history' => $bets,
                'page' => $page,
                'total' => $total
            ]
        );
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
            'credits' => $this->myCreditsService->getUserCredits($user->userId),
            'activeBets' => Bet::where('isFinished', 0)->count('betId'),
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
        $bets = Bet::where('isFinished', false)->where('isDeleted', '<', 1)->getQuery()->get()->map(
            function ($bet) {
                $bet->backersCount = UserBet::where('betId', $bet->betId)->count('userBetId');
                return $bet;
            }
        )->toArray();
        return array_slice($bets, 0, 5, true);
    }

    /**
     * Get all categories and their current active bets
     *
     * @return array
     */
    private function getActiveBets() {
        return BetCategory::orderBy('displayOrder')->get()->map(
            function ($category) {
                $category->append('activeBets');
                return $category;
            }
        );
    }

    private function getRouletteNumbers() {
        $numbers = [];
        for ($i = 0; $i < 400; $i++) {
            if ($i % 6 == 0) {
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
        return $numbers;
    }
}
