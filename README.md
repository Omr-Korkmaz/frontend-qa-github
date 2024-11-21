# FrontendQaGithub

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests




##  Running end-to-end tests
To run End-to-End (E2E) tests with Cypress:

##   Configure Cypress Environment
Open the cypress.json file in your project’s root directory.

##  Add your mock token in the env section:
{
  "baseUrl": "http://localhost:4200",
  "env": {
    "MOCK_TOKEN": "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"
  }
}

This will allow Cypress to use the mock token for testing.

##  Run Cypress
To open the Cypress test runner and see the UI:

`npx cypress open`

To run the tests in headless mode (without the UI):
`npx cypress run`



# GitHub Insights Dashboard

## 1. Introduction
The GitHub Insights Dashboard is a web application designed to fetch and display data from GitHub's public API. It provides users with a comprehensive overview of their GitHub activity through visual charts and detailed lists.

## 2. Features and Functionality

### 2.1 Dashboard Page
Once authenticated, users are directed to the **Dashboard Page**, which provides an overview of their GitHub activity. Key features include:

- **Commit Frequency**:  
  A bar chart displaying the number of commits made each month.

- **Programming Languages**:  
  A pie chart showing the distribution of programming languages used in the user’s repositories.

- **Summary Tile**:  
  Key metrics including:
  - Total number of this year repositories.
  - Number of followers.
  - Number of users the account is following.

- **Repository List**:  
  A list of all repositories owned by the user or organization.

### 2.2 Commit List Page
The **Commit List Page** provides detailed commit data and filtering options:

- **Searchable Commit List**:  
  Search commits by:
  - Commit message.
- **filter Commit List**:  
-date
-commit
-repo


- **Date Categorization**:  
  Commits are grouped by date for easy tracking of daily contributions.

- **Pagination**:  
  Commits are displayed with pagination, allowing users to navigate through data by date (not commit by commit) .

- **Commit Details**:  
  Clicking on a commit opens its detailed view on GitHub.

---
