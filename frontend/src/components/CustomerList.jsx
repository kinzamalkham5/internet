import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faIdCard,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBox,
  faTachometerAlt,
  faDollarSign,
  faToggleOn,
  faToggleOff,
  faSearch,
  faFilter,
  faCheckCircle,
  faTimesCircle,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

function CustomerList({ customers = [], onCustomerStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [localCustomers, setLocalCustomers] = useState([]);

 
  useEffect(() => {
    console.log('CustomerList received customers:', customers);
    setLocalCustomers(customers || []);
  }, [customers]);

  const toggleStatus = async (customer) => {
    const newStatus = customer.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customer, status: newStatus })
      });

      if (response.ok) {
        const updatedCustomers = localCustomers.map(c => 
          c.id === customer.id ? { ...c, status: newStatus } : c
        );
        setLocalCustomers(updatedCustomers);
        
        if (onCustomerStatusChange) {
          onCustomerStatusChange();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

 
  const filteredCustomers = (localCustomers || []).filter(customer => {
    const matchesSearch = 
      (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.cnic || '').includes(searchTerm) ||
      (customer.phone || '').includes(searchTerm);
    
    const matchesStatus = 
      filterStatus === 'all' || 
      customer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  
  const formatCNIC = (cnic) => {
    if (!cnic) return 'N/A';
    if (cnic.length === 13 && !cnic.includes('-')) {
      return `${cnic.slice(0,5)}-${cnic.slice(5,12)}-${cnic.slice(12)}`;
    }
    return cnic;
  };

 
  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="status-badge active"><FontAwesomeIcon icon={faCheckCircle} /> Active</span>;
    } else {
      return <span className="status-badge inactive"><FontAwesomeIcon icon={faTimesCircle} /> Inactive</span>;
    }
  };

  return (
    <div>
      <h2 className="dashboard-title">
        <FontAwesomeIcon icon={faUsers} /> Customer List
      </h2>

     
      <div className="search-filter-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, CNIC or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      
      <div className="customer-stats">
        <div className="stat-chip">
          <FontAwesomeIcon icon={faUsers} /> Total: {localCustomers.length}
        </div>
        <div className="stat-chip active">
          <FontAwesomeIcon icon={faCheckCircle} /> Active: {localCustomers.filter(c => c.status === 'active').length}
        </div>
        <div className="stat-chip inactive">
          <FontAwesomeIcon icon={faTimesCircle} /> Inactive: {localCustomers.filter(c => c.status === 'inactive').length}
        </div>
      </div>

     
      {localCustomers.length === 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          No customers found. Total customers in state: {customers.length}
        </div>
      )}

     
      <div className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-avatar">
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="customer-title">
                  <h3>{customer.name}</h3>
                  <p>{customer.email}</p>
                </div>
                <button 
                  className={`status-toggle ${customer.status}`}
                  onClick={() => toggleStatus(customer)}
                  title={`Click to ${customer.status === 'active' ? 'deactivate' : 'activate'}`}
                >
                  {customer.status === 'active' ? (
                    <FontAwesomeIcon icon={faToggleOn} />
                  ) : (
                    <FontAwesomeIcon icon={faToggleOff} />
                  )}
                </button>
              </div>

              <div className="customer-card-body">
                <div className="info-row">
                  <FontAwesomeIcon icon={faIdCard} />
                  <span>{formatCNIC(customer.cnic)}</span>
                </div>
                <div className="info-row">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{customer.phone || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{customer.address || 'No address'}</span>
                </div>
                <div className="info-row">
                  <FontAwesomeIcon icon={faBox} />
                  <span>{customer.package}</span>
                </div>
                <div className="info-row">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  <span>{customer.mbSpeed} Mbps</span>
                </div>
                <div className="info-row">
                  <FontAwesomeIcon icon={faDollarSign} />
                  <span>${customer.fee}/month</span>
                </div>
              </div>

              <div className="customer-card-footer">
                {getStatusBadge(customer.status)}
                <span className="plan-badge">{customer.plan}</span>
                <span className="date-badge">
                  {new Date(customer.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <FontAwesomeIcon icon={faUsers} size="3x" />
            <h3>No customers found</h3>
            <p>Try adjusting your search or add new customers</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;