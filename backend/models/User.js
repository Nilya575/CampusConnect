const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true  // ek email se sirf ek account bane
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],  // sirf ye 3 values allowed
    default: 'student'
  },
  department: {
    type: String,
    required: true
  }
}, { timestamps: true });  // createdAt, updatedAt automatically add ho jayenge

module.exports = mongoose.model('User', userSchema);