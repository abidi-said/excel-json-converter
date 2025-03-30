import { createContext } from "react";
import { Tab } from "../types/Tab";

// Context Type Definition
export type ExcelContextType = {
  sheets: string[];
  optimisticSheet: string;
  jsonData: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSheetChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  downloadJson: () => void;
  activeTab: Tab;
  handleTabChange: (tab: Tab) => void;
  jsonInput: string;
  setJsonInput: React.Dispatch<React.SetStateAction<string>>;
  convertJsonToExcel: () => void;
};

export const ExcelContext = createContext<ExcelContextType | undefined>(undefined);