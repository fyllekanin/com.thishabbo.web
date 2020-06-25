<?php

namespace App\Constants;

class CommonRegex {

    const HABBO_ROOM_LINK
        = '/(http(s)?:\/\/)?(www.)?habbo\.com\/(hotel\?)?room(=|\/)([0-9]+|(http(s)?:\/\/)?(www.)?habbo\.com\/hotel\?room=[0-9]+)?/si';
}
