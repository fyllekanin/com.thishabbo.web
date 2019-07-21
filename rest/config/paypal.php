<?php
return [
    'client_id' => CONST_PAYPAL_CLIENT_ID,
    'secret' => CONST_PAYPAL_SECRET,
    'settings' => [
        'mode' => CONST_PAYPAL_MODE,
        'http.ConnectionTimeOut' => 1000,
        'log.LogEnabled' => true,
        'log.FileName' => storage_path() . '/logs/paypal.log',
        'log.LogLevel' => 'FINE'
    ],
];