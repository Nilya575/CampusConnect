const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Scholarship', 'Placement', 'General', 'Hackathon'],
    required: true
  },
  department: {
    type: String,
    default: 'All'  // agar sabke liye hai to 'All' rakhenge
  },
  priority: {
    type: String,
    enum: ['urgent', 'normal'],
    default: 'normal'
  },
  deadline: {
    type: Date  // scholarship/placement ke liye important, optional field
  },
  attachmentLink: {
    type: String  // PDF/form link, optional
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,  // User model se link
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);