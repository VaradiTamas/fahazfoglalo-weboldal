const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const booking = new Booking({
    _id: req.body.id,
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
    offerName: req.body.offerName,
  });

  Booking.updateOne({_id: req.params.id}, booking).then(result => {
    res.status(200).json({message: 'Update successful!'});
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update booking!"
      });
    });
}
