describe('Commit List Navigation', () => {
    beforeEach(() => {
      // Log in and navigate to commit list
      cy.visit('/auth');
      cy.get('input#token').type('VALID_GITHUB_TOKEN');
      cy.contains('Authenticate with GitHub').click();
      cy.url().should('include', '/dashboard');
  
      cy.contains('Commits').click(); // Navigate to commits page
      cy.url().should('include', '/commit-list');
    });
  
    it('should display commits grouped by date', () => {
      cy.get('.commit-group').should('exist'); // Ensure grouped commits exist
    });
  
    it('should search commits based on message or author', () => {
      cy.get('input#search').type('Initial commit');
      cy.get('.commit-item').should('contain', 'Initial commit');
    });
  
    it('should navigate back to dashboard', () => {
      cy.contains('Home').click();
      cy.url().should('include', '/dashboard');
    });
  });
  