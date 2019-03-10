<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Infraction\Infraction;

class InfractionView {
    public $infraction;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->infraction = $this->getInfraction($notification);
    }

    private function getInfraction($notification) {
        $infraction = Infraction::where('infractionId', $notification->contentId)
            ->withoutGlobalScope('nonHardDeleted')->first();
        return $infraction == null ? null : (object) [
            'infractionId' => $infraction->infractionId,
            'title' => $infraction->level->title
        ];
    }
}