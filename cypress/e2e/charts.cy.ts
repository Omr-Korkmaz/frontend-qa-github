describe('Dashboard Charts', () => {
    beforeEach(() => {
      // Log in before accessing the dashboard
      cy.visit('/auth');
      cy.get('input#token').type('VALID_GITHUB_TOKEN');
      cy.contains('Authenticate with GitHub').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('should load the bar chart with commits per month', () => {
      cy.get('#barChart').should('exist');
      cy.contains('Commits Per Month').should('exist');
    });
  
    it('should load the pie chart for language usage', () => {
      cy.get('#pieChart').should('exist');
      cy.contains('Programming Language Usage').should('exist');
    });
  
    it('should display correct data in the pie chart', () => {
      cy.get('#pieChart').should('exist');
      cy.get('.chart-legend').should('contain', 'JavaScript');
    });
  });
  