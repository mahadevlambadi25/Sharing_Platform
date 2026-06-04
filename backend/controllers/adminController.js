const User = require('../models/User');
const Resource = require('../models/Resource');
const Request = require('../models/Request');

// @GET /api/admin/stats — platform-wide stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResources = await Resource.countDocuments();
    const availableResources = await Resource.countDocuments({ isAvailable: true });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const approvedRequests = await Request.countDocuments({ status: 'approved' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });

    res.json({
      totalUsers,
      totalResources,
      availableResources,
      assignedResources: totalResources - availableResources,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/users — all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/users/:id — remove a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete an admin account' });

    // Also delete all resources and requests belonging to this user
    await Resource.deleteMany({ owner: user._id });
    await Request.deleteMany({ requester: user._id });
    await user.deleteOne();

    res.json({ message: 'User and their data removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/requests — all platform requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('requester', 'name email')
      .populate({ path: 'resource', populate: { path: 'owner', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllRequests };
