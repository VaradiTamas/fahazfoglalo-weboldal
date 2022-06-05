const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const booking = new Booking({
    voucherId: req.body.voucherId,
    from: req.body.from,
    to: req.body.to,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    numOfChildren: req.body.numOfChildren,
    numOfAdults: req.body.numOfAdults,
    comment: req.body.comment,
    paidAmount: req.body.paidAmount,
  });

  booking
    .save()
    .then(createdBooking => {
      res.status(201).json({
        message: 'Booking added successfully',
        bookingId: createdBooking._id
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a booking failed!"
      });
    });
};
