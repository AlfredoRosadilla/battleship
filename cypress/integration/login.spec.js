/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('https://aws-challenge-1n8f0jwnz-alfredorosadilla.vercel.app');
  });

  it('Should log in', () => {
    cy.login(
      Cypress.env('USER_MOCK_VALUE'),
      Cypress.env('PASSWORD_MOCK_VALUE'),
    );

    cy.location('search').should('include', '?page=1&status=running');

    cy.getCookies()
      .should('have.length', 1)
      .should((cookies) => {
        expect(cookies[0]).to.have.property('path', '/');
        expect(cookies[0]).to.not.have.property('expires');
        expect(cookies[0]).to.have.property('secure', false);
        expect(cookies[0]).to.have.property('name', 'Oort-session-token');
      });
  });

  it('Should show error message trying to login', () => {
    cy.login('test', 'test', false);

    cy.location('search').should('include', '?error=true');

    cy.get('[data-testid="login-invalid-credentials-alert"]').should(
      'have.text',
      'Invalid credentials',
    );
  });
});
