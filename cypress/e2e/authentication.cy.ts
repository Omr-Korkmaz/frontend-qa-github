describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.visit('/auth'); // Automatically prepends http://localhost:4200
    });
  
    it('should display the login form', () => {
      cy.get('input#token').should('exist');
      cy.contains('Authenticate with GitHub').should('exist');
    });
  
    it('should authenticate with a valid token and redirect to dashboard', () => {
      cy.get('input#token').type(Cypress.env('validToken')); // Use the valid token from env
      cy.contains('Authenticate with GitHub').click();
  
      cy.url().should('include', '/dashboard');
      cy.contains('GitHub Dashboard Summary').should('exist');
    });
  
    it('should show error with invalid token', () => {
      cy.get('input#token').type(Cypress.env('invalidToken')); // Use the invalid token
      cy.contains('Authenticate with GitHub').click();
  
      cy.contains('Invalid GitHub token. Please try again.').should('exist');
    });
  });
  