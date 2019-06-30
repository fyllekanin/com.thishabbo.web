<?php

namespace App\Console\Jobs;

use App\EloquentModels\HabboBadge;
use App\Services\HabboService;

class ScanBadges {
    private $firstPattern = '/_badge_desc/';
    private $secondPattern = '/badge_desc_/';

    private $habboService;

    public function __construct(HabboService $habboService) {
        $this->habboService = $habboService;
    }

    public function __invoke() {
        $items = $this->getItems();
        $addedIds = HabboBadge::pluck('habboBadgeId');

        $inserts = [];
        foreach ($items as $item) {
            $badge = $this->getBadge($item);
            if (!$badge || in_array($badge->id, $addedIds)) {
                continue;
            }

            $inserts[] = [
                'habboBadeId' => $badge->id,
                'description' => $badge->description
            ];
        }

        if (count($inserts) > 0) {
            HabboBadge::insert($inserts);
        }
    }

    private function getBadge($item) {
        if (preg_match($this->firstPattern, $item)) {
            return $this->getFirstPatternBadge($item);
        } else if (preg_match($this->secondPattern, $item)) {
            return $this->getSecondPatternBadge($item);
        }
        return null;
    }

    private function getFirstPatternBadge($item) {
        $parts = explode('_badge_desc=', $item);
        return (object)[
            'id' => $parts[0],
            'description' => $parts[1]
        ];
    }

    private function getSecondPatternBadge($item) {
        $parts = explode('=', $item);
        $id = str_replace('badge_desc_', '', $parts[0]);
        return (object)[
            'id' => $id,
            'description' => $parts[1]
        ];
    }

    private function getItems() {
        $curl = $this->habboService->getHabboData('https://www.habbo.com/gamedata/external_flash_texts/1');
        return explode('\n', $curl);
    }
}