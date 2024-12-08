#  Author(s): Joe Dahms
#  Purpose: This script is used to stop the server on the EC2 for Trustworthy Module Registry application.

#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
# shellcheck source=/dev/null
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