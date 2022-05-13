const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const hbs = require("nodemailer-express-handlebars");

const CLIENT_ID = '619501356972-9qti0t3jpr7rnqvi85rk0o1e10qb9qah.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//04BSvcNixdsaLCgYIARAAGAQSNwF-L9IrJliNnbn2oDTeL87XOU95yikD7GMuaGFN3BsXUksFszAmTV073ZPCWIY_5jK2JSFy00s';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

module.exports = (req, res, next) => {
  console.log('email sending request came');
  let emailData = res.locals;

  sendEmail(emailData, (err, info) => {
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

const sendEmail = async (emailData, callback) => {
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
      // viewPath: './backend/email-templates' --> dev
      viewPath: './email-templates'
    })
  );

  const mailOptions = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    attachments: emailData.attachments,
    template: emailData.template,
    context: emailData.variables
  };

  transporter.sendMail(mailOptions, callback);
}
