const mongoose = require('mongoose');
const packageSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    duration: Number,
    category: String,
    location: String,
    availableDates: [Date],
    imageUrl: String
});
module.exports = mongoose.model('Package', packageSchema);
