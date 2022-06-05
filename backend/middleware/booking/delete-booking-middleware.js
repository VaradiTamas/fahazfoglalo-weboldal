const Booking = require("../../models/booking");

module.exports = (req, res, next) => {
  Booking.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).json({message: "Booking deleted!"});
    })
    .catch(error => {
      res.status(500).json({message: "Deleting booking failed!"});
    });
}
