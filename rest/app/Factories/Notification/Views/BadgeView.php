<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Badge;

class BadgeView {

    public $badge;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->badge = $this->getBadge($notification);
    }

    private function getBadge($notification) {
        $badge = Badge::find($notification->contentId);
        return $badge == null ? null : (object) [
            'badgeId' => $badge->badgeId,
            'name' => $badge->name
        ];
    }
}
