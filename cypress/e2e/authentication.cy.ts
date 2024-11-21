describe('Authentication Flow', () => {
  const mockValidToken = Cypress.env('MOCK_TOKEN');

  const MOCinValidToken = Cypress.env('iNVALID_TOKEN');

  beforeEach(() => {
    cy.intercept('GET', '**/user', (req) => {
      console.log('Intercepted GET /user request:', req); 

      if (req.headers.authorization === `Bearer ${mockValidToken}`) {
        req.reply({ fixture: 'user.json' }); 
      } else {
        req.reply({
          statusCode: 401,
          body: { message: 'Bad credentials' },
        });
      }
    }).as('getUser');
    cy.visit('/auth-form'); 
  });

  it('Should display error for invalid token', () => {

    cy.get('[data-testid="token-input"]').type(MOCinValidToken);
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@getUser').then((interception) => {
      console.log('Response from GET /user:', interception.response); 
    });

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid GitHub token. Please try again.');
  });

  it('Should navigate to dashboard for valid token', () => {
    cy.get('[data-testid="token-input"]').type(mockValidToken);
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@getUser').then((interception) => {
      console.log('Response from GET /user:', interception.response); 
    });

    cy.url().should('include', '/dashboard');
    cy.contains('GitHub Dashboard Summary').should('be.visible');
  });

  it('Should redirect unauthenticated user to login when accessing dashboard directly', () => {
    cy.visit('/dashboard');
    
    cy.url().should('include', '/auth');
  });
});
