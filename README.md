# FrontendQaGithub

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

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
  - Total number of repositories.
  - Number of followers.
  - Number of users the account is following.

- **Repository List**:  
  A list of all repositories owned by the user or organization.

### 2.2 Commit List Page
The **Commit List Page** provides detailed commit data and filtering options:

- **Searchable Commit List**:  
  Search commits by:
  - Commit message.
  - Date.
  - Repository name.

- **Date Categorization**:  
  Commits are grouped by date for easy tracking of daily contributions.

- **Pagination**:  
  Commits are displayed with pagination, allowing users to navigate through data by date (not commit by commit) .

- **Commit Details**:  
  Clicking on a commit opens its detailed view on GitHub.

---

## 3. Additional Features

### 3.1 Auto-Refresh
The dashboard automatically refreshes every 15 minutes to fetch the latest data from GitHub.

### 3.2 Responsive Design
The application is  responsive, providing an optimal experience on desktops, tablets, and mobile devices.

### 3.3 Quality Assurance

---

## 4. Deployment and Setup