describe('Session log', () => {
  it('session window', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-session-open').click();
    cy.contains('[AppSessionLog.vue] setup');
    cy.wait(1000).get('.e2e-drawer-back').click('topLeft');
    cy.contains('[AppSessionLog.vue] setup').should('not.exist');
  });
});
