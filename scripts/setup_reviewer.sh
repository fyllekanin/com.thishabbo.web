#!/bin/bash
# Setup gerrit Commit-Id hoo

if [ -f install.sh ]; then
    cd ./..
fi

curl -Lo ./.git/hooks/commit-msg http://54.37.17.105:8080/tools/hooks/commit-msg