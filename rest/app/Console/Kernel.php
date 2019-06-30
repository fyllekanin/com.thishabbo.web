<?php

namespace App\Console;

use App\Console\Commands\RadioStats;
use App\Console\Jobs\ClearSubscriptions;
use App\Console\Jobs\ScanBadges;
use App\Services\HabboService;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel {
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        RadioWorker::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule) {
        $schedule->call(new ClearSubscriptions())->twiceDaily();

        $schedule->call(new ScanBadges(new HabboService()))->daily();

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

class RadioWorker extends Command {
    protected $signature = 'queue:radio';

    public function handle() {
        $radioStats = new RadioStats();
        $radioStats->init();
    }
}
