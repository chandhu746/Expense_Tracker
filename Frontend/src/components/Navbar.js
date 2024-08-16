import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout??')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };
  

  return (
    <nav className="navbar">
      <ul>
        <li><Link to='/'>Home</Link></li>
        {token ? (
          <>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/signup'>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
