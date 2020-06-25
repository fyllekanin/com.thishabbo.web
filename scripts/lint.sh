#!/bin/bash
if [[ -f install.sh ]]; then
    cd ./..
fi

## Lint PHP
cd rest
./vendor/bin/phpcs ./app --standard=rules/ruleset.xml

## Lint FE
cd ..
cd front-end
npm run lint
