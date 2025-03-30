import 'cypress-file-upload';

describe('App E2E Tests', () => {
    it('should navigate to the Excel to JSON tab', () => {
      cy.visit('/');
      cy.get('[data-testid="excel-to-json"]').click();
      cy.url().should('include', '/excel-to-json');
    });
  
    it('should upload an Excel file and convert it to JSON and file should be downloaded', () => {
      cy.visit('/');
      const fileName = 'sample.xls';
      cy.get('input[type="file"]').attachFile(fileName);
      
      cy.get('[data-testid="excel-to-json-data"]').should('not.be.empty');

      cy.get('[data-testid="download-button"]').click();
      cy.readFile('cypress/downloads/Sheet1.json', { timeout: 10000 })
      .should('exist')
      .then(() => {
        cy.log('✅ Excel file downloaded successfully!');
      });

    });
  });
  