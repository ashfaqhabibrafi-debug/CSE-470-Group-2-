const Message = require('../models/Message');
const User = require('../models/User');

// Send notification message to all admins
const sendNotificationToAdmins = async (content, senderId) => {
  try {
    // Find all admins
    const admins = await User.find({
      role: 'admin',
      isActive: true,
    }).select('_id');

    if (admins.length === 0) {
      return { success: true, count: 0, message: 'No admins to notify' };
    }

    // Create messages for all admins
    const messages = admins.map(admin => ({
      sender: senderId, // User who created the item
      receiver: admin._id,
      content: content,
      read: false,
    }));

    // Insert all messages
    const createdMessages = await Message.insertMany(messages);

    return {
      success: true,
      count: createdMessages.length,
      message: `Notifications sent to ${createdMessages.length} admins`,
    };
  } catch (error) {
    console.error('Error sending notifications to admins:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send notification message to all citizens and volunteers
const sendNotificationToUsers = async (content, senderId) => {
  try {
    // Find all citizens and volunteers
    const users = await User.find({
      role: { $in: ['citizen', 'volunteer'] },
      isActive: true,
    }).select('_id');

    if (users.length === 0) {
      return { success: true, count: 0, message: 'No users to notify' };
    }

    // Create messages for all users (sender is the admin/system)
    const messages = users.map(user => ({
      sender: senderId, // Admin/system user who triggered the action
      receiver: user._id,
      content: content,
      read: false,
    }));

    // Insert all messages
    const createdMessages = await Message.insertMany(messages);

    return {
      success: true,
      count: createdMessages.length,
      message: `Notifications sent to ${createdMessages.length} users`,
    };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send notification to admin when disaster is created (needs verification)
const notifyDisasterCreated = async (disaster, senderId) => {
  const content = `A new disaster "${disaster.title}" (${disaster.type}) has been reported and needs verification. Location: ${disaster.location.city || disaster.location.address || 'N/A'}`;
  
  return await sendNotificationToAdmins(content, senderId);
};

// Send notification when disaster is verified (to citizens and volunteers)
const notifyDisasterVerified = async (disaster, senderId) => {
  const content = `A ${disaster.type} disaster "${disaster.title}" in ${disaster.location.city || disaster.location.address || 'your area'} has been verified by an admin. Please stay safe and check for nearby help requests if needed.`;
  
  return await sendNotificationToUsers(content, senderId);
};

// Send notification to admin when help request is created (needs verification)
const notifyHelpRequestCreated = async (helpRequest, senderId) => {
  const content = `A new help request (${helpRequest.requestType}) has been submitted and needs verification. ${helpRequest.description ? helpRequest.description.substring(0, 100) : ''}`;
  
  return await sendNotificationToAdmins(content, senderId);
};

// Send notification when help request is verified (to citizens and volunteers)
const notifyHelpRequestVerified = async (helpRequest, senderId) => {
  const content = `A help request (${helpRequest.requestType}) has been verified by an admin and is now available for volunteers to assist.`;
  
  return await sendNotificationToUsers(content, senderId);
};

// Send notification when donation event is created (to citizens and volunteers - no admin verification needed)
const notifyDonationEventCreated = async (donationEvent, senderId) => {
  const content = `A new donation event "${donationEvent.title}" has been created. Help support those in need by contributing to this cause.`;
  
  return await sendNotificationToUsers(content, senderId);
};

// Send notification to admin when organization is created (needs verification)
const notifyOrganizationCreated = async (organization, senderId) => {
  const content = `A new organization "${organization.name}" has been added and needs verification.`;
  
  return await sendNotificationToAdmins(content, senderId);
};

// Send notification when organization is verified (to citizens and volunteers)
const notifyOrganizationVerified = async (organization, senderId) => {
  const content = `A new partner organization "${organization.name}" has been verified and added to the system. They are now available to help with disaster relief efforts.`;
  
  return await sendNotificationToUsers(content, senderId);
};

module.exports = {
  sendNotificationToAdmins,
  sendNotificationToUsers,
  notifyDisasterCreated,
  notifyDisasterVerified,
  notifyHelpRequestCreated,
  notifyHelpRequestVerified,
  notifyDonationEventCreated,
  notifyOrganizationCreated,
  notifyOrganizationVerified,
};

