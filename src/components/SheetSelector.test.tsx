import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SheetSelector from "./SheetSelector";
import * as ExcelContext from "../context/useExcel";
import { Tab } from "../types/Tab";

describe("SheetSelector Component", () => {
  const mockHandleSheetChange = vi.fn();
  
  beforeEach(() => {
    vi.spyOn(ExcelContext, 'useExcel').mockReturnValue({
      sheets: ["Sheet1", "Sheet2", "Sheet3"],
      optimisticSheet: "Sheet1",
      jsonData: '{"data": "example"}',
      handleFileChange: vi.fn(),
      handleSheetChange: mockHandleSheetChange,
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
    mockHandleSheetChange.mockReset();
  });

  it("renders with the correct sheet options", () => {
    render(<SheetSelector />);
    
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    
    expect(screen.getByText("Select sheet page")).toBeInTheDocument();
    
    expect(screen.getByText("Sheet1")).toBeInTheDocument();
    expect(screen.getByText("Sheet2")).toBeInTheDocument();
    expect(screen.getByText("Sheet3")).toBeInTheDocument();
  });

  it("sets the correct value from optimisticSheet", () => {
    render(<SheetSelector />);
    
    const selectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("Sheet1");
  });

  it("calls handleSheetChange when a different sheet is selected", () => {
    render(<SheetSelector />);
    
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "Sheet2" } });
    
    expect(mockHandleSheetChange).toHaveBeenCalledTimes(1);
  });

  it("applies the correct styling classes", () => {
    render(<SheetSelector />);
    
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveClass("w-full");
    expect(selectElement).toHaveClass("border");
    expect(selectElement).toHaveClass("p-2");
    expect(selectElement).toHaveClass("rounded");
    expect(selectElement).toHaveClass("mb-4");
  });

  it("has the default option disabled", () => {
    render(<SheetSelector />);
    
    const defaultOption = screen.getByText("Select sheet page") as HTMLOptionElement;
    expect(defaultOption.disabled).toBe(true);
  });
});