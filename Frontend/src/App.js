import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupForm from './pages/SignupPage';
import DashBoard from './pages/DashBoard';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/protectedRoute';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} /> 
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/dashboard' element={<ProtectedRoute component={DashBoard} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
