const Task = require('../models/Task');
const Timetable = require('../models/Timetable');
const Group = require('../models/Group');
const Note = require('../models/Note');

exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Task Stats
    const userTasks = await Task.find({ userId });
    const completedTasks = userTasks.filter(t => t.completed).length;
    const pendingTasks = userTasks.length - completedTasks;

    // 2. Timetable Stats (Study Hours)
    const studyEvents = await Timetable.find({ userId, type: 'study' });
    const totalStudyHours = studyEvents.length * 2; // Keep mock calculation logic for simplicity

    // 3. Group Stats
    const userGroups = await Group.countDocuments({ members: userId });

    // 4. Notes Stats
    const userNotes = await Note.countDocuments({ userId });

    res.json({
      tasks: {
        total: userTasks.length,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0
      },
      study: {
        totalSessions: studyEvents.length,
        totalHours: totalStudyHours,
        weeklyData: [
          { name: 'Mon', hours: 4 },
          { name: 'Tue', hours: 3 },
          { name: 'Wed', hours: 5 },
          { name: 'Thu', hours: 2 },
          { name: 'Fri', hours: 6 },
          { name: 'Sat', hours: 8 },
          { name: 'Sun', hours: 4 },
        ]
      },
      activity: {
        groups: userGroups,
        notes: userNotes
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
