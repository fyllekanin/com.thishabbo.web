<?php
return [
    'client_id' => PAYPAL_CLIENT_ID,
    'secret' => PAYPAL_SECRET,
    'settings' => [
        'mode' => PAYPAL_MODE,
        'http.ConnectionTimeOut' => 1000,
        'log.LogEnabled' => true,
        'log.FileName' => storage_path() . '/logs/paypal.log',
        'log.LogLevel' => 'FINE'
    ],
];