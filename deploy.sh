#!/bin/bash

yarn build
rsync -rav --delete ./dist/ "klampok:/home/pilkades/client"
