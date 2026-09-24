const Event = require('../models/Event');
const qrcode = require('qrcode');
const User = require('../models/User'); // ye add karo top pe
// CREATE Event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, banner, maxSeats, isTeamEvent } = req.body;

    const event = new Event({
      title,
      description,
      date,
      venue,
      banner,
      maxSeats,
      isTeamEvent,
      organizedBy: req.user.id
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET All Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizedBy', 'name email')
      .sort({ date: 1 }); // sabse nazdeek date pehle

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET Single Event (with registered users detail)
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizedBy', 'name email')
      .populate('registeredUsers.user', 'name email department');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REGISTER for Event
const registerEvent = async (req, res) => {
  try {
    const { teamName } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const alreadyRegistered = event.registeredUsers.some(
      (entry) => entry.user.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.registeredUsers.length >= event.maxSeats) {
      return res.status(400).json({ message: 'Event is full, no seats left' });
    }

    event.registeredUsers.push({
      user: req.user.id,
      teamName: event.isTeamEvent ? teamName : undefined
    });

    await event.save();

    // QR Code data banao (jo encode hoga)
    const qrData = JSON.stringify({
      eventId: event._id,
      userId: req.user.id
    });

    // QR code image banao (base64 format mein, taaki frontend directly dikha sake)
    const qrCodeImage = await qrcode.toDataURL(qrData);

    res.status(200).json({
      message: 'Registered successfully',
      event,
      qrCode: qrCodeImage  // ye ek base64 image string hai
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// MARK Attendance (QR scan hone pe ye call hoga)
const markAttendance = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Populate NAHI karo yaha, kyunki hum save() karenge
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registration = event.registeredUsers.find(
      (entry) => entry.user.toString() === userId
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found for this user' });
    }

    if (registration.attended) {
      // Naam chahiye to alag se User model se le lo
      const User = require('../models/User');
      const student = await User.findById(userId);
      return res.status(400).json({ 
        message: 'Attendance already marked',
        studentName: student?.name 
      });
    }

    registration.attended = true;
    await event.save(); // ab clean save hoga, koi populate issue nahi

    // Save ke baad, naam ke liye alag se User fetch karo
    const User = require('../models/User');
    const student = await User.findById(userId);

    res.status(200).json({ 
      message: 'Attendance marked successfully',
      studentName: student?.name,
      studentEmail: student?.email
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// GET events jisme current user ne register kiya hai
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      'registeredUsers.user': req.user.id  // sirf wo events dhundo jisme is user ki entry ho
    }).populate('organizedBy', 'name email');

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createEvent, getEvents, getEventById, registerEvent, markAttendance, getMyEvents, deleteEvent };