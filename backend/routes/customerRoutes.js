const express = require('express');
const router = express.Router();
const CustomerModel = require('../models/CustomerModel');
const PackageModel = require('../models/PackageModel');


router.get('/customers', (req, res) => {
  const customers = CustomerModel.getAll();
  res.json(customers);
});


router.get('/customers/:id', (req, res) => {
  const customer = CustomerModel.getById(parseInt(req.params.id));
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});


router.post('/customers', (req, res) => {
 
  const pkg = PackageModel.getById(req.body.packageId);
  
  const customerData = {
    ...req.body,
    mbSpeed: pkg ? pkg.mbSpeed : 'N/A',
    status: 'active' 
  };
  
  const newCustomer = CustomerModel.create(customerData);
  console.log('✅ New customer added:', newCustomer);
  res.json(newCustomer);
});


router.put('/customers/:id', (req, res) => {
  const updatedCustomer = CustomerModel.update(parseInt(req.params.id), req.body);
  if (updatedCustomer) {
    console.log('✅ Customer updated:', updatedCustomer);
    res.json(updatedCustomer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});


router.delete('/customers/:id', (req, res) => {
  const deleted = CustomerModel.delete(parseInt(req.params.id));
  if (deleted) {
    res.json({ message: 'Customer deleted successfully' });
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

module.exports = router;