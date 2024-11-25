describe('Dashboard Component Validation with Mock Data', () => {
  const mockValidToken = Cypress.env('MOCK_TOKEN');
  beforeEach(() => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type(mockValidToken); 
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@getUser');
    cy.url().should('include', '/dashboard');
  });

  it('Should display key components on the dashboard', () => {
    cy.wait('@getUser');
    cy.get('[data-testid="dashboard-title"]').should('contain', 'GitHub Dashboard Summary');
    cy.get('[data-testid="user-info-block"]').should('exist').and('be.visible');
    cy.get('[data-testid="project-count-block"]').should('exist').and('be.visible');
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
});
