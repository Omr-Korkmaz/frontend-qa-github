describe('Commit List Page Validation', () => {
  beforeEach(() => {
    // Mock necessary API requests
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');
    cy.intercept('GET', '**/repos/**/commits?page=*', { fixture: 'commits.json' }).as('getCommits');

    // Simulate token-based login
    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('mock-valid-token');
    cy.get('[data-testid="submit-button"]').click();

    // Ensure login redirects to the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('Should display bar and pie charts using mock data', () => {
    cy.wait('@getLanguages');

    cy.get('[data-testid="bar-chart"]').should('exist').and('be.visible');
    cy.get('[data-testid="pie-chart"]').should('exist').and('be.visible');
  });

  it('Should display the repository list', () => {
    cy.wait('@getRepos');

    cy.get('[data-testid="repositories-container"]').should('exist').and('be.visible');
    cy.get('[data-testid="repository-item"]').should('have.length', 6);
  });

  it('Should search and filter commits using mock data', () => {
    cy.visit('/commit-list');
    cy.wait('@getCommits');

    // Ensure the commit container is visible
    cy.get('[data-testid="commit-container"]').should('exist').and('be.visible');

    // Type a search query
    cy.get('tds-text-field[placeholder="Search Commits"] input').type('Initial commit');

    // Validate filtered commit
    cy.get('[data-testid="commit-card"]').should('have.length', 1).and('contain', 'Initial commit');

    // Clear the search input and validate all commits reappear
    cy.get('tds-text-field[placeholder="Search Commits"] input').clear();
    cy.get('[data-testid="commit-card"]').should('have.length.greaterThan', 1);
  });

  it('Should reset filters and show all commits', () => {
    cy.visit('/commit-list');
    cy.wait('@getCommits');

    // Filter the commits
    cy.get('tds-text-field[placeholder="Search Commits"] input').type('Initial commit');
    cy.get('[data-testid="commit-card"]').should('have.length', 1);

    // Click the reset button
    cy.get('tds-button[text="Reset"]').click();
    cy.get('[data-testid="commit-card"]').should('have.length.greaterThan', 1);
  });

  it('Should navigate to a specific commit via link', () => {
    cy.visit('/commit-list');
    cy.wait('@getCommits');

    // Click commit link and verify navigation
    cy.get('[data-testid="commit-card"] [data-testid="commit-link"]').first().then((link) => {
      const href = link.prop('href'); // Extract the link URL
      cy.wrap(link).click(); // Click the link
      cy.url().should('eq', href); // Validate navigation
    });
  });
});
