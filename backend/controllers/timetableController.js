const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
  try {
    const { groupId } = req.query;
    let query = { userId: req.user._id };
    if (groupId) {
      query = { groupId };
    }
    const userEvents = await Timetable.find(query).sort({ date: 1, startTime: 1 });
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, type, groupId = null } = req.body;

    const newEvent = await Timetable.create({
      userId: req.user._id,
      groupId,
      title,
      date,
      startTime,
      endTime,
      type
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Timetable.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
