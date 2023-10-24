/* eslint-disable no-underscore-dangle */
// Need underscore to reference _id

/* eslint-disable no-console */
// For debugging

const mongoose = require('mongoose');
const Dummy = require('./models/dummy');
const Tea = require('./models/tea');
const TeaType = require('./models/teaType');
require('dotenv').config();

async function addDummy() {
  const dummy = new Dummy({ name: 'Test Dummy2', age: 0 });
  await dummy.save();
}

async function addTeas() {
  // Create tea type documents
  const blackTea = new TeaType({
    name: 'Black Tea',
    description: 'More oxidized and usually stronger in flavor than other teas',
  });

  const greenTea = new TeaType({
    name: 'Green Tea',
    description: 'Less withered and oxidized than black teas',
  });

  await Promise.all([blackTea.save(), greenTea.save()]);

  // Create tea documents
  const earlGrey = new Tea({
    name: 'Earl Grey',
    type: blackTea._id,
    brewTemp: 100,
  });

  const darjeeling = new Tea({
    name: 'Darjeeling',
    type: blackTea._id,
    brewTemp: 95,
  });

  const sencha = new Tea({
    name: 'Sencha',
    type: greenTea._id,
    brewTemp: 80,
  });

  const hojicha = new Tea({
    name: 'Hojicha',
    type: greenTea._id,
    brewTemp: 82,
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
