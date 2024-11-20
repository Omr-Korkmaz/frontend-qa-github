describe('Form Validation', () => {
    it('Shows error for empty token', () => {
      cy.visit('/auth');
      cy.get('tds-button[text="Submit"]').click();
      cy.contains('Please enter a valid GitHub token.').should('be.visible');
    });
  
    it('Shows error for invalid token format', () => {
      cy.visit('/auth');
      cy.get('tds-text-field[placeholder="Enter your GitHub Token"]').type('invalid_token_format');
      cy.get('tds-button[text="Submit"]').click();
      cy.contains('Invalid GitHub token. Please try again.').should('be.visible');
    });
  });
  