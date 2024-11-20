/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with a given token.
       * @example cy.login('valid-token')
       */
      login(token: string): Chainable<void>;
    }
  }
  