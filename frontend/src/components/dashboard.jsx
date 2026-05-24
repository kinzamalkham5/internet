import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faDollarSign,
  faBox,
  faClock,
  faTachometerAlt,
  faShoppingCart,
  faCog,
  faUserCog,
  faSpinner,
  faList,
  faChartBar,
  faClipboardList,
  faSignOutAlt,
  faBars,
  faChevronLeft,
  faChevronRight,
  faUser,
  faIdCard,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faPlus,
  faCheckCircle,
  faToggleOn,
  faToggleOff,
  faSearch,
  faFilter,
  faTimesCircle,
  faCircle
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import AddCustomer from './addcustomers';
import AddPackage from './AddPackage';
import CustomerList from './CustomerList';
import './Dashboard.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    revenue: 0,
    basicPlan: 0,
    premiumPlan: 0,
    totalPackages: 0
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetchDashboardData();
    fetchPackages();
  }, []);

  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statsssssssss
      const statsRes = await fetch('http://localhost:5000/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch customerssssssss
      const customersRes = await fetch('http://localhost:5000/api/customers');
      const customersData = await customersRes.json();
      setCustomers(customersData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch packagesssssssss
  const fetchPackages = async () => {
    try {
      const packagesRes = await fetch('http://localhost:5000/api/packages');
      const packagesData = await packagesRes.json();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
          <p>Loading dashboard...</p>
        </div>
      );
    }

    switch(activeSection) {
      case 'dashboard':
        return (
          <>
            <h2 className="dashboard-title">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard Overview
            </h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="stat-info">
                  <h3>Total Homes</h3>
                  <p className="stat-number">{stats.totalCustomers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="stat-info">
                  <h3>Active Members</h3>
                  <p className="stat-number">{stats.activeCustomers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div className="stat-info">
                  <h3>Monthly Revenue</h3>
                  <p className="stat-number">${stats.revenue}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faBox} />
                </div>
                <div className="stat-info">
                  <h3>Total Packages</h3>
                  <p className="stat-number">{stats.totalPackages || packages.length}</p>
                </div>
              </div>
            </div>

            <div className="recent-activities">
              <h3>
                <FontAwesomeIcon icon={faClock} /> Recent Customers
              </h3>
              <div className="activity-list">
                {customers.slice(0, 5).map(customer => (
                  <div key={customer.id} className="activity-item">
                    <span className="activity-time">
                      {new Date(customer.date).toLocaleDateString()}
                    </span>
                    <span className="activity-text">
                      <FontAwesomeIcon icon={faUser} /> {customer.name} - {customer.package} ({customer.mbSpeed})
                    </span>
                    <span className={`status-badge ${customer.status || 'active'}`}>
                      {customer.status || 'active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'customers':
        return (
          <AddCustomer 
            customers={customers}
            packages={packages}
            onCustomerAdded={() => {
              fetchDashboardData();
              fetchPackages();
            }}
            onCustomerDeleted={() => {
              fetchDashboardData();
              fetchPackages();
            }}
          />
        );

      case 'customerlist':
        return (
          <CustomerList 
            customers={customers}
            onCustomerStatusChange={fetchDashboardData}
          />
        );

      case 'packages':
        return (
          <AddPackage 
            packages={packages}
            onPackageAdded={() => {
              fetchPackages();
              fetchDashboardData();
            }}
            onPackageDeleted={() => {
              fetchPackages();
              fetchDashboardData();
            }}
            onPackageUpdated={() => {
              fetchPackages();
              fetchDashboardData();
            }}
          />
        );

      default:
       
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar activeMenu={activeSection} onMenuClick={setActiveSection} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;