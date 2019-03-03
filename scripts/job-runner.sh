#!/bin/bash
if [ -f setup_reviewer.sh ]; then
    cd ./..
fi

cd rest
while true
do
	php artisan queue:radio
	php artisan queue:work --stop-when-empty
	sleep 5
done