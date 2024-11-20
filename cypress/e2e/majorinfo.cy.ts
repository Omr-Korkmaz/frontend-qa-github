describe('Major User Flows', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
      cy.intercept('GET', '**/repos/**/commits', { fixture: 'commits.json' }).as('getCommits');
    });
  
    it('should authenticate with a valid token', () => {
      cy.visit('/auth');
      cy.get('[data-testid="token-input"]').type('ghp_validToken');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', '/dashboard');
      cy.wait('@getUser');
    });
  
    it('should load and interact with charts', () => {
      cy.visit('/dashboard');
      cy.get('#barChart').should('exist').and('be.visible');
      cy.get('#pieChart').should('exist').and('be.visible');
    });
  
    it('should allow searching and navigating through commits', () => {
      cy.visit('/commit-list');
      cy.get('[data-testid="search-input"]').type('Initial commit');
      cy.get('app-commit-card').should('contain', 'Initial commit');
      cy.get('[data-testid="reset-button"]').click();
      cy.get('app-commit-card').should('have.length.greaterThan', 1);
    });
  });
  