const Voucher = require('../../models/voucher');

module.exports = (req, res, next) => {
  Voucher.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).json({message: "Voucher deleted!"});
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting voucher failed!"
      });
    });
}
