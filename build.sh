#!/bin/bash

cd front-end
npm install
npm run build:prod

cd ../rest
#Update super admins
sed -i -e 's/private static $superUsers = \[1\]/private static $superUsers = \[8050, 43325\]/g' app/Helpers/PermissionHelper.php

#Update bot token
sed -i -e "s/{token}/MjkyMDQxMjA1MTcxMDkzNTA0.XT9ARg.aZvZJ3arKi3UDx0mfma7HZ-W3GA/g" job/discord/logger.js

# Update project
composer update
composer dump-autoload
composer install --no-interaction --optimize-autoloader --no-dev
php artisan clear-compiled
php artisan optimize
php artisan config:cache
php artisan route:cache

cd ..
cp -r rest target

# Move front-end into public folder
mv ./front-end/dist/thvx/* ./target
cp ./front-end/.htaccess ./target/.htaccess

# Add script file to upload caches
echo "#!/bin/bash" >> ./target/update-caches.sh
echo "php artisan clear-compiled" >> ./target/update-caches.sh
echo "php artisan optimize" >> ./target/update-caches.sh
echo "php artisan config:cache" >> ./target/update-caches.sh
echo "php artisan route:cache" >> ./target/update-caches.sh
chmod +x ./target/update-caches.sh

# Add script file to set correct file permissions etc
echo "#!/bin/bash" >> ./target/update-file-permissions.sh
echo "find . -type f -exec chmod 644 {} \;" >> ./target/update-file-permissions.sh
echo "find . -type d -exec chmod 755 {} \;" >> ./target/update-file-permissions.sh

echo "chmod -R ug+rwx ./storage ./bootstrap/cache" >> ./target/update-file-permissions.sh
echo "chmod -R ug+rwx ./storage ./bootstrap/cache ./rest/resources" >> ./target/update-file-permissions.sh
chmod +x ./target/update-file-permissions.sh

