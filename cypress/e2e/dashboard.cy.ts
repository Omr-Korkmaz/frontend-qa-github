describe('Dashboard Component Validation with Mock Data', () => {
  beforeEach(() => {
    // Intercept user info request
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');

    // Intercept repositories request
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');

    // Intercept languages request
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    // Simulate token-based login using mock data
    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('mock-valid-token');
    cy.get('[data-testid="submit-button"]').click();

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
