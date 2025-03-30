import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ExcelProvider } from './ExcelProvider';
import { useExcel } from './useExcel';
import { Tab } from '../types/Tab';
import * as XLSX from 'xlsx';

const MockConsumer = () => {
  const {
    sheets,
    optimisticSheet,
    jsonData,
    handleFileChange,
    handleSheetChange,
    downloadJson,
    activeTab,
    handleTabChange,
    jsonInput,
    setJsonInput,
    convertJsonToExcel
  } = useExcel();

  return (
    <div>
      <span data-testid="sheets">{JSON.stringify(sheets)}</span>
      <span data-testid="optimisticSheet">{optimisticSheet}</span>
      <span data-testid="jsonData">{jsonData}</span>
      <span data-testid="activeTab">{activeTab}</span>

      <input
        data-testid="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <select data-testid="sheet-selector" onChange={handleSheetChange}>
        {sheets.map((sheet, index) => (
          <option key={index} value={sheet}>{sheet}</option>
        ))}
      </select>
      <button data-testid="download-json" onClick={downloadJson}>Download JSON</button>
      <button data-testid="convert-json" onClick={convertJsonToExcel}>Convert to Excel</button>
      <button data-testid="tab-excel-to-json" onClick={() => handleTabChange(Tab.EXCEL_TO_JSON)}>Excel to JSON</button>
      <button data-testid="tab-json-to-excel" onClick={() => handleTabChange(Tab.JSON_TO_EXCEL)}>JSON to Excel</button>
      <textarea
        data-testid="json-input"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
    </div>
  );
};

const createMockFile = () => {
  const mockWorkbook = XLSX.utils.book_new();
  const mockSheet = XLSX.utils.aoa_to_sheet([["Name", "Age"], ["John", 30]]);
  XLSX.utils.book_append_sheet(mockWorkbook, mockSheet, "Sheet1");
  const excelData = XLSX.write(mockWorkbook, { bookType: "xlsx", type: "binary" });

  const mockFile = new File([new Blob([excelData])], "test.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  Object.defineProperty(mockFile, 'arrayBuffer', {
    value: async () => new ArrayBuffer(excelData.length),
  });

  return mockFile;
};

describe('ExcelProvider Integration Tests', () => {
  it('renders child components correctly', () => {
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );
    expect(screen.getByTestId('sheets')).toBeInTheDocument();
    expect(screen.getByTestId('activeTab')).toHaveTextContent(Tab.EXCEL_TO_JSON);
  });

  it('updates sheets when a valid Excel file is uploaded', async () => {
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );
  
    const mockWorkbook = XLSX.utils.book_new();
    const mockSheet = XLSX.utils.aoa_to_sheet([["Name", "Age"], ["John", 30]]);
    XLSX.utils.book_append_sheet(mockWorkbook, mockSheet, "Sheet1");
    const excelData = XLSX.write(mockWorkbook, { bookType: "xlsx", type: "binary" });
  
    const excelFile = new File([new Blob([excelData])], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    Object.defineProperty(excelFile, 'arrayBuffer', {
      value: async () => new ArrayBuffer(excelData.length),
    });
  
    const fileInput = screen.getByTestId('file-upload') as HTMLInputElement;
  
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [excelFile] } });
    });
  
    expect(screen.getByTestId('sheets')).not.toHaveTextContent("[]");
  });

  it('handles invalid file upload (wrong format)', async () => {
    global.alert = vi.fn();
  
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );
  
    const invalidFile = new File(["Hello, world!"], "invalid.txt", { type: "text/plain" });
  
    const fileInput = screen.getByTestId('file-upload') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
  
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Please upload a valid Excel file (.xlsx, .xls, or .csv)'));
  
    expect(fileInput.value).toBe('');
  });
  
  
    it('simulates concurrent updates (multiple file uploads)', async () => {
      render(
        <ExcelProvider>
          <MockConsumer />
        </ExcelProvider>
      );
    
      const mockWorkbook1 = XLSX.utils.book_new();
      const mockSheet1 = XLSX.utils.aoa_to_sheet([["Name", "Age"], ["Jane", 25]]);
      XLSX.utils.book_append_sheet(mockWorkbook1, mockSheet1, "Sheet1");
      const excelData1 = XLSX.write(mockWorkbook1, { bookType: "xlsx", type: "binary" });
      const validFile1 = new File([new Blob([excelData1])], "test1.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
      const mockWorkbook2 = XLSX.utils.book_new();
      const mockSheet2 = XLSX.utils.aoa_to_sheet([["Name", "Age"], ["John", 30]]);
      XLSX.utils.book_append_sheet(mockWorkbook2, mockSheet2, "Sheet2");
      const excelData2 = XLSX.write(mockWorkbook2, { bookType: "xlsx", type: "binary" });
      const validFile2 = new File([new Blob([excelData2])], "test2.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
      const fileInput = screen.getByTestId('file-upload') as HTMLInputElement;
    
      fireEvent.change(fileInput, { target: { files: [validFile1, validFile2] } });
    
      await waitFor(() => expect(screen.getByTestId('sheets')).toHaveTextContent("[]"));
      
      expect(screen.queryByTestId('sheets')).not.toHaveTextContent("Sheet2");
    });

  it('updates selected sheet when sheet is changed', async () => {
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );
  
    const fileInput = screen.getByTestId('file-upload') as HTMLInputElement;
    const mockFile = createMockFile();
  
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
    });
  
    await waitFor(() => expect(screen.getByTestId('sheets')).not.toHaveTextContent("[]"));
  
    const select = screen.getByTestId('sheet-selector') as HTMLSelectElement;
    
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Sheet1' } });
    });
  
    await waitFor(() => expect(screen.getByTestId('optimisticSheet')).toHaveTextContent('Sheet1'));
  });
  
  

  it('switches tabs correctly', () => {
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );

    fireEvent.click(screen.getByTestId('tab-json-to-excel'));
    expect(screen.getByTestId('activeTab')).toHaveTextContent(Tab.JSON_TO_EXCEL);

    fireEvent.click(screen.getByTestId('tab-excel-to-json'));
    expect(screen.getByTestId('activeTab')).toHaveTextContent(Tab.EXCEL_TO_JSON);
  });

  it('sets JSON input and converts JSON to Excel', async () => {
    render(
      <ExcelProvider>
        <MockConsumer />
      </ExcelProvider>
    );

    const textarea = screen.getByTestId('json-input') as HTMLTextAreaElement;
    const jsonString = '[{"name":"Alice","age":25}]';

    await act(async () => {
      fireEvent.change(textarea, { target: { value: jsonString } });
    });

    expect(textarea.value).toBe(jsonString);
  });
});
