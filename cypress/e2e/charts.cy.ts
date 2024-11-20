describe('Dashboard Charts', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');
    cy.intercept('GET', '**/repos/**/commits', { fixture: 'commits.json' }).as('getCommits');

    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('valid-token');
    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@getUser');
    cy.url().should('include', '/dashboard');
  });

  it('should display a bar chart and a pie chart', () => {
    cy.wait('@getLanguages');
    cy.wait('@getRepos');

    cy.get('[data-testid="bar-chart"]').should('exist').and('be.visible');
    cy.contains('Commits Per Month').should('be.visible');

    cy.get('[data-testid="pie-language-chart"]').should('exist').and('be.visible');
    cy.contains('Programming Language Usage').should('be.visible');
  });
});
