# Trustworthy Module Registry
# Group 5

## Members
- Derek Petersen
- Djamel Almabouada
- Geromy Cunningham
- Joe Dahms
- Jonah Salyers
- Juan Cortes
- Logan Pelkey

## Project Description
This project is a monorepo. It consists of two subcomponents, a frontend and a backend. The frontend is located in the client directory. The
backend is located in the backend directory. Both components are standalone and combine to make the complete app.


## To Run Locally
```plaintext
(cd ./backend && npm install) && (cd ./client && npm install)
```
```plaintext
(cd ./client && npm run build) && (cd ./backend && npm run build && cd ./prisma && npx prisma generate)
```
```plaintext
(cd backend && mkdir logs && touch app.log)
```
```plaintext
(cd ./backend && npm run start)
```
Open a new console
```plaintext
(cd ./backend && npm prisma studio)
```
Open browser to:
```plaintext
http://localhost:3000
```
## AWS
Our app is currently being hosted on AWS.

### Roles
AWS IAM is utilized to ensure that all group members can work with our AWS setup without having too permissive of privilidges.

### EC2
The app is currently running on an AWS EC2 instance. The instance is running Ubuntu 24.01.1 LTS. Deployments are handled through AWS CodePipeline. 
The main way we are connecting to our EC2 instance is through the use of the AWS EC2 instance connect feature in the AWS management console. The EC2 is not currently using an elastic (static) IP address.
Since the instance is running 24/7, we decided it not necessary to pay for an elastic IP.

### RDS
Our database is hosted on RDS. It is a PostgreSQL database.

## CI/CD (Continuous Integration / Continuous Deployment)

### Continuous Integration
Our CI is implemented with GitHub actions. We have two workflows that trigger on every push to any branch.

#### CI Workflow
The CI workflow is to ensure that there will be no errors in the code deployment process. This workflow performs 3 major steps.
1. Setup Node.js  
FILL OUT

2. Install and Build Backend  
This step installs dependencies for and builds the client. It also runs the test suite for the backend.

3. Install and Build Client  
This step installs dependencies for and builds the client.

#### Workflow linter
The linter workflow runs the linters for both the frontend and the backend. See component specific readmes for more information.

## Continuous Deployment
Our CD is implemented with AWS CodePipeline

#### AWS CodePipeline
The pipeline is automated to run whenever a pull request is approved and merged into main. Essentially whenever the main branch gets 
updated, the pipeline runs.


## File Structure

```plaintext
├── 📁client
│   ├── 📁src
│   │   ├── 📁components
│   │   │   ├── Buttons.tsx
│   │   │   ├── PackageUploader.tsx
│   │   │   └── ...
│   │   ├── 📁assets
│   │   ├── index.tsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── 📁backend
│   ├── 📁src
│   │   ├── 📁controllers
│   │   │   ├── resetController.ts
│   │   │   └── ...
│   │   ├── 📁routes
│   │   │   ├── resetRoutes.ts
│   │   │   └── ...
│   │   ├── 📁models
│   │   │   ├── 📁evaluators
│   │   │   │   ├── createScorecard.ts
│   │   │   │   ├── evaluateModule.ts
│   │   │   │   └── readURLsFromFile.ts
│   │   │   ├── 📁metrics
│   │   │   │   ├── busfactorMetric.ts
│   │   │   │   ├── correctnessMetric.ts
│   │   │   │   ├── licenseMetric.ts
│   │   │   │   ├── maintainersMetric.ts
│   │   │   │   ├── metric.ts
│   │   │   │   └── rampupMetric.ts
│   │   │   └── 📁scores
│   │   │       └── scorecard.ts
│   │   ├── server.ts
│   │   └── ...
│   ├── package.json
│   └── ...
├── 📁logs
│   └── app.log
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── run
├── sample-file.txt
└── tsconfig.json
```