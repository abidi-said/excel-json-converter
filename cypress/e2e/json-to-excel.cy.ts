
describe('JsonToExcel - JSON to Excel Conversion', () => {
    // before(() => {
    //   // Navigate to the page before the test
    //   cy.visit('/json-to-excel');
    // });

    it('should navigate to the Excel to JSON tab', () => {
        cy.visit('/');
        cy.get('[data-testid="json-to-excel"]').click();
        cy.url().should('include', '/json-to-excel');
    });
  
    it('should allow user to input JSON and convert it to Excel and file should be downloaded', () => {
      cy.visit('/json-to-excel');
      
      const validJson = '{"name": "John", "age": 30}';
  
      cy.get('[data-testid="json-to-excel-data"]').clear().type(validJson, { parseSpecialCharSequences: false });
      cy.get('[data-testid="json-to-excel-data"]').should('have.value', validJson);
  
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
  
      cy.get('[data-testid="convert-json-button"]').click();
      cy.readFile('cypress/downloads/converted.xlsx', { timeout: 10000 })
      .should('exist')
      .then(() => {
        cy.log('✅ Excel file downloaded successfully!');
      });
    });

    it('should show an alert if invalid JSON is entered', () => {
        cy.visit('/json-to-excel');
      
        const invalidJson = '{name: "John", age: 30}'; // Missing double quotes on keys
      
        cy.get('[data-testid="json-to-excel-data"]')
          .clear()
          .type(invalidJson, { parseSpecialCharSequences: false });
      
        cy.get('[data-testid="json-to-excel-data"]').should('have.value', invalidJson);
      
        cy.window().then((win) => {
          cy.stub(win, 'alert').as('alertStub');
        });
      
        cy.get('[data-testid="convert-json-button"]').click();
      
        cy.get('@alertStub').should(
          'have.been.calledWith',
          'Invalid JSON format. Please enter a valid JSON object or array.'
        );
      });
      
  });
  