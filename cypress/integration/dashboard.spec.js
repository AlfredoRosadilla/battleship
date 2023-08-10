/// <reference types="cypress" />

context('Dashboard', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('https://aws-challenge-1n8f0jwnz-alfredorosadilla.vercel.app');
    cy.login(
      Cypress.env('USER_MOCK_VALUE'),
      Cypress.env('PASSWORD_MOCK_VALUE'),
    );
    cy.location('search').should('include', 'status=running');
  });

  it('Should render corresponding dashboard elements', () => {
    [
      'article.panel',

      '[data-testid="dashboard-tabs-container"]',
      'a[href="/?page=1&status=running"]',
      'a[href="/?page=1&status=inactive"]',
      'a[href="/?page=1&status=all"]',

      'form[data-testid="dashboard-search-form"]',
      'input[data-testid="dashboard-search-search-input"]',
      'button[data-testid="dashboard-search-button"]',

      'table[data-testid="dashboard-table-table"]',
      'th[data-testid="dashboard-table-sort-head-0"]',
      'th[data-testid="dashboard-table-sort-head-1"]',
      'th[data-testid="dashboard-table-sort-head-2"]',
      'th[data-testid="dashboard-table-sort-head-3"]',
      'th[data-testid="dashboard-table-sort-head-4"]',
      'th[data-testid="dashboard-table-sort-head-5"]',
      'th[data-testid="dashboard-table-sort-head-6"]',

      'tbody[data-testid="dashboard-table-body"]',

      '[data-testid="dashboard-pagination-container"]',
      'nav.pagination',
      '[data-testid="dashboard-pagination-previous"]',
      '[data-testid="dashboard-pagination-next"]',
      'ul.pagination-list',
    ].forEach((selector) => {
      cy.get(selector).should('be.visible');
    });
  });

  describe('Tabs', () => {
    it('Should filter by tab regarding instances type', () => {
      // all elements should be running instances
      cy.get('[data-testid="dashboard-table-body"]>tr>td>span').each(
        (element) => {
          cy.wrap(element).should('have.class', 'has-text-success');
        },
      );

      cy.get('a[href="/?page=1&status=inactive"]').click();

      cy.location('search').should('include', 'status=inactive');

      // all elements should be inactive instances
      cy.get('[data-testid="dashboard-table-body"]>tr>td>span').each(
        ($element) => {
          cy.wrap($element).should('have.class', 'has-text-danger');
        },
      );

      cy.get('a[href="/?page=1&status=all"]').click();

      cy.location('search').should('include', 'status=all');
    });
  });

  describe('Searching', () => {
    it('Should filter by searching input', () => {
      const searchBy = 'la';

      cy.get('input[data-testid="dashboard-search-search-input"]').type(
        searchBy,
      );

      cy.get('button[data-testid="dashboard-search-button"]').click();

      cy.get('tbody[data-testid="dashboard-table-body"]>tr').each(
        ($element) => {
          cy.wrap($element)
            .invoke('text')
            .should((text) => {
              expect(text.indexOf(searchBy) !== -1).equal(true);
            });
        },
      );
    });
  });

  describe('Sorting', () => {
    it('Should sort by heading', () => {
      ['status', 'name', 'id', 'type', 'az', 'publicIp', 'privateIps'].forEach(
        (headingId, index) => {
          cy.get(
            `th[data-testid="dashboard-table-sort-head-${index}"]`,
          ).click();

          cy.location('search').should('include', `sort-${headingId}=ASC`);

          cy.get(
            `th[data-testid="dashboard-table-sort-head-${index}"]`,
          ).click();

          cy.location('search').should('include', `sort-${headingId}=DES`);

          cy.get(
            `th[data-testid="dashboard-table-sort-head-${index}"]`,
          ).click();

          cy.location('search').should('not.include', `sort-${headingId}`);
        },
      );
    });
  });

  describe('Pagination', () => {
    it('Should set query params to filter by page tile', () => {
      cy.get('ul.pagination-list>li>a').each(($element) => {
        cy.wrap($element)
          .invoke('text')
          .then((text) => {
            cy.wrap($element).click();

            cy.location('search').should('include', `page=${text}`);
          });
      });
    });

    it('should navigate for next page when clicks on next button', () => {
      cy.get('[data-testid="dashboard-pagination-next"]').click();

      cy.location('search').should('include', `page=2`);
    });

    it('should navigate for next page when clicks on previous button', () => {
      cy.get('[data-testid="dashboard-pagination-next"]').click();

      cy.location('search').should('include', `page=2`);

      cy.get('[data-testid="dashboard-pagination-next"]').click();

      cy.location('search').should('include', `page=3`);

      cy.get('[data-testid="dashboard-pagination-next"]').click();

      cy.location('search').should('include', `page=4`);

      cy.get('[data-testid="dashboard-pagination-previous"]').click();

      cy.location('search').should('include', `page=3`);
    });

    it('should avoid to navigate when page is 1 and is trying to go previous', () => {
      cy.get('[data-testid="dashboard-pagination-previous"]').click();

      cy.location('search').should('include', `page=1`);
    });

    it('should avoid to navigate when page is last and is trying to go next', () => {
      const lastTileSelector = 'ul.pagination-list>li:last-child>a';

      cy.get(lastTileSelector)
        .click()
        .invoke('text')
        .then((text) => {
          cy.location('search').should('include', `page=${text}`);
        });

      cy.get('[data-testid="dashboard-pagination-next"]').click();

      cy.get(lastTileSelector)
        .invoke('text')
        .then((text) => {
          cy.location('search').should('include', `page=${text}`);
        });
    });
  });
});
