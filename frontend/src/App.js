import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InternList from './pages/InternList';
import AddIntern from './pages/AddIntern';
import EditIntern from './pages/EditIntern';
import TaskManagement from './pages/TaskManagement';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="interns" element={<InternList />} />
          <Route path="interns/add" element={<AddIntern />} />
          <Route path="interns/edit/:id" element={<EditIntern />} />
          <Route path="tasks" element={<TaskManagement />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;