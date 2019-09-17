#!/bin/bash
if [[ -f install.sh ]]; then
    cd ./..
fi

# Start back-end
cd rest
php -S localhost:8000 server.php > phpd.log 2>&1 &
PHP_SERVER_PID=$!


# Start front-end
cd ../front-end
npm start > angulard.log 2>&1 &
ANGULAR_PID=$!

# Wait for front-end
tail -f angulard.log | while read LOGLINE
do
   [[ "${LOGLINE}" == *"Angular Live Development Server is listening"* ]] && pkill -P $$ tail
done

# Run protractor
npm run e2e

# Kill front-end and back-end
kill -3 $PHP_SERVER_PID
kill -3 $ANGULAR_PID