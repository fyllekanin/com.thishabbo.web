#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

## Install back-end / Rest
cd rest
composer install

# Add migration & seeding later

## Install front-end
cd ../front-end
npm install
npm install -g @angular/cli