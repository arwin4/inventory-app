/* eslint-disable no-console */

const mongoose = require('mongoose');
const Dummy = require('./models/dummy');
const Tea = require('./models/tea');
const TeaCategory = require('./models/teaCategory');
require('dotenv').config();

async function addDummy() {
  const dummy = new Dummy({ name: 'Test Dummy2', age: 0 });
  await dummy.save();
}

async function addTeas() {
  // Create tea category documents
  const blackTea = new TeaCategory({
    name: 'Black Tea',
    description: 'More oxidized and usually stronger in flavor than other teas',
  });

  const greenTea = new TeaCategory({
    name: 'Green Tea',
    description: 'Less withered and oxidized than black teas',
  });

  await Promise.all([blackTea.save(), greenTea.save()]);

  // Create tea documents
  const earlGrey = new Tea({
    name: 'Earl Grey',
    category: blackTea._id,
    description:
      'Earl Grey is a black tea variety blended with the fragrant oil of bergamot oranges, lending it a distinctive citrus aroma and flavor',
    brewTemp: 100,
    price: 60,
    currentStock: 7,
  });

  const darjeeling = new Tea({
    name: 'Darjeeling',
    category: blackTea._id,
    description:
      'Grown in the Himalayan Darjeeling region of India, Darjeeling tea is a lightly oxidized black tea known for its floral and aromatic character',
    brewTemp: 95,
    price: 84.95,
    currentStock: 24,
  });

  const sencha = new Tea({
    name: 'Sencha',
    category: greenTea._id,
    description:
      'Sencha is a common Japanese green tea variety, characterized by its vibrant green color, mildly grassy flavor, and slightly sweet undertones',
    brewTemp: 80,
    price: 112.95,
    currentStock: 4,
  });

  const hojicha = new Tea({
    name: 'Hojicha',
    category: greenTea._id,
    description:
      'Hojicha is a roasted Japanese green tea made by roasting the leaves, resulting in a nutty, earthy flavor and a reddish-brown infusion',
    brewTemp: 82,
    price: 105.95,
    currentStock: 32,
  });

  await Promise.all([
    earlGrey.save(),
    darjeeling.save(),
    sencha.save(),
    hojicha.save(),
  ]);
}

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  const mongoString = process.env.MONGODB_CONNECTION_STRING;
  try {
    await mongoose.connect(mongoString);
  } catch (error) {
    console.log(error);
  }
  console.log('Connected. Populating database...');
  try {
    await Promise.all([addDummy(), addTeas()]);
    console.log('Database populated.');
  } catch (error) {
    console.log(error);
  }
  mongoose.connection.close();
  console.log('Connection closed.');
}

main();
