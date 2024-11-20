describe('Dashboard Component Validation with Mock Data', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');

    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');

    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('valid-token');
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('Should validate the presence of 3 key components on the dashboard', () => {
    // Wait for API responses
    cy.wait('@getUser');
    cy.wait('@getRepos');
    cy.wait('@getLanguages');

    // Check for key components
    cy.get('[data-testid="user-info-block"]').should('exist').and('be.visible'); // User info
    cy.get('[data-testid="project-count-block"]').should('exist').and('be.visible'); // Project count
    cy.get('[data-testid="total-commits-block"]').should('exist').and('be.visible'); // Total commits
  });

  it('Should validate repository list components on the dashboard', () => {
    // Wait for repository-related API responses
    cy.wait('@getRepos');

    // Validate repository list components
    cy.get('[data-testid="repositories-container"]').should('exist').and('be.visible');
    cy.get('[data-testid="repository-item"]').should('have.length', 6); // Assuming 6 repositories in mock data
  });

  it('Should validate chart components on the dashboard', () => {
    // Wait for language-related API responses
    cy.wait('@getLanguages');

    // Validate the presence of bar and pie charts
    cy.get('[data-testid="bar-chart"]').should('exist').and('be.visible');
    cy.get('[data-testid="pie-chart"]').should('exist').and('be.visible');
  });
});
