const express = require('express');
const {
  getAllEvent,
  searchEvent,
  getSingleEvent
} = require('../controllers/eventController');

const eventRouter = express.Router();

eventRouter
  .get('/get-all', getAllEvent)
  .get('/search', searchEvent)
  .get('/get/:id', getSingleEvent);

module.exports = eventRouter;
