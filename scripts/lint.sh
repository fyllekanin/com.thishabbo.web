#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

## Lint PHP
cd rest
./vendor/bin/phpmd  . text rules/ruleset.xml --exclude vendor,database

## Lint FE
cd ..
cd front-end
npm run lint