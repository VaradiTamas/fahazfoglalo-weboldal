const QRCode = require("qrcode");

module.exports = (req, res, next) => {
  try {
    QRCode.toFile(
      'booking_qr_code.png',
      'http://' + req.body.id
    );

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    sleep(10000).then(() => {
      next();
    });
  } catch (error) {
    console.log('QR code is not generated!')
    next();
  }
};
