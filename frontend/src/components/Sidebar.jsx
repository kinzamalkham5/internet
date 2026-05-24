import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faUsers,
  faBox,
  faClipboardList,
  faUserCog,
  faCog,
  faSignOutAlt,
  faBars,
  faChevronLeft,
  faChevronRight,
  faList
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ onMenuClick, activeMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: faChartBar, label: 'Dashboard' },
    { id: 'customers', icon: faUsers, label: 'Add Customers' },
    { id: 'packages', icon: faBox, label: 'Add Packages' },
    { id: 'customerlist', icon: faList, label: 'Customer List' }, 
    { id: 'orders', icon: faClipboardList, label: 'Orders' },
    { id: 'users', icon: faUserCog, label: 'Users' },
    { id: 'settings', icon: faCog, label: 'Settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    alert('👋 Logged out successfully!');
    navigate('/');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">
          {collapsed ? <FontAwesomeIcon icon={faBars} /> : 'InternetPro'}
        </h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => onMenuClick(item.id)}
          >
            <span className="nav-icon">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div 
          className="nav-item logout-btn" 
          onClick={handleLogout}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;