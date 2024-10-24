#!/bin/bash

# Download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# Create working directory if it doesn't exist
DIR="/home/ubuntu/trustworthy-module-registry"
if [ -d "$DIR" ]; then

else
  mkdir ${DIR}
fi
