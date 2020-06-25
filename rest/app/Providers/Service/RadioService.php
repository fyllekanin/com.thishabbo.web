<?php

namespace App\Providers\Service;

use App\Models\Radio\RadioSettings;

interface RadioService {


    /**
     * Get the radio settings
     *
     * @return RadioSettings
     */
    public function getRadioSettings();

    /**
     * Update the radio settings
     *
     * @param  RadioSettings  $settings
     */
    public function updateRadioSettings(RadioSettings $settings);

    /**
     * Get slim radio settings
     * if $withAdmin is false the following values are null:
     * - adminPassword
     * - azuracastApiKey
     * - azuracastStationId
     *
     * @param  bool  $withAdmin
     *
     * @return mixed
     */
    public function getRadioConnection($withAdmin);

    /**
     * Get shoutcast version 1 stats
     *
     * @return mixed
     */
    public function getShoutCastV1Stats();

    /**
     * Get shoutcast version 2 stats
     *
     * @return mixed
     */
    public function getShoutCastV2Stats();

    /**
     * Get icecast version 2 stats
     *
     * @return mixed
     */
    public function getIceCastV2Stats();

    /**
     * Get a list of all the current radio listeners.
     * { hostname: ip, connecttime: seconds }
     *
     * @return array
     */
    public function getCurrentListeners();

    /**
     * Trigger start of the auto-dj on azurcast
     */
    public function startAzuracastAutoDj();

    /**
     * Trigger start of the auto-dj on azurcast
     */
    public function stopAzuracastAutoDj();

    /**
     * Kicks the current source on the radio
     *
     * @return int current dj id
     */
    public function kickCurrentDj();
}
