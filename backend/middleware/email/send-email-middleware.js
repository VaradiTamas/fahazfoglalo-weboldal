const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

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
  const transporter = nodemailer.createTransport({
    host: "mail.sweetfarm.hu",
    port: 465,
    secure: true,
    auth: {
      user: 'info@sweetfarm.hu',
      pass: 'SweetFarm15',
    },
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: 'express-handlebars',
      viewPath: './backend/email-templates' // --> dev
      // viewPath: './email-templates'
    })
  );

  const mailOptionsToGuest = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    attachments: emailData.attachments,
    template: emailData.template,
    context: emailData.variables
  };

  const mailOptionsToAdmin = mailOptionsToGuest;
  mailOptionsToAdmin.to = 'greenparkeger@gmail.com';

  await transporter.sendMail(mailOptionsToGuest, callback);
  await transporter.sendMail(mailOptionsToAdmin, callback);
}
