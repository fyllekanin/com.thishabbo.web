<?php

namespace App\Http\Controllers\Arcade;

use App\EloquentModels\Game;
use App\EloquentModels\Paragraph;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class FastTyperController extends Controller {
    private $gameTypes = null;

    /**
     * FastTyperController constructor.
     * Fetch available game types and store in instance variable
     */
    public function __construct() {
        parent::__construct();
        $this->gameTypes = ConfigHelper::getGameTypesConfig();
    }

    /**
     * Get request to get the highscore for fastest typer
     *
     * @param bool $asJson
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFastTyperHighscoreTable($asJson = false) {
        $highScore = Game::orderBy('score', 'DESC')
            ->where('gameType', $this->gameTypes->fastTyper)
            ->where('isFinished', '>', 0)
            ->take(15)
            ->get();

        return $asJson ? response()->json($highScore) : $highScore;
    }

    /**
     * Get request to start a new game and get the paragraph
     * for the game.
     *
     * @param Request $request
     *
     * @param CreditsService $creditsService
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFastTyperParagraph(Request $request, CreditsService $creditsService) {
        $user = $request->get('auth');

        Condition::precondition(!$creditsService->haveEnoughCredits($user->userId, ConfigHelper::getCostSettings()->arcade), 400,
            'You need at least ' . ConfigHelper::getCostSettings()->arcade . ' credits to play');
        $creditsService->takeCredits($user->userId, ConfigHelper::getCostSettings()->arcade);

        $paragraph = Paragraph::inRandomOrder()->first();
        $game = new Game([
            'userId' => $user->userId,
            'gameType' => $this->gameTypes->fastTyper
        ]);
        $game->save();

        Logger::user($user->userId, $request->ip(), Action::STARTED_FASTEST_TYPE_GAME);
        return response()->json([
            'paragraph' => $paragraph->text,
            'gameId' => $game->gameId,
            'paragraphId' => $paragraph->paragraphId
        ]);
    }

    /**
     * Post request to create the score
     *
     * @param Request $request
     *
     * @param CreditsService $creditsService
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createFastTyperScore(Request $request, CreditsService $creditsService) {
        $user = $request->get('auth');
        $result = (object)$request->input('result');

        $paragraph = Paragraph::find($result->paragraphId);
        $game = Game::find($result->gameId);

        Condition::precondition(!$paragraph, 404, 'Paragraph do not exist');
        Condition::precondition(!$game, 404, 'Game do not exist');
        Condition::precondition($game->gameType != $this->gameTypes->fastTyper, 404, 'Game do not exist');
        Condition::precondition($game->userId != $user->userId, 400, 'Not your game');

        $olderThenFiveMinutes = $game->createdAt->timestamp + (60 * 5) < time();
        Condition::precondition($olderThenFiveMinutes, 400, 'The game is to old, restart');

        $game->score = $this->getWordsPerMinute($paragraph->text, $result->startTime, $result->endTime);
        $game->isFinished = true;
        $game->save();

        $this->checkWinnings($game, $user, $creditsService);
        Logger::user($user->userId, $request->ip(), Action::FINISHED_FASTEST_TYPE_GAME, ['score' => $game->score]);
        return response()->json([
            'score' => $game->score,
            'highscore' => $this->getFastTyperHighscoreTable()
        ]);
    }

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

    /**
     * Get method to calculate the words per minute the user had in the game
     *
     * @param $text
     * @param $startTime
     * @param $endTime
     *
     * @return float
     */
    private function getWordsPerMinute($text, $startTime, $endTime) {
        $time = $endTime - $startTime;
        $wordCount = count(explode(' ', $text));

        return ceil($wordCount / ($time / 60));
    }
}
