const asyncHandler = require('express-async-handler');

const teaType = require('../models/teaType');
const tea = require('../models/tea');

// Display list of all tea types
exports.index = asyncHandler(async (req, res) => {
  const numberOfTeaTypes = await teaType.countDocuments({}).exec();
  const allTeaTypes = await teaType.find().exec();
  res.render('teaTypeList', {
    title: 'Tea Types',
    numberOfTeaTypes,
    allTeaTypes,
  });
});

// Display detail page for specific tea type
exports.typeDetail = asyncHandler(async (req, res) => {
  const typeID = req.params.id;

  // Get type info
  const type = await teaType.findById(typeID).exec();

  // Find all teas of this type
  const teasOfThisType = await tea.find({ type: { _id: typeID } }).exec();

  res.render('typeDetail', {
    type,
    teasOfThisType,
  });
});
