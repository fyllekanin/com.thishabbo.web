<?php

namespace App\Console;

use App\Console\Radio\RadioStats;
use App\EloquentModels\Shop\UserSubscription;
use App\Helpers\ConfigHelper;
use App\Jobs\UserUpdated;
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
        $schedule->call(new ClearSubscriptions)->twiceDaily();
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

class ClearSubscriptions {

    public function __invoke() {
        $time = time();
        $userSubSql = UserSubscription::where('expiresAt', '<', $time);

        $userIds = $userSubSql->pluck('userId');
        $userSubSql->delete();

        $clearSubType = ConfigHelper::getUserUpdateTypes()->CLEAR_SUBSCRIPTION;
        foreach ($userIds as $userId) {
            UserUpdated::dispatch($userId, $clearSubType);
        }
    }
}
