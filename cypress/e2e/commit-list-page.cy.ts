describe('Commit Navigation Test: Visit commit list and validate navigation', () => {
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

  it('Should navigate to commit list and click on the 3rd commit to validate navigation', () => {
    cy.visit('/commit-list');
    cy.url().should('include', '/commit-list');

    cy.wait('@getCommits');

    cy.get('[data-testid="commit-container"]').should('exist').and('be.visible');

    cy.get('[data-testid="commit-link"]').eq(2).then((link) => {
      const href = link.prop('href'); 
      cy.wrap(link).click();
      cy.url().should('eq', href);
    });
  });
});
