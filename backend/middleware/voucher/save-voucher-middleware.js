const Voucher = require('../../models/voucher');

module.exports = (req, res, next) => {
  const voucher = new Voucher({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    numOfChildren: req.body.numOfChildren,
    numOfAdults: req.body.numOfAdults,
    numOfBedrooms: req.body.numOfBedrooms,
    numOfNights: req.body.numOfNights,
    country: req.body.country,
    postcode: req.body.postcode,
    city: req.body.city,
    address: req.body.address,
    isPaid: res.locals.isPaid
  });

  voucher
    .save()
    .then(createdVoucher => {
      res.status(201).json({
        message: 'Voucher added successfully',
        voucherId: createdVoucher._id
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Adding voucher failed!"
      });
    });
}
