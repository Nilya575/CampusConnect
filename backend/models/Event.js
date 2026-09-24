const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  banner: {
    type: String  // image URL (Cloudinary se aayega baad mein)
  },
  maxSeats: {
    type: Number,
    required: true
  },
  isTeamEvent: {
    type: Boolean,
    default: false  // hackathon jaise events ke liye true karenge
  },
  organizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      teamName: {
        type: String  // agar isTeamEvent true hai to
      },
      registeredAt: {
        type: Date,
        default: Date.now
      },
      attended: {
      type: Boolean,
      default: false  // naya field - attendance track karne ke liye
    }
    
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);