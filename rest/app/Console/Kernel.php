<?php

namespace App\Console;

use App\Console\Commands\RadioStats;
use App\EloquentModels\Log\ThcStatsLog;
use App\EloquentModels\User\UserData;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel {

    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        RadioStats::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  Schedule  $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule) {
        $schedule->call('\App\Console\Jobs\ClearSubscriptions@init')->twiceDaily();
        $schedule->call('\App\Console\Jobs\ScanBadges@init')->twiceDaily();
        $schedule->call('\App\Console\Jobs\ClearTimetable@init')->dailyAt('07:00');
        $schedule->call('\App\Console\Jobs\UpdateRotatedShopItems@init')->dailyAt('00:00');

        $schedule->call(
            function () {
                ThcStatsLog::create(
                    [
                        'credits' => UserData::where('credits', '>', 0)->sum('credits')
                    ]
                );
            }
        )->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands() {
        $this->load(__DIR__.'/Commands');
    }
}
