import { WIZARD_STATUS } from '../../wizard/constants';

Cypress.config('waitForAnimations', true);

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

describe('Financial Status Report (Wizard)', () => {
  before(() => {
    window.dataLayer = [];
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit('/manage-va-debt/request-debt-help-5655');
    cy.injectAxe();
  });

  it('should navigate the wizard and start the form', () => {
    const title = 'Request help with VA debt (VA Form 5655)';
    const heading = 'Is this the form I need?';
    cy.get('.wizard-heading').should('have.text', heading);
    cy.get('[type="radio"][value="request"]').click();
    cy.get('[type="radio"][value="recipients"]').click();
    cy.get('[type="radio"][value="veteran"]').click();
    cy.get('.usa-button-primary').click();
    cy.get('h1').should('have.text', title);
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });
});
