describe('Dashboard Component Validation with Mock Data', () => {

  const mockValidToken = Cypress.env('mockToken') || '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'; 

  beforeEach(() => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    cy.visit('/auth');

    cy.get('[data-testid="token-input"]').type(mockValidToken); 
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('Should validate the presence of 3 key components on the dashboard', () => {
    cy.wait('@getUser');
    cy.wait('@getRepos');
    cy.wait('@getLanguages');

    cy.get('[data-testid="user-info-block"]').should('exist').and('be.visible'); 
    cy.get('[data-testid="project-count-block"]').should('exist').and('be.visible'); 
    cy.get('[data-testid="total-commits-block"]').should('exist').and('be.visible'); 
  });

  it('Should validate repository list components on the dashboard', () => {
    cy.wait('@getRepos');

    cy.get('[data-testid="repositories-container"]').should('exist').and('be.visible');
    cy.get('[data-testid="repository-item"]').should('have.length', 6); 
  });

  it('Should validate chart components on the dashboard', () => {
    cy.wait('@getLanguages');

    cy.get('[data-testid="bar-chart"]').should('exist').and('be.visible');
    cy.get('[data-testid="pie-chart"]').should('exist').and('be.visible'); 
  });
});
