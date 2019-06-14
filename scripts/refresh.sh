#!/bin/bash
if [[ -f install.sh ]]; then
    cd ./..
fi

## Refresh database
cd rest
php artisan migrate:fresh --seed