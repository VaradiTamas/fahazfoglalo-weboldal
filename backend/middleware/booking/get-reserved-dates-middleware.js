const Booking = require('../../models/booking');

module.exports = (req, res) => {
  // this is the date of the second calendar
  const requestedDate = new Date();
  requestedDate.setFullYear(+req.query.year, +req.query.month, 1);

  // to be able to calculate filter parameters (from - to)
  // (seconds per hour) * (hours per day) * (max number of days in a month) * (number of months) * (change from sec to millisec)
  const threeMonths = 3600 * 24 * 31 * 3 * 1000;

  // three months before the requested date
  const fromDateMilliseconds = requestedDate.getMilliseconds() - threeMonths;
  const fromDate = new Date();
  fromDate.setMilliseconds(fromDateMilliseconds);

  // three months after the requested date
  const toDateMilliseconds = requestedDate.getMilliseconds() + threeMonths;
  const toDate = new Date();
  toDate.setMilliseconds(toDateMilliseconds);

  Booking.find({
    $and: [
      {from: {$gte: fromDate}},
      {from: {$lt: toDate}},
    ]
  })
    .then(bookings => {
      if (bookings) {
        res.status(200).json(transformDates(bookings, fromDate, toDate));
      } else {
        res.status(200).json(null);
      }
    }).catch(error => {
    res.status(500).json({
      message: "Finding reserved dates failed!"
    });
  });
}

function transformDates(bookings, fromDate, toDate) {
  const transformedDates = [];
  let i = 0;
  for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
    transformedDates.push({
      date: new Date(date),
      isReserved: isDateReserved(date, bookings),
      previousDayIsReserved: false,
      nextDayIsReserved: false,
    })
    if (i > 1) {
      if (transformedDates[i-2].isReserved) {
        transformedDates[i-1].previousDayIsReserved = true;
      }
      if (transformedDates[i].isReserved) {
        transformedDates[i-1].nextDayIsReserved = true;
      }
    }
    i++;
  }
  return transformedDates;
}

function isDateReserved(date, bookings) {
  for (let i = 0; i < bookings.length; i++) {
    if (date > bookings[i].from && date < bookings[i].to) {
      return true;
    }
  }
  return false;
}
