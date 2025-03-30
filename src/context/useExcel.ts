import { useContext } from "react";
import { ExcelContext, ExcelContextType } from "./ExcelContext";

export const useExcel = (): ExcelContextType => {
  const context = useContext(ExcelContext);

  if (context === undefined) {
    throw new Error('useExcel must be used within an ExcelProvider');
  }

  return context;
}