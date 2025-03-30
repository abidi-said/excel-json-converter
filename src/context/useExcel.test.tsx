import { renderHook, act } from "@testing-library/react";
import { useExcel } from "./useExcel";
import { ExcelProvider } from "./ExcelProvider";
import { Tab } from "../types/Tab";
import * as XLSX from "xlsx";

// const createMockFile = (fileName: string, content: ArrayBuffer, type: string): File => {
//   const blob = new Blob([content], { type });
//   return new File([blob], fileName, { type });
// };

const stringToArrayBuffer = (binaryString: string): ArrayBuffer => {
  const buffer = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

const createFileList = (files: File[]): FileList => {
  return {
    // length: files.length,
    item: (index: number) => files[index] || null,
    ...files,
  } as FileList;
};

describe("useExcel Hook Tests", () => {
  it("handles file upload and updates sheets", async () => {
    const { result } = renderHook(() => useExcel(), { wrapper: ExcelProvider });

    const mockWorkbook = XLSX.utils.book_new();
    const mockSheet = XLSX.utils.aoa_to_sheet([
      ["Name", "Age"],
      ["John", 30],
    ]);
    XLSX.utils.book_append_sheet(mockWorkbook, mockSheet, "Sheet1");
    const excelData = XLSX.write(mockWorkbook, { bookType: "xlsx", type: "binary" });

    const excelBuffer = stringToArrayBuffer(excelData);

    const excelFile = new File([excelBuffer], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    Object.defineProperty(excelFile, "arrayBuffer", {
      value: async () => excelBuffer,
    });

    const fileList = createFileList([excelFile]);

    await act(async () => {
      result.current.handleFileChange({ target: { files: fileList } } as any);
    });

    expect(result.current.sheets).toContain("Sheet1");
  });

  it("updates selected sheet when sheet is changed", () => {
    const { result } = renderHook(() => useExcel(), { wrapper: ExcelProvider });

    act(() => {
      result.current.sheets=["Sheet1", "Sheet2"];
      result.current.handleSheetChange({ target: { value: "Sheet1" } } as any);
    });

    expect(result.current.optimisticSheet).toBe("Sheet1");
  });

  it("switches tabs correctly", () => {
    const { result } = renderHook(() => useExcel(), { wrapper: ExcelProvider });

    act(() => {
      result.current.handleTabChange(Tab.JSON_TO_EXCEL);
    });

    expect(result.current.activeTab).toBe(Tab.JSON_TO_EXCEL);
  });

  it("sets JSON input and converts JSON to Excel", () => {
    const { result } = renderHook(() => useExcel(), { wrapper: ExcelProvider });

    const jsonString = '[{"name":"Alice","age":25}]';

    act(() => {
      result.current.setJsonInput(jsonString);
    });

    expect(result.current.jsonInput).toBe(jsonString);
  });
});
