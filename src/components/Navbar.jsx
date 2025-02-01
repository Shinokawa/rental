import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>租赁管理系统</h1>
      <ul>
        <li><Link to="/">仪表盘</Link></li>
        <li><Link to="/properties">房源管理</Link></li>
        <li><Link to="/contracts">合同管理</Link></li>
        <li><Link to="/fees">费用管理</Link></li>
        <li><Link to="/tenants">客户管理</Link></li>
        <li><Link to="/payments">收银管理</Link></li>
        <li><Link to="/analysis">数据分析</Link></li>
        <li><Link to="/cashier" className="cashier-link">收银台</Link></li>
        {!token ? (
          <li><Link to="/login">登录</Link></li>
        ) : (
          <li><button onClick={handleLogout}>登出</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;