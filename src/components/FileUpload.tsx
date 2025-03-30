import { useExcel } from "../context/useExcel";

const FileUpload = () => {
    const { handleFileChange } = useExcel();
    return (
      <input data-testid="file-input" type="file" className="w-full border p-2 rounded mb-4" onChange={handleFileChange} />
    );
};

export default FileUpload