describe('Commit List Navigation', () => {
  beforeEach(() => {
    // Intercept user info request
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');

    // Intercept repositories request
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');

    // Intercept languages request
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    // Intercept commits request
    cy.intercept('GET', '**/repos/**/commits?page=*', { fixture: 'commits.json' }).as('getCommits');

    // Simulate token-based login using mock data
    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('mock-valid-token');
    cy.get('[data-testid="submit-button"]').click();

    // Validate successful login and redirection to dashboard
    cy.url().should('include', '/dashboard');
  });

  it('Should navigate to the commit list page', () => {
    // Navigate to commit list directly
    cy.visit('/commit-list');

    // Validate successful navigation to commit list
    cy.url().should('include', '/commit-list');

    // Wait for the commits API to be called
    cy.wait('@getCommits');

    // Validate that the commit container is visible
    cy.get('[data-testid="commit-container"]').should('exist').and('be.visible');
  });
});
