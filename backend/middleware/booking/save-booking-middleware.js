const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const booking = new Booking({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    numOfChildren: req.body.numOfChildren,
    numOfAdults: req.body.numOfAdults,
    numOfBedrooms: req.body.numOfBedrooms,
    comment: req.body.comment,
    isPaid: req.body.isPaid,
    voucherId: req.body.voucherId,
    from: req.body.from,
    to: req.body.to,
    offerName: req.body.offerName
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
