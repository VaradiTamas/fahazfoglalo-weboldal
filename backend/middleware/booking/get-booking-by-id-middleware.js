const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  Booking.findById(req.params.id)
    .then(booking => {
      if (booking) {
        res.status(200).json(booking);
      } else {
        res.status(404).json({message: 'Booking not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching booking failed!"
      });
    });
}
