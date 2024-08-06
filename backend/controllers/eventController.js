const Event = require('../models/eventModel');

const getAllEvent = async (req, res) => {
  try {
    const event = await Event.find()
      .populate('owner')
      .populate('audience.attendee');
    event.sort((a, b) => b.created_at - a.created_at);
    res.status(200).json({
      result: event,
      message: 'All events fetched successfully'
    });
  } catch (error) {
    console.error('Error getting all events:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }
    const event = await Event.findById(id)
      .populate('owner')
      .populate('audience.attendee');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      result: event,
      message: 'Event fetched successfully'
    });
  } catch (error) {
    console.error('Error getting Event:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the Event' });
  }
};

const searchEvent = async (req, res) => {
  try {
    const { q } = req.query;
    const Event = await Event.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { token_name: { $regex: q, $options: 'i' } }
      ]
    });
    return res.status(200).json({
      result: Event,
      message: 'Search results fetched successfully'
    });
  } catch (error) {
    console.error('Error searching Event:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllEvent, getSingleEvent, searchEvent };
