# Backend
The backend of this application is build using an Express server and a PostgreSQL database. Prisma is used to make queries to the database.

## Tools used
- TypeScript: Main language
- Prisma: Database access
- Express: Server to serve API requests
- PostgreSQL: Database
- ESLint: Linter
- prettier: Formatter
- vitest: Testing library

## Setup
Although this application is hosted on an AWS EC2 instance, it is useful to be able to run the backend locally to test new features. To do this, follow
the steps below:

1. $ npm install - This ensures that all necessary dependencies are installed and up to date.
2. $ npx prisma generate - This initializes the Prisma schema.
3. $ mkdir logs;touch app.log - This creates the log file in the correct location.
4. $ Setup the .env file - This project relies on multiple environmental variables for its functionality. Here is an example .env file:  
    GITHUB_TOKEN=<github token>  
    LOG_LEVEL=1  
    LOG_FILE=./logs/app.log  
    BUILD_PATH=./src/frontend/frontend/build  
    DATABASE_URL=<database url>  

## Scripts
 Listed below are the npm scripts we have. 
To run the commands: $ npm run <script name>
1. build: Compiles the TypeScript code to JavaScript code.
2. start: Starts the Express server. Requests can now be made via the API.
3. dev: ?
4. db: Launches Prisma Studio. Gives a GUI to see what is contained within the database. Will launch a web browser.
5. test: Runs the entire test suite for the backend.
6. auto-grader-test: ?
7. lint: Runs the linter. Is set to fix any errors it can fix. It is recommended to configure your IDE to run the linter upon every save of a file.
8. format: Runs prettier. Ensures that the format of the code is correct.

## Usage
Once all setup steps have been followed, the backend can be run locally. The steps below outline how:
1. $ npm run build
2. $ npm run start
At this point, the backend is running. Requests can now be made through Curl or Postman.
See this [API documentation](https://documenter.getpostman.com/view/39313267/2sAY4sk5HD) to see the format of valid requests. 

## Folders
- prisma: Contains the configuration info for Prisma. The Prisma schema can be found here.
- src: All source code for the backend.

## Files
- eslint.config.js: ESLint linter setup.
- isomorphic.d.ts: ?
- logger.ts: Logger used throughout the backend to write to the log file.
- package.json: Scripts and dependencies.
- package-lock.json: dependencies.
- tsconfig.compile.json: Extends tsconfig.json. Used by the build script to avoid compilation of test files.
- tsconfig.json: TypeScript configuration.
- vitest.config.ts: Test suite configuration.







