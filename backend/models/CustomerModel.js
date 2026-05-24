
let customers = [
  { 
    id: 1, 
    name: 'kinza', 
    cnic: '12345-1234567-1',
    email: 'kinza@example.com', 
    phone: '123-456-7890', 
    address: '123 Main St, New York, NY 10001',
    packageId: 1,
    package: 'Basic 50 Mbps',
    mbSpeed: '50',
    fee: 29.99,
    plan: 'basic',
    status: 'active', 
    date: new Date() 
  },
  { 
    id: 2, 
    name: 'ali', 
    cnic: '54321-7654321-2',
    email: 'alii@example.com', 
    phone: '098-765-4321', 
    address: '456 Oak Ave, Los Angeles, CA 90001',
    packageId: 3,
    package: 'Premium 200 Mbps',
    mbSpeed: '200',
    fee: 89.99,
    plan: 'premium',
    status: 'inactive', 
    date: new Date() 
  }
];

const CustomerModel = {
  getAll: () => customers,
  getById: (id) => customers.find(c => c.id === id),
  create: (data) => {
    const newCustomer = {
      id: customers.length + 1,
      ...data,
      status: data.status || 'active', 
      date: new Date()
    };
    customers.push(newCustomer);
    return newCustomer;
  },
  update: (id, data) => {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...data };
      return customers[index];
    }
    return null;
  },
  delete: (id) => {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
      return true;
    }
    return false;
  }
};

module.exports = CustomerModel;