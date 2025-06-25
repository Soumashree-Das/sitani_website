import contactUsModel from "../models/contactUs.model.js";

// Create contact information
export const createContactInfo = async (req, res) => {
  try {
    const contact = new contactUsModel({
      ...req.body,
      preferredContactMethods: req.body.preferredContactMethods?.split(',')
    });
    
    await contact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Get all active contact points
export const getContactInfo = async (req, res) => {
  try {
    const contacts = await contactUsModel.find({ isActive: true })
      .sort('department');
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // Process preferredContactMethods if provided
    const updateData = { ...req.body };
    if (req.body.preferredContactMethods) {
      updateData.preferredContactMethods = 
        typeof req.body.preferredContactMethods === 'string' 
          ? req.body.preferredContactMethods.split(',') 
          : req.body.preferredContactMethods;
    }

    const updatedContact = await contactUsModel.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,         // Return the updated document
        runValidators: true // Run schema validations
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        error: 'Contact information not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    });

  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: errors
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Server error: ' + err.message
    });
  }
};