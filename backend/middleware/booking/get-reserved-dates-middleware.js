const Booking = require('../../models/booking');

module.exports = (req, res) => {
  // this is the date of the second calendar
  const requestedDate = new Date();
  requestedDate.setFullYear(+req.query.year, +req.query.month, 1);
  const requestedDateMilliseconds = Date.parse(requestedDate.toString());

  // to be able to calculate filter parameters (from - to)
  // (seconds per hour) * (hours per day) * (max number of days in a month) * (number of months) * (change from sec to millisec)
  const threeMonths = 3600 * 24 * 31 * 3 * 1000;

  // three months before the requested date
  const fromDateMilliseconds = requestedDateMilliseconds - threeMonths;
  const fromDate = new Date(fromDateMilliseconds);

  // three months after the requested date
  const toDateMilliseconds = requestedDateMilliseconds + threeMonths;
  const toDate = new Date(toDateMilliseconds);

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
      state: null,  // to determine its state we have to know if the previous & next dates are reserved or not
    })
    // determining the state of the previous date (i-1 element of the transformedDates)
    if (i > 1) {
      // if the previous day was reserved
      if (transformedDates[i-1].isReserved) {
        if (transformedDates[i-2].isReserved) {
          transformedDates[i - 1].state = 'FULLY_RESERVED';
        } else {
          transformedDates[i - 1].state = 'FIRST_HALF_FREE_SECOND_HALF_RESERVED';
        }
      }
      // if the previous day was not reserved
      else {
        if (transformedDates[i-2].isReserved) {
          transformedDates[i - 1].state = 'FIRST_HALF_RESERVED_SECOND_HALF_FREE';
        } else {
          transformedDates[i - 1].state = 'FULLY_FREE';
        }
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
