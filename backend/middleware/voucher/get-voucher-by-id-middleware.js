const Voucher = require('../../models/voucher');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  Voucher.findById(mongoose.Types.ObjectId(req.params.id))
    .then(voucher => {
      if (voucher) {
        res.status(200).json(voucher);
      } else {
        res.status(404).json({message: 'Voucher not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching voucher failed!"
      });
    });
}
