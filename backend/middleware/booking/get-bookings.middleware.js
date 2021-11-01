const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const bookingQuery = Booking.find().sort({from: -1});
  let fetchedBookings;

  if (pageSize && currentPage) {
    bookingQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  bookingQuery
    .then(bookings => {
      fetchedBookings = bookings;
      return Booking.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Bookings fetched successfully!",
        bookings: fetchedBookings,
        maxBookings: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching bookings failed!"
      });
    });
}
