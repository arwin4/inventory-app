const asyncHandler = require('express-async-handler');

const teaType = require('../models/teaType');

// Display list of all tea types
exports.index = asyncHandler(async (req, res) => {
  // const teaTypes = await teaType.find().sort({ name: 1 }).exec();
  // console.log(teaTypes);
  res.render('teaTypeList', {
    title: 'Tea Types',
    // teaTypes,
  });
});
