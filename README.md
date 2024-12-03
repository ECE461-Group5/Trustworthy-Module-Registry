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

## CI/CD (Continuous Integration / Continuous Deployment)

### Continuous Integration
Our CI is implemented with GitHub actions. We have two workflows that trigger on every push to any branch.

#### ci Workflow
The ci workflow is to ensure that there will be no errors in the code deployment process. This workflow performs 3 major steps.
1. Setup Node.js
FILL OUT

2. Install and Build Backend
This step installs dependencies for and builds the client. It also runs the test suite for the backend.

3. Install and Build Client
This step installs dependencies for and builds the client.

#### Workflow


### Roles
AWS IAM is utilized to ensure that all group members have adequate privilidges without having too many.

### EC2 and CodePipeline
The app is currently running on an AWS EC2 instance. Deployments are handled through AWS CodePipeline. The pipeline is automated to run whenever a pull request is approved
and merged into main. Essentially whenever the main branch gets updated, the pipeline runs.

## GitHub Actions

### CI

