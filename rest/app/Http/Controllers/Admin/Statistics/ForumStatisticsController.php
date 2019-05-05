<?php

namespace App\Http\Controllers\Admin\Statistics;

use App\EloquentModels\Forum\Post;
use App\Http\Controllers\Controller;
use App\Utils\Condition;

class ForumStatisticsController extends Controller {

    /**
     * @param $year
     * @param $month
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function getPosts($year, $month) {
        Condition::precondition(!is_numeric($month), 400, 'Month needs to be a number!');
        Condition::precondition($month > 12 || $month < 1, 400, 'Not a correct month!');

        $days = $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) :
            (($month - 1) % 7 % 2 ? 30 : 31);

        $statistics = $this->getPostsStatistics($year, $month, $days);

        $earliestRecord = Post::orderBy('createdAt', 'ASC')->first(['createdAt']);
        $latestRecord = Post::orderBy('createdAt', 'DESC')->first(['createdAt']);

        return response()->json([
            'statistics' => $statistics,
            'earliestYear' => $earliestRecord ? date('Y', $earliestRecord->createdAt->timestamp) : $year,
            'latestYear' => $latestRecord ? date('Y', $latestRecord->createdAt->timestamp) : $year,
            'year' => $year,
            'month' => $month
        ]);
    }

    /**
     * @param $year
     * @param $month
     * @param $days
     *
     * @return array
     * @throws \Exception
     */
    private function getPostsStatistics($year, $month, $days) {
        $statistics = [];

        for ($i = 1; $i < $days; $i++) {
            $start = new \DateTime($year . '-' . $month . '-' . $i);
            $start->setTime(0, 0, 0);
            $end = new \DateTime($year . '-' . $month . '-' . $i);
            $end->setTime(23, 59, 59);

            $statistics[] = [
                'day' => $i,
                'month' => $month,
                'posts' => Post::where('createdAt', '>=', $start->getTimestamp())
                    ->where('createdAt', '<=', $end->getTimestamp())
                    ->count('postId')
            ];
        }
        return $statistics;
    }
}
