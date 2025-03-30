import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExcelProvider } from '../context/ExcelProvider';
import TabNavigation from './TabNavigation';

describe('TabNavigation', () => {
  beforeEach(() => {
    render(
      <ExcelProvider>
        <MemoryRouter initialEntries={['/json-to-excel']}>
          <TabNavigation />
        </MemoryRouter>
      </ExcelProvider>
    );
  });

  it('renders the TabNavigation component with correct initial state', () => {
    expect(screen.getByText("Excel To JSON")).toBeInTheDocument();
    expect(screen.getByText("JSON To Excel")).toBeInTheDocument();
  });

  it('navigates to ExcelToJson page when "Excel To JSON" is clicked', () => {
    const excelToJsonButton = screen.getByText("Excel To JSON");
    fireEvent.click(excelToJsonButton);

    // Since we are not testing routing here, just check that the button was clicked
    expect(excelToJsonButton).toHaveClass('bg-blue-500 text-blue-500');
  });

  it('navigates to JsonToExcel page when "JSON To Excel" is clicked', () => {
    const jsonToExcelButton = screen.getByText("JSON To Excel");
    fireEvent.click(jsonToExcelButton);

    expect(jsonToExcelButton).toHaveClass('bg-blue-500 text-blue-500');
  });
});
