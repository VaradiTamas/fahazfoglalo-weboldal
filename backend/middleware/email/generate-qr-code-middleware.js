const QRCode = require("qrcode");

module.exports = async (req, res, next) => {
  try {
    await QRCode.toFile(
      'booking_qr_code.png',
      'http://www.sweetfarm.hu/admin/bookings/' + req.body.id
    );
    next();
  } catch (error) {
    console.log('QR code was not generated!')
    next();
  }
};
