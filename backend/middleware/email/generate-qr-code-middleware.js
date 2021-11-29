const QRCode = require("qrcode");

module.exports = async (req, res, next) => {
  try {
    await QRCode.toFile(
      'booking_qr_code.png',
      'http://www.sweeeetfarm.hu/admin/bookings/' + req.body.id
    );
    next();
  } catch (error) {
    console.log('QR code is not generated!')
    next();
  }
};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
