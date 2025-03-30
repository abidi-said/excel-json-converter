import { useExcel } from "../context/useExcel";
import Button from "./Button";
import { Tab } from "../types/Tab";
import { Link } from "react-router-dom";

const TabLabels = {
  [Tab.EXCEL_TO_JSON]: "Excel To JSON",
  [Tab.JSON_TO_EXCEL]: "JSON To Excel",
};
const TabNavigation = () => {
  const { activeTab, handleTabChange } = useExcel();

  return (
    <nav className="bg-gray-100 p-4 rounded-lg shadow flex justify-between">
      <span className="text-xl font-semibold">Excel Converter</span>
      <div>
        <Link to="/excel-to-json">
          <Button data-testid="excel-to-json" label={TabLabels[Tab.EXCEL_TO_JSON]} className={`mr-2 rounded-l ${activeTab === Tab.EXCEL_TO_JSON ? "bg-blue-500 text-blue-500" : "bg-gray-300"}`} onClick={() => handleTabChange(Tab.EXCEL_TO_JSON)} />
        </Link>
        <Link to="/json-to-excel">
          <Button data-testid="json-to-excel" label={TabLabels[Tab.JSON_TO_EXCEL]} className={`rounded-r ${activeTab === Tab.JSON_TO_EXCEL ? "bg-blue-500 text-blue-500" : "bg-gray-300"}`} onClick={() => handleTabChange(Tab.JSON_TO_EXCEL)} />
        </Link>
      </div>
    </nav>
  );
};
export default TabNavigation