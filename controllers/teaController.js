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

// Display detail page for specific tea
exports.teaDetail = asyncHandler(async (req, res) => {
  const teaID = req.params.id;
  const thisTea = await tea.findById(teaID);
  const typeId = thisTea.type[0]._id.toString();

  res.render('teaDetail', { tea: thisTea, typeId });
});
