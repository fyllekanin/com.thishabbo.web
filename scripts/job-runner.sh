#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

# Kill the previous job runner
if [ pgrep job-runner.sh ]; then
    killall job-runner.sh
fi

if [ -f rest]; then
    cd rest
fi
while true
do
	php artisan queue:radio
	php artisan queue:work --stop-when-empty
	sleep 5
done