import { useExcel } from "../context/useExcel";

const SheetSelector = () => {
  const { sheets, optimisticSheet, handleSheetChange } = useExcel();

  return (
    <select
      data-testid="sheet-select"
      className="w-full border p-2 rounded mb-4"
      value={optimisticSheet || ""}
      onChange={handleSheetChange}
    >
      <option value="" disabled>Select sheet page</option>
      {sheets.map((sheet, index) => (
        <option key={index} value={sheet}>
          {sheet}
        </option>
      ))}
    </select>
  );
};

export default SheetSelector;
