const nodemailer = require("nodemailer");

module.exports = (req, res, next) => {
  console.log('email sending request came');
  let bookingData = req.body;
  sendBookingConfirmationEmail(bookingData, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.send(info);
    }
  });
};

const sendBookingConfirmationEmail = (bookingData, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });

  const mailOptions = {
    from: `"Sweet Farm", "sweetfarmeger@gmail.com"`,
    to: bookingData.email,
    subject: "Foglalás visszaigazolás",
    html: "<h1>Kedves foglalas megerositese</h1>"
  };

  transporter.sendMail(mailOptions, callback);
}
