import { useExcel } from "../context/useExcel";
import Button from "./Button";


const JsonToExcel = () => {
    const { jsonInput, setJsonInput, convertJsonToExcel } = useExcel();
    return (
      <div className="mt-6 p-6 border border-blue-500 rounded-lg shadow-lg bg-white">
        <textarea data-testid="json-to-excel-data" className="w-full border p-2 rounded mb-4" rows={10} placeholder="Paste JSON here..." value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
        <Button data-testid="convert-json-button" label="Convert to Excel" className="bg-blue-500 text-green-500 px-4 py-2 rounded hover:bg-blue-600" onClick={convertJsonToExcel}/>

      </div>
    );
  };
  export default JsonToExcel