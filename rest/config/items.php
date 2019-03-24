<?php

$itemTypes = new \stdClass();
$itemTypes->badge = 1;
$itemTypes->nameIcon = 2;
$itemTypes->nameEffect = 3;

$rarities = new \stdClass();
$rarities->common = 80;
$rarities->rare = 50;
$rarities->epic = 30;
$rarities->legendary = 10;

return [
    'TYPES' => $itemTypes,
    'RARITIES' => $rarities
];
