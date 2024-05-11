describe('Menu', () => {
  it('Open menu', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-open-menu').click();
    cy.contains('Меню');
    cy.wait(1000).get('.e2e-drawer-back').click('topLeft');
    cy.contains('Меню').should('not.exist');
  });
});
