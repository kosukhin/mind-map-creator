describe('Parent types', () => {
  it('AddTypeToMap', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.contains('Вложенная карта').click();
    cy.get('.e2e-show-settings').click();
    cy.get('.e2e-open-parent-types').click();
    cy.get('.e2e-add-parent-type').eq(1).click();
    cy.get('.e2e-modal-close').click();
  });
});
