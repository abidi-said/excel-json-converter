'use client';

import { useState, useOptimistic, ReactNode } from "react";
import * as XLSX from "xlsx";
import { ExcelContext } from "./ExcelContext";
import { Tab } from "../types/Tab";

type ExcelProviderProps = {
  children: ReactNode;
};

export function ExcelProvider({ children }: ExcelProviderProps) {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [jsonData, setJsonData] = useState<string>("");
  const [optimisticSheet, setOptimisticSheet] = useOptimistic<string>(selectedSheet);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EXCEL_TO_JSON);
  const [jsonInput, setJsonInput] = useState<string>("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // Check file extension first
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'csv'];
    
    if (!validExtensions.includes(fileExtension || '')) {
      alert('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      // Reset the file input
      event.target.value = '';
      return;
    }
  
    try {
      const bufferArray = await file.arrayBuffer();
      if (!bufferArray) return;
      
      const workbook = XLSX.read(bufferArray, { type: "buffer" });
      
      // Validate that workbook has sheets
      if (workbook && workbook.SheetNames && workbook.SheetNames.length > 0) {
        setSheets(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0]);
        convertToJson(workbook, workbook.SheetNames[0]);
      } else {
        throw new Error('No sheets found in the workbook');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Could not process the file. Please ensure it is a valid Excel file.');
      // Reset the file input
      event.target.value = '';
    }
  };

  const convertToJson = (workbook: XLSX.WorkBook, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setJsonData(JSON.stringify(json, null, 4));
  };

  const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOptimisticSheet(event.target.value);
    setSelectedSheet(event.target.value);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSheet}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isValidJson = (input: string): boolean => {
    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "object" && parsed !== null;
    } catch (error) {
      return false;
    }
  };
  
  const convertJsonToExcel = () => {
    if (!isValidJson(jsonInput)) {
      alert("Invalid JSON format. Please enter a valid JSON object or array.");
      return;
    }
  
    try {
      let jsonObject = JSON.parse(jsonInput);
  
      if (!Array.isArray(jsonObject)) {
        jsonObject = [jsonObject]; // Ensure it's an array
      }
  
      const worksheet = XLSX.utils.json_to_sheet(jsonObject);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "converted.xlsx");
    } catch (error) {
      alert("An error occurred while converting JSON to Excel.");
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <ExcelContext.Provider 
      value={{ 
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
      }}
    >
      {children}
    </ExcelContext.Provider>
  );
}