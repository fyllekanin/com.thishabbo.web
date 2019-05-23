<?php

namespace App\Console;

use Illuminate\Console\Command;
use App\Console\Radio\RadioStats;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Artisan;

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
    protected function schedule (Schedule $schedule) {
        $schedule->call(new ClearSubscriptions)->twiceDaily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands () {
        $this->load(__DIR__ . '/Commands');
    }
}

class RadioWorker extends Command {
    protected $signature = 'queue:radio';

    public function handle()
    {
        $radioStats = new RadioStats();
        $radioStats->init();
    }
}

class ClearSubscriptions {

    public function __invoke()
    {
        $time = time();
        Subscription::active()->where('expiresAt', '<', $time)->delete();
    }
}