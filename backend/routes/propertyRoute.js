const express = require('express');
const {
  getAllProperty,
  getSingleProperty,
  searchProperty
} = require('../controllers/propertyController');

const propertyRouter = express.Router();

propertyRouter
  .get('/get-all', getAllProperty) // ✅
  .get('/search', searchProperty)
  .get('/get/:id', getSingleProperty); // ✅

module.exports = propertyRouter;
