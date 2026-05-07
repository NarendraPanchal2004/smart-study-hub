const { getDb, saveDb } = require('../mockDb');

exports.getTimetable = async (req, res) => {
  try {
    const { groupId } = req.query;
    const db = getDb();
    let userEvents = db.timetables.filter(t => t.userId === req.user._id);
    if (groupId) {
      userEvents = db.timetables.filter(t => t.groupId === groupId);
    }
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, type, groupId = null } = req.body;
    const db = getDb();

    const newEvent = {
      _id: Date.now().toString(),
      userId: req.user._id,
      groupId,
      title,
      date,
      startTime,
      endTime,
      type, // 'study', 'exam', 'break', 'other'
      createdAt: new Date()
    };

    db.timetables.push(newEvent);
    saveDb(db);

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const index = db.timetables.findIndex(t => t._id === id && t.userId === req.user._id);
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    db.timetables.splice(index, 1);
    saveDb(db);

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
