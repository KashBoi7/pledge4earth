// models/UserView.js
const mongoose = require('mongoose');

const userViewSchema = new mongoose.Schema({
  name: String,
  view: String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

userViewSchema.index({ location: '2dsphere' });

const UserView = mongoose.model('UserView', userViewSchema);

module.exports = UserView;