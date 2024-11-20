
describe('Auth Form Validation', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/user', (req) => {
        if (req.headers.authorization === 'Bearer valid-token') {
          req.reply({ fixture: 'user.json' });
        } else {
          req.reply({ statusCode: 401, body: { message: 'Bad credentials' } });
        }
      }).as('getUser');
  
      cy.visit('/auth');
    });
  
    it('Should show an error if the token input is empty', () => {
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="error-message"]').should('be.visible')
        .and('contain', 'Please enter a valid GitHub token.');
    });
  
    it('Should show an error if the token format is invalid', () => {
      cy.get('[data-testid="token-input"]').type('invalid-token');
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="error-message"]').should('be.visible')
        .and('contain', 'Invalid token format. Ensure it is a 40-character hexadecimal string.');
    });
   
  
    it('Should preserve the input token on validation error', () => {
      cy.get('[data-testid="token-input"]').type('invalid-format-token');
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="token-input"]').should('have.value', 'invalid-format-token');
    });
  });
  