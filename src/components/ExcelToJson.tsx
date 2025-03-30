import { useExcel } from '../context/useExcel';
import Button from './Button';
import FileUpload from './FileUpload';
import SheetSelector from './SheetSelector';

const ExcelToJson = () => {
    const { jsonData, downloadJson } = useExcel();
    return (
      <div className="mt-6 p-6 border border-blue-500 rounded-lg shadow-lg bg-white">
        <FileUpload />
        <SheetSelector />
        <textarea data-testid="excel-to-json-data" className="w-full border p-2 rounded mb-4" rows={10} value={jsonData} readOnly />
        <Button data-testid="download-button" label="Download JSON" className="bg-blue-500 text-green-500 px-4 py-2 rounded hover:bg-blue-600" onClick={downloadJson}/>

      </div>
    );
  };
  export default ExcelToJson