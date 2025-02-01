import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import PropertiesPage from './pages/PropertiesPage';
import ContractsPage from './pages/ContractsPage';
import FeesPage from './pages/FeesPage';
import TenantsPage from './pages/TenantsPage';
import PaymentManagementPage from './pages/PaymentManagementPage';
import DataAnalysisPage from './pages/DataAnalysisPage';
import EditPropertyPage from './pages/EditPropertyPage';
import EditContractPage from './pages/EditContractPage';
import CashierPage from './pages/CashierPage.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/payments" element={<PaymentManagementPage />} />
            <Route path="/analysis" element={<DataAnalysisPage />} />
            <Route path="/properties/new" element={<EditPropertyPage />} />
            <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
            <Route path="/contracts/new" element={<EditContractPage />} />
            <Route path="/contracts/:id/edit" element={<EditContractPage />} />
            <Route path="/cashier" element={<CashierPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;