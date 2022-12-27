const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const bookingSchema = mongoose.Schema({
  from: Date,
  to: Date,
  firstName: String,
  lastName: String,
  email: String,
  tel: String,
  numOfChildren: Number,
  numOfAdults: Number,
  comment: String,
  paidAmount: Number,
})

module.exports = mongoose.model('Booking', bookingSchema);
