const express = require('express');
const router = express.Router();
const PackageModel = require('../models/PackageModel');
const CustomerModel = require('../models/CustomerModel');


router.get('/packages', (req, res) => {
  try {
    const packages = PackageModel.getAll();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/packages/:id', (req, res) => {
  try {
    const pkg = PackageModel.getById(parseInt(req.params.id));
    if (pkg) {
      res.json(pkg);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/packages', (req, res) => {
  try {
    const newPackage = PackageModel.create(req.body);
    console.log('✅ New package added:', newPackage);
    res.json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/packages/:id', (req, res) => {
  try {
    const updatedPackage = PackageModel.update(parseInt(req.params.id), req.body);
    if (updatedPackage) {
      res.json(updatedPackage);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/packages/:id', (req, res) => {
  try {
    const deleted = PackageModel.delete(parseInt(req.params.id));
    if (deleted) {
      res.json({ message: 'Package deleted successfully' });
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/stats', (req, res) => {
  try {
    const customers = CustomerModel.getAll();
    const packages = PackageModel.getAll();
    
    const total = customers.length;
    const basic = customers.filter(c => c.plan === 'basic').length;
    const premium = customers.filter(c => c.plan === 'premium').length;
    
    const totalRevenue = customers.reduce((sum, c) => sum + (c.fee || 0), 0);
    
    const stats = {
      totalCustomers: total,
      activeCustomers: total,
      revenue: totalRevenue,
      basicPlan: basic,
      premiumPlan: premium,
      totalPackages: packages.length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;