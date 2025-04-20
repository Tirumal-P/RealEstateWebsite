const Property = require('../models/Property');
const Owner = require('../models/Owner');

exports.createProperty = async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      owner: req.user._id
    });
    
    await newProperty.save();
    await Owner.findByIdAndUpdate(
      req.user._id,
      { $push: { listedProperties: newProperty._id } }
    );
    
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner realtor');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};