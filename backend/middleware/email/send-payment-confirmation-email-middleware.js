const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const {PDFDocument} = require("pdf-lib");

const CLIENT_ID = '619501356972-9qti0t3jpr7rnqvi85rk0o1e10qb9qah.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//042_hW6uPCrErCgYIARAAGAQSNwF-L9IrMwTGLJjBAjryXLljLDICZXl9U6emlcAZZ7ZZh-bMmZgzTSoCB2XEXW2uiYHDHNPRiQE';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

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

const sendPaymentConfirmationEmail = async (bookingData, callback) => {
  const accessToken = await oAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'sweetfarmeger@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
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
    from: `"Sweet Farm", "sweetfarmeger@gmail.com"`,
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
      x: pages[0].getWidth() - pngDims.width -50,
      y: pages[0].getHeight() - pngDims.height - 50,
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
