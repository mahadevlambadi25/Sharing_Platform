const Request = require('../models/Request');
const Resource = require('../models/Resource');

// @POST /api/requests — send request for a resource
const createRequest = async (req, res) => {
  const { resourceId, message } = req.body;
  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (!resource.isAvailable) return res.status(400).json({ message: 'Resource not available' });

    const existing = await Request.findOne({ resource: resourceId, requester: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const request = await Request.create({ resource: resourceId, requester: req.user._id, message });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/requests/mine — requests I sent
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id }).populate('resource');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/requests/incoming — requests on my resources
const getIncomingRequests = async (req, res) => {
  try {
    const myResources = await Resource.find({ owner: req.user._id }).select('_id');
    const ids = myResources.map(r => r._id);
    const requests = await Request.find({ resource: { $in: ids } })
      .populate('requester', 'name email')
      .populate('resource', 'title');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/requests/:id — approve or reject
const updateRequestStatus = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    const request = await Request.findById(req.params.id).populate('resource');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.resource.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    request.status = status;
    if (status === 'approved') {
      await Resource.findByIdAndUpdate(request.resource._id, { isAvailable: false });
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRequest, getMyRequests, getIncomingRequests, updateRequestStatus };