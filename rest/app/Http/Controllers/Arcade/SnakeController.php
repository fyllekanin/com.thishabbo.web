<?php

namespace App\Http\Controllers\Arcade;

use App\EloquentModels\Game;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class SnakeController extends Controller {
    private $gameTypes = null;

    /**
     * SnakeController constructor.
     * Fetch the available game types and store in instance variable
     */
    public function __construct() {
        parent::__construct();
        $this->gameTypes = ConfigHelper::getGameTypesConfig();
    }

    /**
     * Get request to get the highscore table for snake
     *
     * @param bool $asJson
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSnakeHighscoreTable($asJson = false) {
        $highScore = Game::orderBy('score', 'DESC')
            ->where('gameType', $this->gameTypes->snake)
            ->where('isFinished', '>', 0)
            ->take(15)
            ->get();

        return $asJson ? response()->json($highScore) : $highScore;
    }

    /**
     * Get request to start a new game
     *
     * @param Request $request
     * @param CreditsService $creditsService
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSnakeGame(Request $request, CreditsService $creditsService) {
        $user = $request->get('auth');

        Condition::precondition(!$creditsService->haveEnoughCredits($user->userId, ConfigHelper::getCostSettings()->arcade), 400,
            'You need at least ' . ConfigHelper::getCostSettings()->arcade . ' credits to play');

        $game = new Game([
            'userId' => $user->userId,
            'gameType' => $this->gameTypes->snake
        ]);
        $game->save();

        Logger::user($user->userId, $request->ip(), Action::STARTED_SNAKE_GAME);
        return response()->json(['gameId' => $game->gameId]);
    }

    /**
     * Post request when game finished, saving the score
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSnakeScore(Request $request) {
        $user = $request->get('auth');
        $result = (object)$request->input('result');
        $game = Game::find($result->gameId);

        Condition::precondition(!$game, 404, 'Game do not exist');
        Condition::precondition($game->gameType != $this->gameTypes->snake, 404, 'Game do not exist');
        Condition::precondition($game->userId != $user->userId, 400, 'Not your game');

        $game->score = $result->score;
        $game->isFinished = true;
        $game->save();

        Logger::user($user->userId, $request->ip(), Action::FINISHED_SNAKE_GAME, ['score' => $game->score]);
        return response()->json([
            'score' => $game->score,
            'highscore' => $this->getSnakeHighscoreTable()
        ]);
    }
}
