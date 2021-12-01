const express = require("express");
const router = express.Router();

const generateQRCodeMW = require("../middleware/email/generate-qr-code-middleware");
const modifyPdfMW = require("../middleware/email/modify-pdf-middleware");
const setBookingConfirmationEmailParametersMW = require('../middleware/email/set-booking-confirmation-email-parameters-middleware');
const setPaymentConfirmationEmailParametersMW = require('../middleware/email/set-payment-confirmation-email-parameters-middleware');
const sendEmailMW = require('../middleware/email/send-email-middleware');

router.post('/send-booking-confirmation-email',
  setBookingConfirmationEmailParametersMW,
  sendEmailMW
);

router.post('/send-payment-confirmation-email',
  generateQRCodeMW,
  modifyPdfMW,
  setPaymentConfirmationEmailParametersMW,
  sendEmailMW
);

module.exports = router;
