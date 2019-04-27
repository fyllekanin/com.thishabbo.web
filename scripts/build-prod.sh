#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

rm -Rf ./target

# Build front-end and make production build
cd front-end
npm install
npm run build:prod

# Create target folder
cd ./../rest
composer install --no-interaction --optimize-autoloader --no-dev
php artisan clear-compiled
php artisan optimize
php artisan config:cache
php artisan route:cache
cd ./..
cp -r rest target

# Move front-end into public folder
mv ./front-end/dist/thvx/* ./target/public
cp ./front-end/.htaccess ./target/public/.htaccess
cp ./scripts/job-runner.sh ./target/job-runner.sh

