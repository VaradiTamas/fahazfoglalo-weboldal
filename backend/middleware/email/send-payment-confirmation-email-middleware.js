const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const {PDFDocument} = require("pdf-lib");

module.exports = (req, res, next) => {
  console.log('email sending request came');
  let bookingData = req.body;

  modifyPdf();

  sendPaymentConfirmationEmail(bookingData, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      res.send(info);
      console.log("Email has been sent");
    }
  });
};

const sendPaymentConfirmationEmail = (bookingData, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "varadi.thomas@gmail.com",
      pass: "98Ujjelszo89"
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: 'express-handlebars',
      viewPath: './backend/public/email-templates'
    })
  );

  const mailOptions = {
    from: `"Tamas Varadi", "varadi.thomas@gmail.com"`,
    to: bookingData.email,
    subject: "Foglalás visszaigazolás",
    attachments: [
      {path: 'booking_ticket.pdf'}
    ],
    template: 'payment-confirmation-email',
    context: {
      name: 'Name'
    }
  };

  transporter.sendMail(mailOptions, callback);
}

async function modifyPdf() {
  try {
    const existingPdfBytes = fs.readFileSync('booking_ticket_template.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pngImageBytes = fs.readFileSync('booking_qr_code.png');
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)
    const pages = pdfDoc.getPages()

    pages[0].drawImage(pngImage, {
      x: pages[0].getWidth() / 2 - pngDims.width / 2 + 75,
      y: pages[0].getHeight() / 2 - pngDims.height + 250,
      width: pngDims.width,
      height: pngDims.height,
    })

    const pdfBytes = await pdfDoc.save();
    let writer = fs.createWriteStream('booking_ticket.pdf');
    writer.write(pdfBytes);
  } catch (err) {
    console.error(err)
  }
}
