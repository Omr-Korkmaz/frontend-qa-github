describe('Commit List Navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');

    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');

    cy.intercept('GET', '**/repos/**/languages', { fixture: 'languages.json' }).as('getLanguages');

    cy.intercept('GET', '**/repos/**/commits?page=*', { fixture: 'commits.json' }).as('getCommits');

    cy.visit('/auth');
    cy.get('[data-testid="token-input"]').type('mock-valid-token');
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('Should navigate to the commit list page', () => {
    cy.visit('/commit-list');

    cy.url().should('include', '/commit-list');

    cy.wait('@getCommits');

    cy.get('[data-testid="commit-container"]').should('exist').and('be.visible');
  });
});
