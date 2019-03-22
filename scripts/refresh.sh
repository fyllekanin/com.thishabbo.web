#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

## Refresh database
cd rest
php artisan migrate:fresh --seed