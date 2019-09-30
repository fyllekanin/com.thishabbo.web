#!/bin/bash
if [[ -f install.sh ]]; then
    cd ./..
fi

## Install back-end / Rest
cd rest
php -S localhost:8000 server.php