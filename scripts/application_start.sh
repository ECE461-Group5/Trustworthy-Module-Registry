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
(cd ./backend && npm install) && (cd ./client && npm install) >app.out.log 2>app.err.log </dev/null

# Build FE & BE, generate Prisma schema
(cd ./client && npm run build) && (cd ./backend && npm run build && cd ./prisma && npx prisma generate) >app.out.log 2>app.err.log </dev/null

# Copy the "build" folder to "/var/www/html" for Nginx, reload Nginx
(sudo cp -R ./client/build /var/www/html/front-end/) && (sudo systemctl reload nginx) >app.out.log 2>app.err.log </dev/null &

# Start the server
(cd ./backend && npm run start) >app.out.log 2>app.err.log </dev/null &

# Runs start script which will build, move client for Nginx, and start the server
# ./run start >app.out.log 2>app.err.log </dev/null &

