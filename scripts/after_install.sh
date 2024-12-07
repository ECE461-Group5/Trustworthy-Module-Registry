#  Author(s): Joe Dahms
#  Purpose: This script is used to create the .env file for the backend of the
#  Trustworthy Module Registry. It uses the AWS CLI to get the necessary parameters 
#  from AWS Systems Manager Parameter Store and writes them to the .env file.
#  It also creates a log file for the backend.

#!/bin/bash

ENV_PATH=/home/ubuntu/trustworthy-module-registry/backend/.env

# Ensure .env file exists and is empty
touch $ENV_PATH
> $ENV_PATH

# Create log file
touch /home/ubuntu/trustworthy-module-registry/backend/logs/app.log

# Fill out env file
echo BUILD_PATH=$(aws ssm get-parameters --output text --region us-east-1 --name BUILD_PATH --with-decryption --query Parameters[0].Value) >> $ENV_PATH
echo DATABASE_URL=$(aws ssm get-parameters --output text --region us-east-1 --name DATABASE_URL --with-decryption --query Parameters[0].Value) >> $ENV_PATH
echo LOG_LEVEL=$(aws ssm get-parameters --output text --region us-east-1 --name LOG_LEVEL --with-decryption --query Parameters[0].Value) >> $ENV_PATH
echo LOG_FILE=$(aws ssm get-parameters --output text --region us-east-1 --name LOG_FILE --with-decryption --query Parameters[0].Value) >> $ENV_PATH
echo GITHUB_TOKEN=$(aws ssm get-parameters --output text --region us-east-1 --name GITHUB_TOKEN --with-decryption --query Parameters[0].Value) >> $ENV_PATH
