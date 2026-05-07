const { getDb, saveDb } = require('../mockDb');

exports.getTasks = async (req, res) => {
  try {
    const { groupId } = req.query;
    const db = getDb();
    let userTasks = db.tasks.filter(t => t.userId === req.user._id);
    if (groupId) {
      userTasks = db.tasks.filter(t => t.groupId === groupId);
    }
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, category, groupId } = req.body;
    const db = getDb();

    const newTask = {
      _id: Date.now().toString(),
      userId: req.user._id,
      groupId: groupId || null,
      title,
      description,
      deadline,
      priority, // 'high', 'medium', 'low'
      category, // 'exam', 'assignment', 'reading', 'other'
      completed: false,
      createdAt: new Date()
    };

    db.tasks.push(newTask);
    saveDb(db);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const taskIndex = db.tasks.findIndex(t => t._id === id && t.userId === req.user._id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...req.body };
    saveDb(db);

    res.json(db.tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const index = db.tasks.findIndex(t => t._id === id && t.userId === req.user._id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.tasks.splice(index, 1);
    saveDb(db);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
