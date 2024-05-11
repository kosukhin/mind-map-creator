describe('Search', () => {
  it('common search', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-search').click();
    cy.get('.e2e-query-input').type('Акт');
    cy.contains('Актер');
    cy.get('.e2e-query-input').clear();
    cy.get('.e2e-type-input').select('Действие');
    cy.contains('222');
    cy.get('.e2e-type-input').select(0);
  });

  it('named search', () => {
    cy.visit('http://localhost:8881/?view=/e2e/map.json');
    cy.get('.e2e-search').click();
    cy.contains('444');
    cy.get('.e2e-named-search-remove').eq(0).click();
    cy.contains('444').should('not.exist');
    cy.get('.e2e-named-search-create').click();
    cy.get('.e2e-named-search-name').type('Новый поиск');
    cy.get('.e2e-named-search-query').type('333');
    cy.get('.e2e-named-search-save').click();
    cy.get('.e2e-named-search-variant').eq(0).should('contain.text', 'Новый поиск');
  });
});
