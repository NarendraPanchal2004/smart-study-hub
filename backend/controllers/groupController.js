const Group = require('../models/Group');

// Helper to generate random 6-char code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const groupCode = generateCode();
    const newGroup = await Group.create({
      name,
      description,
      code: groupCode,
      creator: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    
    const group = await Group.findOne({ code });
    if (!group) {
      return res.status(404).json({ message: 'Group not found with this code' });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userGroups = await Group.find({ members: req.user._id });
    res.json(userGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
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
