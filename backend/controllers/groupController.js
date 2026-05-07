const { getDb, saveDb } = require('../mockDb');

// Helper to generate random 6-char code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const db = getDb();

    const groupCode = generateCode();
    const newGroup = {
      _id: Date.now().toString(),
      name,
      description,
      code: groupCode,
      creator: req.user._id,
      members: [req.user._id],
      materials: [],
      createdAt: new Date()
    };

    db.groups.push(newGroup);
    
    // Also add group to user's list
    const userIndex = db.users.findIndex(u => u._id === req.user._id);
    if (userIndex !== -1) {
      if (!db.users[userIndex].groups) db.users[userIndex].groups = [];
      db.users[userIndex].groups.push(newGroup._id);
    }

    saveDb(db);

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    const db = getDb();

    const groupIndex = db.groups.findIndex(g => g.code === code);
    if (groupIndex === -1) {
      return res.status(404).json({ message: 'Group not found with this code' });
    }

    const group = db.groups[groupIndex];
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push(req.user._id);
    
    // Add group to user
    const userIndex = db.users.findIndex(u => u._id === req.user._id);
    if (userIndex !== -1) {
      if (!db.users[userIndex].groups) db.users[userIndex].groups = [];
      db.users[userIndex].groups.push(group._id);
    }

    saveDb(db);

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const db = getDb();
    const userGroups = db.groups.filter(g => g.members.includes(req.user._id));
    res.json(userGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const db = getDb();
    const group = db.groups.find(g => g._id === req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
