const Booking = require('../../models/booking');

module.exports = (req, res, next) => {
  const currentYear = +req.query.year;
  const currentMonth = +req.query.month;

  let fromYear;
  let fromMonth;

  let toYear;
  let toMonth;

  if (currentMonth == 0) {
    fromYear = currentYear - 1;
    fromMonth = 10;
  } else if (currentMonth == 1) {
    fromYear = currentYear - 1;
    fromMonth = 11;
  } else {
    fromYear = currentYear;
    fromMonth = currentMonth - 2;
  }

  if (currentMonth == 10) {
    toYear = currentYear + 1;
    toMonth = 0;
  } else if (currentMonth == 11) {
    toYear = currentYear + 1;
    toMonth = 1;
  } else {
    toYear = currentYear;
    toMonth = currentMonth + 2;
  }

  const fromDate = new Date();
  const toDate = new Date();

  fromDate.setFullYear(fromYear, fromMonth, 1);
  toDate.setFullYear(toYear, toMonth, 1);

  Booking.find({$and: [
      {from: {$gte: fromDate}},
      {from: {$lt: toDate}},
      {isPaid: "true"}]
  })
    .then(bookings => {
      if (bookings) {
        res.status(200).json(bookings.map(booking => {
          fromDates = {
            year: booking.from.getFullYear(),
            month: booking.from.getMonth(),
            day: booking.from.getDate()
          }
          toDates = {
            year: booking.to.getFullYear(),
            month: booking.to.getMonth(),
            day: booking.to.getDate()
          }
          return {from: fromDates, to: toDates};
        }));
      } else {
        res.status(200).json({from: null, to: null});
      }
    }).catch(error => {
    res.status(500).json({
      message: "Finding reserved dates failed!"
    });
  });
}
