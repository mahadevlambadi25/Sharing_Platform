const Resource = require('../models/Resource');

// @POST /api/resources — create
const createResource = async (req, res) => {
  const { title, description, category } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const resource = await Resource.create({
      title, description, category, fileUrl,
      owner: req.user._id,
    });
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/resources — get all
const getAllResources = async (req, res) => {
  try {
    const query = {};
    if (req.query.all !== 'true') {
      query.isAvailable = true;
    }
    const resources = await Resource.find(query).populate('owner', 'name email');
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('owner', 'name email');
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(resource, req.body);
    if (req.file) resource.fileUrl = `/uploads/${req.file.filename}`;
    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await resource.deleteOne();
    res.json({ message: 'Resource deleted by owner or administrator' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createResource, getAllResources, getResourceById, updateResource, deleteResource };