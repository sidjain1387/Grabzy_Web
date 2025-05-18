import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import Customer_Dashboard from '../components/Customer/DashBoard/DashBoard';
import ProtectedRoute from '../components/protected/Protected_Route';
import PublicRoute from '../components/public/public';
import Customer_Restaurant from '../components/Customer/Restaurant/Restaurant';
import Customer_Menu from '../components/Customer/Menu/Menu';
import Owner_Dashboard from '../components/Owner/DashBoard/DashBoard';
import Owner_Restaurant from '../components/Owner/Restaurant/Restaurant_List';
import Owner_Add_Restaurant from '../components/Owner/Restaurant/Add_Restaurant';
import Owner_MenuItems_List from '../components/Owner/Menu/MenuList';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/customer-dashboard" element={<Customer_Dashboard />} />
        <Route path="/customer-restaurant" element={<Customer_Restaurant />} />
        <Route path="/customer-menu/:restaurantId" element={<Customer_Menu />} />
        {/* Add more protected routes here */}
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/owner-dashboard" element={<Owner_Dashboard />} />
        <Route path="/owner-restaurant" element={<Owner_Restaurant />} />
        <Route path="/owner-add-restaurant" element={<Owner_Add_Restaurant />} />
        <Route path="/owner-menu-items/:restaurantId" element={<Owner_MenuItems_List />} />
        {/* <Route path="/customer-restaurant" element={<Customer_Restaurant />} /> */}
        {/* Add more protected routes here */}
      </Route>

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;
