describe('Modals', () => {
  it('back button', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-show-settings').click();
    cy.get('.e2e-open-presets').click();
    cy.get('.e2e-modal-back').click();
    cy.get('.e2e-modal-back').should('not.exist');
  });

  it('close button', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-show-settings').click();
    cy.contains('Настройки карты');
    cy.get('.e2e-modal-close').click();
    cy.get('.e2e-modal-close').should('not.exist');
  });
});
