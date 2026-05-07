const { getDb, saveDb } = require('../mockDb');

exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const db = getDb();
    const groupMessages = db.messages.filter(m => m.groupId === groupId);
    res.json(groupMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, text, type = 'text', fileUrl = '' } = req.body;
    const db = getDb();

    const newMessage = {
      _id: Date.now().toString(),
      groupId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      text,
      type, // text, image, file
      fileUrl,
      createdAt: new Date()
    };

    db.messages.push(newMessage);
    saveDb(db);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const messageIndex = db.messages.findIndex(m => m._id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender or admin can delete
    if (db.messages[messageIndex].senderId !== req.user._id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    db.messages.splice(messageIndex, 1);
    saveDb(db);

    res.json({ message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
