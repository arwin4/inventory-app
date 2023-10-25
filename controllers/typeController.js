const asyncHandler = require('express-async-handler');

const teaType = require('../models/teaType');

// Display list of all tea types
exports.index = asyncHandler(async (req, res) => {
  const numberOfTeaTypes = await teaType.countDocuments({}).exec();
  res.render('teaTypeList', {
    title: 'Tea Types',
    numberOfTeaTypes,
  });
});

// Display detail page for specific tea type
exports.typeDetail = asyncHandler(async (req, res) => {
  const type = await teaType.findById(req.params.id).exec();

  res.render('typeDetail', {
    type,
  });
});
