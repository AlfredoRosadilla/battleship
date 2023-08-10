Cypress.Commands.add(
  'login',
  (username, password, shouldLogWithButton = true) => {
    cy.visit('https://aws-challenge-1n8f0jwnz-alfredorosadilla.vercel.app');

    cy.url().should('include', '/login');

    cy.get('#username').type(username).should('have.value', username);

    cy.get('#password').type(password).should('have.value', password);

    if (shouldLogWithButton) {
      cy.get('[data-testid="login-login-button"]').click();
    } else {
      cy.get('#password').type('{enter}');
    }
  },
);
