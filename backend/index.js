const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const packageRoutes = require('./routes/packageRoutes');
const app = express();

app.use(cors());
app.use(express.json());

let customers = [
  { 
    id: 1, 
    name: 'kinza', 
    cnic: '12345-1234567-1',
    email: 'kinza@example.com', 
    phone: '123-456-7890', 
    address: '123 Main St, New York, NY 10001',
    plan: 'basic',
    package: 'monthly',
    fee: 29.99,
    date: new Date() 
  },
  { 
    id: 2, 
    name: 'ali', 
    cnic: '54321-7654321-2',
    email: 'ali@example.com', 
    phone: '098-765-4321', 
    address: '456 Oak Ave, Los Angeles, CA 90001',
    plan: 'premium',
    package: 'yearly',
    fee: 899.99,
    date: new Date() 
  }
];


app.get('/api/customers', (req, res) => {
  console.log('📋 Sending customers list');
  res.json(customers);
});


app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    ...req.body,
    date: new Date()
  };
  customers.push(newCustomer);
  console.log('✅ New customer added:', {
    id: newCustomer.id,
    name: newCustomer.name,
    cnic: newCustomer.cnic,
    email: newCustomer.email,
    phone: newCustomer.phone,
    address: newCustomer.address,
    plan: newCustomer.plan,
    package: newCustomer.package,
    fee: newCustomer.fee
  });
  res.json(newCustomer);
});


app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.filter(c => c.id !== id);
  console.log('🗑️ Customer deleted. Total customers:', customers.length);
  res.json({ message: 'Deleted' });
});


app.get('/api/stats', (req, res) => {
  const total = customers.length;
  const basic = customers.filter(c => c.plan === 'basic').length;
  const premium = customers.filter(c => c.plan === 'premium').length;
  const monthly = customers.filter(c => c.package === 'monthly').length;
  const yearly = customers.filter(c => c.package === 'yearly').length;
  
  
  const totalRevenue = customers.reduce((sum, c) => sum + (c.fee || 0), 0);
  
  const stats = {
    totalCustomers: total,
    activeCustomers: total,
    revenue: totalRevenue || total * 50,
    basicPlan: basic,
    premiumPlan: premium,
    monthlySubs: monthly,
    yearlySubs: yearly
  };
  
  console.log('📊 Stats:', stats);
  res.json(stats);
});
// Routes
app.use('/api', customerRoutes);
app.use('/api', packageRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
 
});