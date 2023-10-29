const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const teaCategory = require('../models/teaCategory');
const Tea = require('../models/tea');

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
  const thisTea = await Tea.findById(teaID);
  const categoryId = thisTea.category[0]._id.toString();

  res.render('teaDetail', { tea: thisTea, categoryId });
});

// Add tea
exports.newTea = asyncHandler(async (req, res) => {
  const categoryId = req.query.category;

  let category;
  try {
    category = await teaCategory.findById(categoryId);
  } catch (error) {
    res.status(404).render('errors/404', { notFound: 'Category' });
  }

  res.render('forms/newTeaForm', { errors: null, category });
});

// Handle new tea form submission
exports.newTeaPost = [
  // Validate and sanitize
  body('name', 'Tea name must have at least one character')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('temp')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Brew temp cannot be empty')
    .toInt()
    .isInt({ min: 0 })
    .escape()
    .withMessage('Brew temp cannot be negative'),
  body('stock')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Number in stock cannot be empty')
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Number in stock cannot be negative')
    .escape(),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Price cannot be empty')
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative')
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const categoryId = req.query.category;
    let category;
    try {
      category = await teaCategory.findById(categoryId);
    } catch (error) {
      res.status(404).render('errors/404', { notFound: 'Category' });
    }

    const tea = new Tea({
      name: req.body.name,
      description: req.body.description,
      brewTemp: req.body.temp,
      currentStock: req.body.stock,
      price: req.body.price,
      category: categoryId,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error message(s).
      res.render('forms/newTeaForm', {
        tea,
        category,
        errors: errors.array(),
      });
    } else {
      // Data was valid
      const teaExists = await Tea.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 }) // case insensitive
        .exec();
      if (teaExists) {
        res.redirect(teaExists.url);
      } else {
        await tea.save();
        res.redirect(tea.url);
      }
    }
  }),
];

// Display tea update form
exports.updateTea = asyncHandler(async (req, res) => {
  const teaId = req.params.id;

  let tea;
  try {
    tea = await Tea.findById(teaId).exec();
  } catch (error) {
    res.status(404).render('errors/404', { notFound: 'Tea' });
    return;
  }

  res.render('forms/updateTea', { tea, errors: null });
});

// Handle tea update form submission
exports.updateTeaPost = [
  // Validate and sanitize
  body('name', 'Tea name must have at least one character')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('temp')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Brew temp cannot be empty')
    .toInt()
    .isInt({ min: 0 })
    .escape()
    .withMessage('Brew temp cannot be negative'),
  body('stock')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Number in stock cannot be empty')
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Number in stock cannot be negative')
    .escape(),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Price cannot be empty')
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative')
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const teaId = req.params.id;
    let categoryId;
    try {
      const tea = await Tea.findById(teaId);
      categoryId = tea.category[0]._id;
    } catch (error) {
      res.status(404).render('errors/404', { notFound: 'Category' });
    }

    const newTea = new Tea({
      name: req.body.name,
      description: req.body.description,
      brewTemp: req.body.temp,
      currentStock: req.body.stock,
      price: req.body.price,
      category: categoryId,
      _id: teaId, // create new object with old id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error message(s).
      res.render('forms/newTeaForm/', {
        newTea,
        errors: errors.array(),
      });
    } else {
      // Data was valid, so update
      await Tea.findByIdAndUpdate(teaId, newTea);
      res.redirect(newTea.url);
    }
  }),
];

// Delete tea
exports.deleteTea = asyncHandler(async (req, res) => {
  const teaId = req.params.id;
  try {
    await Tea.findByIdAndDelete(teaId);
  } catch (error) {
    res.status(404).render('errors/404', { notFound: 'Tea' });
    return;
  }
  res.redirect('/catalog');
});
