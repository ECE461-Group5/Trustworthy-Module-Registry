# CS 450 Group 4 - Project Phase 1
This project implements a scalable and efficient system for evaluating open-source modules based on key metrics such as bus factor, correctness, ramp-up time, maintainer responsiveness, and license compatibility. The goal is to address concerns about open-source risks, including sparse documentation, low correctness standards, and the timely application of critical patches. The system is primarily written in TypeScript, employs the Command design pattern for modularity, and outputs results in NDJSON format for easy integration with the auto-grader.
## Getting Started
To get started with this project, follow the steps below to install dependencies, execute the program, and run the test suite.
### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (preferably version 20.17.0)
- npm (Node Package Manager)
- GitHub Token (for accessing the GitHub API)
### Installation
1. Clone the repository to your local machine:
```
git clone https://github.com/cs-450-project/se-phase1.git
```
2. Install the required dependencies using npm or the run bash file:
```
npm install OR ./run install
```
3. Add 📁`logs` folder in the root directory.
4. Add ⚙️`.env` file in the root directory:
```
// Example .env file
GITHUB_TOKEN = '<your GitHub personal access token>'
LOG_LEVEL = 1
LOG_FILE = ./logs/app.log
```
### Project File Structure
```
└── 📁se-phase1
    └── 📁dist
    └── 📁node_modules    
    └── 📁logs
        └── app.log
    └── 📁src
        └── 📁models
            └── 📁evaluators
                └── createScorecard.ts
                └── evaluateModule.ts
                └── readURLsFromFile.ts
            └── 📁metrics
                └── busfactorMetric.ts
                └── correctnessMetric.ts
                └── licenseMetric.ts
                └── maintainersMetric.ts
                └── metric.ts
                └── rampupMetric.ts
            └── 📁scores
                └── scorecard.ts
        └── index.ts
        └── logger.ts
    └── .env
    └── .gitignore
    └── .npmrc
    └── package-lock.json
    └── package.json
    └── README.md
    └── run
    └── sample-file.txt
    └── tsconfig.json
```
### Running the Program
To evaluate a list of open-source modules:
1. Prepare a file (e.g., `sample-file.txt` already in the project) containing the URLs of the repositories to be evaluated.
2. Execute the program with the following command:
``` 
./run <URL_FILE>
```
Example:
```
./run sample-file.txt
```
This will produce the output with the module scores in NDJSON format.
### Running Tests 
To ensure everything is functioning correctly, you can run the test suite using npm or the bash file:
```
npm run test OR ./run test
```
This output will include a summary of test results, showing the number of tests passed and the code coverage percentage.
### Logging
The program supports logging, which can be configured through environment variables:
- LOG_FILE: Specifies the location of the log file.
- LOG_LEVEL: Controls the verbosity of logs (0 = silent, 1 = informational, 2 = debug). By default, the log level is set to 0 (silent).

See example `.env` file above for possible configuration.