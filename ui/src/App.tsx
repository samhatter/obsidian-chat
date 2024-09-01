import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Shared/utils/ProtectedRoute';
import { AuthProvider } from './Shared/utils/AuthContext';
import Login from './Pages/Login';
import Home from './Pages/Home';
import CreateAccount from './Pages/CreateAccount';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
