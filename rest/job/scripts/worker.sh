#!/bin/bash
while true
do
	php artisan queue:work --stop-when-empty
	sleep 5
done