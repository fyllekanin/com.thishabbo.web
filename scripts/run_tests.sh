#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

# run Front-end tests
cd front-end
npm run test

# Hopefully they passed! let's run back-end
cd ./../rest
./vendor/bin/phpunit
