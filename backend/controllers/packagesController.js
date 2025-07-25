const Package = require('../models/Package');

exports.getAllPackages = async (req, res) => {
    const { category, location } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = location;

    const packages = await Package.find(filter);
    res.json(packages);
};

exports.getPackage = async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    res.json(pkg);
};

exports.createPackage = async (req, res) => {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
};

exports.updatePackage = async (req, res) => {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

exports.deletePackage = async (req, res) => {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};
