#!/bin/bash


while true
do
    php artisan queue:radio
    php artisan queue:work --stop-when-empty
    sleep 5
done