<?php

namespace App\Console;

use App\Console\Commands\ForceDeadlock;
use App\Console\Commands\RadioStats;
use App\EloquentModels\Log\RadioStatsLog;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Models\Radio\RadioSettings;
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

        $schedule->call(function () {
            $radio = new RadioSettings(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->radio));
            RadioStatsLog::create([
                'userId' => $radio->userId,
                'listeners' => $radio->listeners,
                'song' => $radio->song
            ]);
        })->everyFiveMinutes();

        $schedule->call('\App\Console\Jobs\ClearDJSays@init')->hourlyAt(01);
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