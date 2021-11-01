const Voucher = require('../../models/voucher');

module.exports = (req, res, next) => {
  const voucher = new Voucher({
    _id: req.body.id,
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
    isPaid: req.body.isPaid
  });

  Voucher.updateOne({_id: req.params.id}, voucher)
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Update successful!'});
    })
    .catch(error => {
      res.status(500).json({
        message: "Editing voucher failed!"
      });
    });
}
