describe('Presets', () => {
  it('add to map', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-sidebar').contains('Блок').should('not.exist');
    cy.get('.e2e-show-settings').click();
    cy.get('.e2e-open-presets').click();
    cy.wait(1000).contains('Добавить на карту').eq(0).click();
    cy.get('.e2e-modal-close').click();
    cy.get('.e2e-sidebar').contains('Блок');
  });
});
