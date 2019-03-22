#!/bin/bash
if [[ -f build-prod.sh ]]; then
    cd ./..
fi

sudo find rest -type f -exec chmod 644 {} \;
sudo find rest -type d -exec chmod 755 {} \;
sudo chmod -R ug+rwx rest/storage rest/bootstrap/cache
