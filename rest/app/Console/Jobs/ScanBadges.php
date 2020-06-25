<?php

namespace App\Console\Jobs;

use App\EloquentModels\HabboBadge;
use App\Providers\Service\HabboService;

class ScanBadges {

    private $firstPattern = '/_badge_desc/';
    private $secondPattern = '/badge_desc_/';

    private $myHabboService;

    public function __construct(HabboService $habboService) {
        $this->myHabboService = $habboService;
    }

    public function init() {
        $items = $this->getItems();

        foreach ($items as $item) {
            $badge = $this->getBadge($item);
            if (!$badge || HabboBadge::where('habboBadgeId', $badge->habboBadgeId)->count() > 0) {
                continue;
            }

            HabboBadge::create(
                [
                    'habboBadgeId' => $badge->habboBadgeId,
                    'description' => $badge->description,
                ]
            );
        }
    }

    private function getBadge($item) {
        if (preg_match($this->firstPattern, $item)) {
            return $this->getFirstPatternBadge($item);
        } elseif (preg_match($this->secondPattern, $item)) {
            return $this->getSecondPatternBadge($item);
        }
        return null;
    }

    private function getFirstPatternBadge($item) {
        $parts = explode('_badge_desc=', $item);
        return (object) [
            'habboBadgeId' => $parts[0],
            'description' => $parts[1]
        ];
    }

    private function getSecondPatternBadge($item) {
        $parts = explode('=', $item);
        $habboBadgeId = str_replace('badge_desc_', '', $parts[0]);
        return (object) [
            'habboBadgeId' => $habboBadgeId,
            'description' => $parts[1]
        ];
    }

    private function getItems() {
        $data = $this->myHabboService->getHabboData('https://www.habbo.com/gamedata/external_flash_texts/1', false, false);
        return explode("\n", $data);
    }
}
