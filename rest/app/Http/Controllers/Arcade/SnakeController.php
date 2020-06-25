<?php

namespace App\Http\Controllers\Arcade;

use App\Constants\GameTypes;
use App\Constants\LogType;
use App\Constants\Prices;
use App\EloquentModels\Game;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SnakeController extends Controller {

    /**
     * Get request to get the highscore table for snake
     *
     * @param  bool  $asJson
     *
     * @return JsonResponse
     */
    public function getSnakeHighscoreTable($asJson = false) {
        $highScore = Game::orderBy('score', 'DESC')
            ->where('gameType', GameTypes::SNAKE)
            ->where('isFinished', '>', 0)
            ->take(10)
            ->get();

        return $asJson ? response()->json($highScore) : $highScore;
    }

    /**
     * Get request to start a new game
     *
     * @param  Request  $request
     * @param  CreditsService  $creditsService
     *
     * @return JsonResponse
     */
    public function getSnakeGame(Request $request, CreditsService $creditsService) {
        $user = $request->get('auth');

        Condition::precondition(
            !$creditsService->haveEnoughCredits($user->userId, Prices::ARCADE_GAME), 400,
            'You need at least '.Prices::ARCADE_GAME.' credits to play'
        );
        $creditsService->takeCredits($user->userId, Prices::ARCADE_GAME);

        $game = new Game(
            [
                'userId' => $user->userId,
                'gameType' => GameTypes::SNAKE
            ]
        );
        $game->save();

        Logger::user($user->userId, $request->ip(), LogType::STARTED_SNAKE_GAME);
        return response()->json(['gameId' => $game->gameId]);
    }

    /**
     * Post request when game finished, saving the score
     *
     * @param  Request  $request
     *
     * @param  CreditsService  $creditsService
     *
     * @return JsonResponse
     */
    public function createSnakeScore(Request $request, CreditsService $creditsService) {
        $user = $request->get('auth');
        $result = (object) $request->input('result');
        $game = Game::find($result->gameId);

        Condition::precondition(!$game, 404, 'Game do not exist');
        Condition::precondition($game->gameType != GameTypes::SNAKE, 404, 'Game do not exist');
        Condition::precondition($game->userId != $user->userId, 400, 'Not your game');

        $game->score = $result->score;
        $game->isFinished = true;
        $game->save();

        $this->checkWinnings($game, $user, $creditsService);
        Logger::user($user->userId, $request->ip(), LogType::FINISHED_SNAKE_GAME, ['score' => $game->score]);
        return response()->json(
            [
                'score' => $game->score,
                'highscore' => $this->getSnakeHighscoreTable()
            ]
        );
    }

    /**
     * @param                                        $game
     * @param                                        $user
     * @param                                        $creditsService
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    private function checkWinnings($game, $user, $creditsService) {
        $highscores = Game::where('gameType', $game->gameType)->where('score', '>', $game->score)->count();
        switch ($highscores) {
            case 0:
                $creditsService->giveCredits($user->userId, 1000);
                break;
            case 1:
            case 2:
                $creditsService->giveCredits($user->userId, 700);
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                $creditsService->giveCredits($user->userId, 500);
                break;
        }
    }
}
