const Property = require('../models/propertyModel');

const getAllProperty = async (req, res) => {
  try {
    const property = await Property.find()
      .populate('owner')
      .populate('investors.investor');
    property.sort((a, b) => b.created_at - a.created_at);
    res.status(200).json({
      result: property,
      message: 'All properties fetched successfully'
    });
  } catch (error) {
    console.error('Error getting all properties:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSingleProperty = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }
    const property = await Property.findById(id)
      .populate('owner')
      .populate('investors.investor');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({
      result: property,
      message: 'Property fetched successfully'
    });
  } catch (error) {
    console.error('Error getting property:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the property' });
  }
};

const searchProperty = async (req, res) => {
  try {
    const { q } = req.query;
    const property = await Property.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { token_name: { $regex: q, $options: 'i' } }
      ]
    });
    return res.status(200).json({
      result: property,
      message: 'Search results fetched successfully'
    });
  } catch (error) {
    console.error('Error searching property:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProperty, getSingleProperty, searchProperty };
