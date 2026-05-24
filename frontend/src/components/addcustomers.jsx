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
  faTrash,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

function AddCustomer({ customers, packages = [], onCustomerAdded, onCustomerDeleted }) {
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    cnic: '',
    email: '', 
    phone: '', 
    address: '',
    packageId: 1,
    packageName: '',
    mbSpeed: '',
    price: 0
  });


  useEffect(() => {
    if (packages && packages.length > 0) {
      
      const defaultPkg = packages[0];
      setNewCustomer(prev => ({
        ...prev,
        packageId: defaultPkg.id,
        packageName: defaultPkg.name,
        mbSpeed: defaultPkg.mbSpeed,
        price: defaultPkg.price
      }));
    }
  }, [packages]);

  
  useEffect(() => {
    if (packages && packages.length > 0) {
      const selectedPackage = packages.find(p => p.id === newCustomer.packageId);
      if (selectedPackage) {
        setNewCustomer(prev => ({
          ...prev,
          packageName: selectedPackage.name,
          mbSpeed: selectedPackage.mbSpeed,
          price: selectedPackage.price
        }));
      }
    }
  }, [newCustomer.packageId, packages]);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.cnic || !newCustomer.email) {
      alert('Please fill in Name, CNIC and Email');
      return;
    }

   
    const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$|^[0-9]{13}$/;
    if (!cnicPattern.test(newCustomer.cnic)) {
      alert('Please enter a valid CNIC (format: 12345-1234567-1)');
      return;
    }

    try {
      const customerData = {
        name: newCustomer.name,
        cnic: newCustomer.cnic,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        packageId: newCustomer.packageId,
        package: newCustomer.packageName,
        mbSpeed: newCustomer.mbSpeed,
        fee: newCustomer.price,
        plan: newCustomer.price > 50 ? 'premium' : 'basic'
      };

      const response = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });

      if (response.ok) {
        alert('✅ Customer added successfully!');
       
        if (packages && packages.length > 0) {
          setNewCustomer({ 
            name: '', 
            cnic: '',
            email: '', 
            phone: '', 
            address: '',
            packageId: packages[0].id,
            packageName: packages[0].name,
            mbSpeed: packages[0].mbSpeed,
            price: packages[0].price
          });
        }
        onCustomerAdded();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Cannot connect to backend');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Delete this customer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Customer deleted');
          onCustomerDeleted();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

 
  const formatCNIC = (cnic) => {
    if (!cnic) return 'N/A';
    if (cnic.length === 13 && !cnic.includes('-')) {
      return `${cnic.slice(0,5)}-${cnic.slice(5,12)}-${cnic.slice(12)}`;
    }
    return cnic;
  };

  return (
    <div>
      <h2 className="dashboard-title">
        <FontAwesomeIcon icon={faUser} /> Add New Customer
      </h2>
      
      <div className="add-customer-form">
        <input
          type="text"
          placeholder="Customer Name *"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="CNIC (12345-1234567-1) *"
          value={newCustomer.cnic}
          onChange={(e) => setNewCustomer({...newCustomer, cnic: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email *"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
        />
        <input
          type="text"
          placeholder="Full Address"
          value={newCustomer.address}
          onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
        />
        
       
        <div className="package-selection">
          <label>Select Package:</label>
          <select 
            value={newCustomer.packageId} 
            onChange={(e) => setNewCustomer({...newCustomer, packageId: parseInt(e.target.value)})}
            className="package-select"
          >
            {packages && packages.length > 0 ? (
              packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.mbSpeed} Mbps (${pkg.price}/month)
                </option>
              ))
            ) : (
              <option value="">No packages available - Add packages first</option>
            )}
          </select>
        </div>

      
        {newCustomer.packageName && (
          <div className="package-details">
            <div className="package-detail-item">
              <FontAwesomeIcon icon={faBox} />
              <span><strong>Package:</strong> {newCustomer.packageName}</span>
            </div>
            <div className="package-detail-item">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span><strong>Speed:</strong> {newCustomer.mbSpeed} Mbps</span>
            </div>
            <div className="package-detail-item">
              <FontAwesomeIcon icon={faDollarSign} />
              <span><strong>Monthly Fee:</strong> ${newCustomer.price}</span>
            </div>
          </div>
        )}

        <button className="add-btn" onClick={handleAddCustomer}>
          <FontAwesomeIcon icon={faCheckCircle} /> Add Customer
        </button>
      </div>

      <h3 style={{marginTop: '30px', marginBottom: '15px'}}>
        <FontAwesomeIcon icon={faUser} /> Customer List
      </h3>
      <div className="customer-list">
        {customers && customers.length > 0 ? (
          customers.map(c => (
            <div key={c.id} className="customer-item">
              <div className="customer-info">
                <strong>{c.name}</strong>
                <br />
                <small>
                  <FontAwesomeIcon icon={faIdCard} /> {formatCNIC(c.cnic)} |{' '}
                  <FontAwesomeIcon icon={faEnvelope} /> {c.email}
                  <br />
                  <FontAwesomeIcon icon={faBox} /> {c.package} |{' '}
                  <FontAwesomeIcon icon={faTachometerAlt} /> {c.mbSpeed} Mbps |{' '}
                  <FontAwesomeIcon icon={faDollarSign} /> ${c.fee}/month
                </small>
              </div>
              <div className="customer-actions">
                <span className={`badge ${c.plan}`}>{c.plan}</span>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteCustomer(c.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No customers added yet</p>
        )}
      </div>
    </div>
  );
}

export default AddCustomer;