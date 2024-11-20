describe('Commit Search and Navigation', () => {
  beforeEach(() => {
    cy.login(Cypress.env('github_token'));
    cy.intercept('GET', '**/user/repos', { fixture: 'repositories.json' }).as('getRepos');
    cy.visit('/commit-list');
  });

  it('Should search for commits by message', () => {
    cy.get('[data-testid="search-input"]').type('Fix issue');
    cy.get('[data-testid="commit-card"]').should('contain', 'Fix issue #123');
  });

  it('Should navigate to the third commit GitHub page', () => {
    cy.get('[data-testid="commit-card"]').eq(2).within(() => {
      cy.get('[data-testid="commit-link"]').click();
    });
    cy.url().should('include', 'github.com');
  });
});
