const express = require("express");
const router = express.Router();

const checkAuthMW = require("../middleware/user/check-auth-middleware");
const setIsPaidStateMW = require("../middleware/booking/set-isPaid-state-middleware");
const saveBookingMW = require('../middleware/booking/save-booking-middleware');
const getBookingsMW = require('../middleware/booking/get-bookings.middleware');
const deleteBookingMW = require('../middleware/booking/delete-booking-middleware');
const editBookingMW = require('../middleware/booking/edit-booking-middleware');
const getBookingByIdMW = require('../middleware/booking/get-booking-by-id-middleware');
const getReservedDatesMW = require('../middleware/booking/get-reserved-dates-middleware');

router.post('',
  setIsPaidStateMW,
  saveBookingMW
);

router.get('',
  //checkAuthMW,
  getBookingsMW
);

router.use('/delete/:id',
  // checkAuthMW,
  deleteBookingMW
);

router.put('/edit/:id',
  // checkAuthMW,
  editBookingMW
);

router.get('/reserved-days',
  getReservedDatesMW
);

router.get('/:id',
  // checkAuthMW,
  getBookingByIdMW
);

module.exports = router;
