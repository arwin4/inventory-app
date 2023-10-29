const asyncHandler = require('express-async-handler');

const teaCategory = require('../models/teaCategory');
const tea = require('../models/tea');

// Display list of all tea categories
exports.index = asyncHandler(async (req, res) => {
  const numberOfTeaCategories = await teaCategory.countDocuments({}).exec();
  const allTeaCategories = await teaCategory.find().exec();
  res.render('teaCategoryList', {
    title: 'Tea Categories',
    numberOfTeaCategories,
    allTeaCategories,
  });
});

// Display detail page for specific tea
exports.teaDetail = asyncHandler(async (req, res) => {
  const teaID = req.params.id;
  const thisTea = await tea.findById(teaID);
  const categoryId = thisTea.category[0]._id.toString();

  res.render('teaDetail', { tea: thisTea, categoryId });
});

// Delete tea
exports.deleteTea = asyncHandler(async (req, res) => {
  const teaId = req.params.id;
  try {
    await tea.findByIdAndDelete(teaId);
  } catch (error) {
    res.status(404).render('errors/404', { notFound: 'Tea' });
    return;
  }
  res.redirect('/catalog');
});
