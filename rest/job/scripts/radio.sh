#!/bin/bash
while true
do
	php artisan queue:radio
	sleep 5
done