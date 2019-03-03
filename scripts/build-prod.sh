#!/bin/bash
if [ -f setup_reviewer.sh ]; then
    cd ./..
fi

rm -Rf ./target

# Build front-end and make production build
cd front-end
npm install
npm run build:prod

# Create target folder
cd ./../rest
composer install --optimize-autoloader --no-dev
cd ./..
cp -r rest target

# Move front-end into public folder
mv ./front-end/dist/thvx/* ./target/public
cp ./front-end/.htaccess ./target/public/.htaccess
cp ./scripts/job-runner.sh ./target/job-runner.sh

# Optimize back-end
cd target
php artisan route:cache

