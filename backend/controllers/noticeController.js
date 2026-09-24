const Notice = require('../models/Notice');

// CREATE Notice
const createNotice = async (req, res) => {
  try {
    const { title, description, category, department, priority, deadline, attachmentLink } = req.body;

    const notice = new Notice({
      title,
      description,
      category,
      department,
      priority,
      deadline,
      attachmentLink,
      postedBy: req.user.id  // ye humein middleware se milta hai (token se decode hua)
    });

    await notice.save();

    res.status(201).json({ message: 'Notice created successfully', notice });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET All Notices
const getNotices = async (req, res) => {
  try {
    // populate() se postedBy ki jagah actual user ka naam/email aayega
    const notices = await Notice.find()
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 }); // sabse naya sabse pehle

    res.status(200).json(notices);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE Notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check karo: sirf jisne banaya wo, ya admin hi delete kar sake
    if (notice.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this notice' });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Notice deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNotice, getNotices, deleteNotice };