#!/bin/bash
if [ -f setup_reviewer.sh ]; then
    cd ./..
fi

## Refresh database
cd rest
php artisan migrate:fresh --seed