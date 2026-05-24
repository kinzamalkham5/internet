
let packages = [
  { 
    id: 1, 
    name: 'Basic 50 Mbps',
    mbSpeed: '50',
    price: 29.99,
    date: new Date() 
  },
  { 
    id: 2, 
    name: 'Standard 100 Mbps',
    mbSpeed: '100',
    price: 49.99,
    date: new Date() 
  },
  { 
    id: 3, 
    name: 'Premium 200 Mbps',
    mbSpeed: '200',
    price: 89.99,
    date: new Date() 
  }
];

const PackageModel = {
  getAll: () => {
    console.log(' Getting all  packages:', packages.length);
    return packages;
  },
  getById: (id) => {
    return packages.find(p => p.id === id);
  },
  create: (data) => {
    const newPackage = {
      id: packages.length + 1,
      ...data,
      date: new Date()
    };
    packages.push(newPackage);
    return newPackage;
  },
  update: (id, data) => {
    const index = packages.findIndex(p => p.id === id);
    if (index !== -1) {
      packages[index] = { ...packages[index], ...data };
      return packages[index];
    }
    return null;
  },
  delete: (id) => {
    const index = packages.findIndex(p => p.id === id);
    if (index !== -1) {
      packages.splice(index, 1);
      return true;
    }
    return false;
  }
};

module.exports = PackageModel;