const Message = require('../models/Message');

// @desc    Get messages between users
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { receiver, helpRequest } = req.query;
    let query = {};

    if (helpRequest) {
      query.helpRequest = helpRequest;
      query.$or = [
        { sender: req.user.id },
        { receiver: req.user.id },
      ];
    } else if (receiver) {
      query.$or = [
        { sender: req.user.id, receiver },
        { sender: receiver, receiver: req.user.id },
      ];
    } else {
      query.$or = [
        { sender: req.user.id },
        { receiver: req.user.id },
      ];
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture')
      .populate('helpRequest', 'title description')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, helpRequest, content } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      helpRequest,
      content,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

