#!/bin/bash

# Give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/trustworthy-module-registry

# Navigate into our working directory where we have all our github files
cd /home/ubuntu/trustworthy-module-registry

# Add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # Loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Loads nvm bash_completion (node is in path now)

# Install node modules
# NOTES: scripts in root package.json  --  "wininstall" works for windows, "ec2install" works for linux
npm run ec2install

# Runs start script which will build, move client for Nginx, and start the server
./run start >app.out.log 2>app.err.log </dev/null &
