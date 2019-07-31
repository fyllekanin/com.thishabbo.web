<?php

namespace App\Http\Controllers\Sitecp\Statistics;

use App\EloquentModels\User\Login;
use App\Http\Controllers\Controller;
use App\Utils\Condition;
use DateTime;

class UserStatisticsController extends Controller {

    /**
     * @param $year
     * @param $month
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function getUsersLoggedIn($year, $month) {
        Condition::precondition(!is_numeric($month), 400, 'Month needs to be a number!');
        Condition::precondition($month > 12 || $month < 1, 400, 'Not a correct month!');

        $days = $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) :
            (($month - 1) % 7 % 2 ? 30 : 31);

        $statistics = $this->getUserStatistics($year, $month, $days);

        $earliestRecord = Login::orderBy('createdAt', 'ASC')->first();
        $latestRecord = Login::orderBy('createdAt', 'DESC')->first();

        return response()->json([
            'statistics' => $statistics,
            'earliestYear' => $earliestRecord ? date('Y', $earliestRecord->createdAt->timestamp) : $year,
            'latestYear' => $latestRecord ? date('Y', $latestRecord->createdAt->timestamp) : $year,
            'year' => $year,
            'month' => $month
        ]);
    }

    /**
     * Get the statistics for the year and month
     *
     * @param $year
     * @param $month
     * @param $days
     *
     * @return array
     * @throws \Exception
     */
    private function getUserStatistics($year, $month, $days) {
        $statistics = [];

        for ($i = 1; $i < $days; $i++) {
            $start = new DateTime($year . '-' . $month . '-' . $i);
            $start->setTime(0, 0, 0);
            $end = new DateTime($year . '-' . $month . '-' . $i);
            $end->setTime(23, 59, 59);

            $statistics[] = [
                'day' => $i,
                'month' => $month,
                'users' => Login::where('createdAt', '>=', $start->getTimestamp())
                    ->where('createdAt', '<=', $end->getTimestamp())
                    ->distinct('userId')
                    ->count('userId')
            ];
        }
        return $statistics;
    }
}
