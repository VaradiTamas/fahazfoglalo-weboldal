const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const booking = new Booking({
    _id: req.body.id,
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

  Booking.updateOne({_id: req.params.id}, booking)
    .then(result => {
      res.status(200).json({message: 'Update successful!'});
    })
    .catch(error => {
      res.status(500).json({message: "Couldn't update booking!"});
    });
}
