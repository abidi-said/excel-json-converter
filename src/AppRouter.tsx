import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import JsonToExcel from './components/JsonToExcel';
import ExcelToJson from './components/ExcelToJson';
import TabNavigation from './components/TabNavigation';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <TabNavigation />
      <Routes>
        <Route path="/" element={<Navigate to="/excel-to-json" replace />} />
        <Route path="/excel-to-json" element={<ExcelToJson />} />
        <Route path="/json-to-excel" element={<JsonToExcel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;