describe('Subscribers', () => {
  it('Opens campaigns page', () => {
    cy.resetDB();
    cy.loginAndVisit('/campaigns');
  });


  it('Counts campaigns', () => {
    cy.get('tbody td[data-label=Status]').should('have.length', 1);
  });


  it('Clones campaign', () => {
    for (let n = 0; n < 3; n++) {
      // Clone the campaign.
      cy.get('[data-cy=btn-clone]').first().click();
      cy.get('.modal input').clear().type(`clone${n}`).click();
      cy.get('.modal button.is-primary').click();
      cy.wait(250);
      cy.clickMenu('all-campaigns');
      cy.wait(100);

      // Verify the newly created row.
      cy.get('tbody td[data-label="Name"]').first().contains(`clone${n}`);
    }
  });


  it('Searches campaigns', () => {
    cy.get('input[name=query]').clear().type('clone2{enter}');
    cy.get('tbody tr').its('length').should('eq', 1);
    cy.get('tbody td[data-label="Name"]').first().contains('clone2');
    cy.get('input[name=query]').clear().type('{enter}');
  });


  it('Deletes campaign', () => {
    // Delete all visible lists.
    cy.get('tbody tr').each(() => {
      cy.get('tbody a[data-cy=btn-delete]').first().click();
      cy.get('.modal button.is-primary').click();
    });

    // Confirm deletion.
    cy.get('table tr.is-empty');
  });


  it('Adds new campaigns', () => {
    const lists = [1, 2];
    const cTypes = ['richtext', 'rawhtml', 'plain'];

    let n = 0;
    cTypes.forEach((c) => {
      lists.forEach((l) => {
      // Click the 'new button'
        cy.get('[data-cy=btn-new]').click();
        cy.wait(100);

        // Fill fields.
        cy.get('input[name=name]').clear().type(`name${n}`);
        cy.get('input[name=subject]').clear().type(`subject${n}`);

        for (let i = 0; i < l; i++) {
          cy.get('.list-selector input').click();
          cy.get('.list-selector .autocomplete a').first().click();
        }

        // Add tags.
        for (let i = 0; i < 3; i++) {
          cy.get('input[name=tags]').type(`tag${i}{enter}`);
        }

        // Hit 'Continue'.
        cy.get('button[data-cy=btn-continue]').click();
        cy.wait(250);

        // Insert content.
        cy.get('.ql-editor').type(`hello${n} \{\{ .Subscriber.Name \}\}`, { parseSpecialCharSequences: false });
        cy.get('.ql-editor').type('{enter}');
        cy.get('.ql-editor').type('\{\{ .Subscriber.Attribs.city \}\}', { parseSpecialCharSequences: false });

        cy.get('button[data-cy=btn-save]').click();

        n++;

        cy.clickMenu('all-campaigns');
      });
    });
  });


  it('Sorts subscribers', () => {
    const asc = [5, 6, 7, 8, 9, 10];
    const desc = [10, 9, 8, 7, 6, 5];
    const cases = ['cy-name', 'cy-timestamp'];

    cases.forEach((c) => {
      cy.sortTable(`thead th.${c}`, asc);
      cy.wait(100);
      cy.sortTable(`thead th.${c}`, desc);
      cy.wait(100);
    });
  });
});
