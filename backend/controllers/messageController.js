const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const groupMessages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.json(groupMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, text, type = 'text', fileUrl = '' } = req.body;

    const newMessage = await Message.create({
      groupId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      text,
      type,
      fileUrl
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender or admin can delete
    if (message.senderId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
