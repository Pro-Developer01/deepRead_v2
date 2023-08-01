# Code Repository - Commit and Workflow Guide (GitLab)

This document outlines the recommended workflow for committing and working with the code in this repository. Following these guidelines will help ensure a smooth collaboration and maintain the stability of the `develop` branch.

## Workflow Overview

1. Create a branch from `develop`: Before working on any new feature or bug fix, create a branch from the `develop` branch. The branch name should follow the format: `bug-xyz`, `feature-xyz`, or `revision-xyz`.

2. Committing Changes: All commits must be made on the specific branch you created in the previous step. Commit your changes regularly, ensuring that each commit represents a logical and functional unit of work.

3. Refine and Test: Continuously refine and test your code on the branch until it is in a stable and working state.

4. Create a Merge Request: When your code is ready to be integrated into the main codebase, create a merge request from your branch into the `develop` branch.

5. Review Process: Request reviews for your merge request. Ideally, involve someone from the **DeepRead** team and **someone from your own development team**.

6. Merge or Revise: On approval, merge your changes into the `develop` branch. On rejection, make the necessary corrections and ask for a new review.

## Detailed Workflow Steps

### 1. Create a Branch

To create a new branch, use the following git command:
```git checkout -b <branch-name> develop```


Replace `<branch-name>` with an appropriate name, such as `bug-fix-issue-123`, `feature-new-feature`, or `revision-improvement-456`.

### 2. Committing Changes

Make your code changes and commit them with descriptive messages:

```git add .```
```git commit -m "Brief description of changes"```
```git push <branch-name> ```


Commit regularly and avoid including unrelated changes in a single commit.

### 3. Refine and Test

Test your changes thoroughly on the branch to ensure they work as expected and do not introduce any regressions.

### 4. Create a Merge Request

When you are confident in your changes and they are ready for review, create a merge request using the repository's preferred method (e.g., GitHub Pull Request or **GitLab Merge Request**) from your branch into the `develop` branch.

### 5. Review Process

Ask for reviews from appropriate team members, including someone from the `deepread` team and your own development team. Be open to feedback and iterate on your changes based on the review comments.

### 6. Merge or Revise

If your merge request is approved, you can merge your changes into the `develop` branch. If it is rejected, make the necessary corrections, update the branch, and repeat the review process.

***


# DeepRead - React App

1. Install all dependencies: ```npm install```
1.1 Install amplify component:
   - ```npm install -g @aws-amplify/cli```
   - ```amplify pull --appId d3577kcca6axmh --envName staging```
   - ```amplify import auth```
2. Run the application: ```npm start``` (will launch on Port 3000 by React default)
3. ENV variables, need to be created, check the example.env, copy, rename to .env and then fill out the needed variables depending on your environments.
   - There are 3 environments: DEV, STAGING, PROD
   1. **DEV**: is to be used for local deployments
   2. **STAGING**: used to deploy on our virtual server (app.deepread.com)
   3. **PROD**: used to launch on our k8s cluster (frontend.deepread.com, name will change in the future)
4. Key differences:
   1. DEV: should run local, has additional debbugings, can hot reload, etc.
   2. STAGING: should only if needed include hot reload (quick fixes are faster visible like this)
   3. PROD: none, the most optimal setup, no errors if possible, _no console logs at all (!!!NO TOKENS!!!, NO ID'S!!!)_
