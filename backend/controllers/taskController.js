const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { groupId } = req.query;
    let query = { userId: req.user._id };
    if (groupId) {
      query = { groupId };
    }
    const userTasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, category, groupId } = req.body;

    const newTask = await Task.create({
      userId: req.user._id,
      groupId: groupId || null,
      title,
      description,
      deadline,
      priority,
      category
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
