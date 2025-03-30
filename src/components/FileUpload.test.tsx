import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import FileUpload from "./FileUpload";
import * as ExcelContext from "../context/useExcel";
import { Tab } from "../types/Tab";

describe("FileUpload Component", () => {
  const mockHandleFileChange = vi.fn();
  
  beforeEach(() => {

    vi.spyOn(ExcelContext, 'useExcel').mockReturnValue({
      sheets: ["Sheet1", "Sheet2", "Sheet3"],
      optimisticSheet: "Sheet1",
      jsonData: '{"data": "example"}',
      handleFileChange: mockHandleFileChange,
      handleSheetChange: vi.fn(),
      downloadJson: vi.fn(),
      activeTab: Tab.EXCEL_TO_JSON,
      handleTabChange: vi.fn(),
      jsonInput: '',
      setJsonInput: vi.fn(),
      convertJsonToExcel: vi.fn()
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockHandleFileChange.mockReset();
  });

  it("renders a file input element", () => {
    const { container } = render(<FileUpload />);
    
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it("applies the correct styling classes", () => {
    const { container } = render(<FileUpload />);
    
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toHaveClass("w-full");
    expect(fileInput).toHaveClass("border");
    expect(fileInput).toHaveClass("p-2");
    expect(fileInput).toHaveClass("rounded");
    expect(fileInput).toHaveClass("mb-4");
  });

  it("calls handleFileChange when a file is selected", () => {
    const { container } = render(<FileUpload />);
    
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).not.toBeNull();
    
    if (fileInput) {
      const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      expect(mockHandleFileChange).toHaveBeenCalledTimes(1);
    }
  });
});