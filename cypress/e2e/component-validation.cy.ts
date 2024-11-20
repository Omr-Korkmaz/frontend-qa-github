describe('Component Validation: Ensure 3 components are available on the dashboard page', () => {
    beforeEach(() => {
      // Mock API responses
      cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
      cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');
  
      cy.visit('/auth');
      cy.get('[data-testid="token-input"]').type('mock-valid-token');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('Should ensure the presence of 3 key components on the dashboard', () => {
      cy.wait('@getUser');  // Wait for user info response
      cy.wait('@getRepos'); // Wait for repositories response
      cy.wait('@getLanguages'); // Wait for languages response
  
      // Validate presence of key components
      cy.get('[data-testid="user-info-block"]').should('exist').and('be.visible');
      cy.get('[data-testid="project-count-block"]').should('exist').and('be.visible');
      cy.get('[data-testid="total-commits-block"]').should('exist').and('be.visible');
    });
  });
  