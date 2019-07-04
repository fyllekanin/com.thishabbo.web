<?php

namespace App\Console;

use App\Console\Commands\ForceDeadlock;
use App\Console\Commands\RadioStats;
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
     * @param  \Illuminate\Console\Scheduling\Schedule $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule) {
        $schedule->call('\App\Console\Jobs\ClearSubscriptions@init')->twiceDaily();

        $schedule->call('\App\Console\Jobs\ScanBadges@init')->twiceDaily();

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands() {
        $this->load(__DIR__ . '/Commands');
    }
}