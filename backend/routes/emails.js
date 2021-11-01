const express = require("express");
const router = express.Router();

const generateQRCodeMW = require("../middleware/email/generate-qr-code-middleware");
const sendBookingConfirmationEmailMW = require('../middleware/email/send-booking-confirmation-email-middleware');
const sendPaymentConfirmationEmailMW = require('../middleware/email/send-payment-confirmation-email-middleware');

router.post('/sendBookingConfirmationEmail',
  sendBookingConfirmationEmailMW
);

router.post('/sendPaymentConfirmationEmail',
  generateQRCodeMW,
  sendPaymentConfirmationEmailMW
);

module.exports = router;
