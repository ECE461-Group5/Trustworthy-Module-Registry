#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

#create our working directory if it doesnt exist
DIR="/home/ubuntu/trustworthy-module-registry"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi

# Check if the file exists and remove it
FILE="${DIR}/run"
if [ -f "$FILE" ]; then
  echo "Removing existing file ${FILE}"
  rm -f ${FILE}
fi