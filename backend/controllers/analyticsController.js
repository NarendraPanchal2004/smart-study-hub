const { getDb } = require('../mockDb');

exports.getUserAnalytics = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user._id;

    // 1. Task Stats
    const userTasks = db.tasks.filter(t => t.userId === userId);
    const completedTasks = userTasks.filter(t => t.completed).length;
    const pendingTasks = userTasks.length - completedTasks;

    // 2. Timetable Stats (Study Hours)
    const userEvents = db.timetables.filter(t => t.userId === userId);
    const studyEvents = userEvents.filter(e => e.type === 'study');
    
    // Calculate hours (mock calculation for demo)
    const totalStudyHours = studyEvents.length * 2; // Assuming 2 hours per session for mock

    // 3. Group Stats
    const userGroups = db.groups.filter(g => g.members.includes(userId));

    // 4. Notes Stats
    const userNotes = db.notes.filter(n => n.userId === userId);

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
        groups: userGroups.length,
        notes: userNotes.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
