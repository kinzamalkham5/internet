import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faTachometerAlt,
  faDollarSign,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

function AddPackage({ packages, onPackageAdded, onPackageDeleted, onPackageUpdated }) {
  const [newPackage, setNewPackage] = useState({ 
    name: '', 
    mbSpeed: '',
    price: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.mbSpeed || !newPackage.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPackage.name,
          mbSpeed: newPackage.mbSpeed,
          price: parseFloat(newPackage.price)
        })
      });

      if (response.ok) {
        alert('✅ Package added successfully!');
        setNewPackage({ name: '', mbSpeed: '', price: '' });
        onPackageAdded();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Cannot connect to backend');
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/packages/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Package deleted successfully');
          onPackageDeleted();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Cannot connect to backend');
      }
    }
  };

  const startEdit = (pkg) => {
    setEditingId(pkg.id);
    setEditForm({
      name: pkg.name,
      mbSpeed: pkg.mbSpeed,
      price: pkg.price
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleUpdatePackage = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          mbSpeed: editForm.mbSpeed,
          price: parseFloat(editForm.price)
        })
      });

      if (response.ok) {
        alert('✅ Package updated successfully!');
        setEditingId(null);
        onPackageUpdated();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Cannot connect to backend');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div>
      <h2 className="dashboard-title">
        <FontAwesomeIcon icon={faBox} /> Add New Package
      </h2>
      
      <div className="add-customer-form">
        <input
          type="text"
          placeholder="Package Name (e.g., Basic 50 Mbps)"
          value={newPackage.name}
          onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
        />
        <input
          type="number"
          placeholder="Speed (Mbps)"
          value={newPackage.mbSpeed}
          onChange={(e) => setNewPackage({...newPackage, mbSpeed: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price ($)"
          step="0.01"
          value={newPackage.price}
          onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
        />
        <button className="add-btn" onClick={handleAddPackage}>
          <FontAwesomeIcon icon={faPlus} /> Add Package
        </button>
      </div>

      <h3 style={{marginTop: '30px', marginBottom: '15px'}}>Available Packages</h3>
      <div className="customer-list">
        {packages && packages.length > 0 ? (
          packages.map(pkg => (
            <div key={pkg.id} className="customer-item">
              {editingId === pkg.id ? (
                // Edit Mode
                <div className="edit-form" style={{width: '100%'}}>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditChange}
                    placeholder="Package Name"
                    style={{marginBottom: '10px', padding: '8px', width: '100%'}}
                  />
                  <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <input
                      type="number"
                      name="mbSpeed"
                      value={editForm.mbSpeed || ''}
                      onChange={handleEditChange}
                      placeholder="Speed (Mbps)"
                      style={{padding: '8px', flex: 1}}
                    />
                    <input
                      type="number"
                      name="price"
                      value={editForm.price || ''}
                      onChange={handleEditChange}
                      placeholder="Price ($)"
                      step="0.01"
                      style={{padding: '8px', flex: 1}}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button className="add-btn" onClick={() => handleUpdatePackage(pkg.id)}>
                      <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                    <button className="delete-btn" onClick={cancelEdit}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="customer-info">
                    <strong>{pkg.name}</strong>
                    <br />
                    <small>
                      <FontAwesomeIcon icon={faTachometerAlt} /> {pkg.mbSpeed} Mbps |{' '}
                      <FontAwesomeIcon icon={faDollarSign} /> ${pkg.price}/month
                    </small>
                  </div>
                  <div className="customer-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(pkg)}
                      title="Edit Package"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePackage(pkg.id)}
                      title="Delete Package"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-data">No packages added yet. Add your first package above!</p>
        )}
      </div>
    </div>
  );
}

export default AddPackage;