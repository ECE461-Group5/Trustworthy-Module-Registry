# Frontend
The Frontend of this application is built using React paired with Vite. 

## Tools used
- TypeScript: Main language
- React: Webpage Deployment
- Vite: Webpage Development 
- prettier: Formatter
- Selenium: Testing Tool

## Setup
The Frontend is hosted locally to test new features. To do this, follow
the steps below:

1. This ensures that all necessary dependencies are installed and up to date.
2. This builds the application to ensure there are no errors within the code
3. This deploys the React/Vite App to localhost:3001
Note: To run locally, after build, place a copy of the "build" directory to the backend folder.
      Move (a copy of) the "build" folder to the backend to use server proxy.
      Then (cd ../backend && npm install && npm run build && npm start

```plaintext
$ npm install
$ npm run build
$ npm run dev
```


## Scripts
Listed below are the npm scripts we have. 
To run the commands: $ npm run <script name>
1. build: Compiles the TypeScript code to JavaScript code and Builds Vite.
2. dev: Deploys the React/Vite Webpage on localhost:3001
3. preview: vite preview
4. test: Runs the main test suite for web scraping the frontend.
5. auto-grader-test: ?
6. lint: Runs the linter. Is set to fix any errors it can fix. It is recommended to configure your IDE to run the linter upon every save of a file.
7. format: Runs prettier. Ensures that the format of the code is correct.

## Usage
Once all setup steps have been followed, the frontend can be run locally. The steps below outline how:
1. $ npm run build
2. $ npm run dev
At this point, the frontend is running locally.

## Folders
- build: Contains all necessities after running npm run build
- public: Contains images used within the webpage
- src: All source code for the frontend.
- components: Contains classes for formatting and objects within the Webpage.
- tests: Contains both Unit tests for each webpage tab, plus the complete web scrape for the entire webpage. 

## Files
- eslint.config.js: ESLint linter setup.
- package.json: Scripts and dependencies.
- package-lock.json: dependencies.
- tsconfig.compile.json: Extends tsconfig.json. Used by the build script to avoid compilation of test files.
- tsconfig.json: TypeScript configuration.
- vite.config.ts: Vite configuration.








