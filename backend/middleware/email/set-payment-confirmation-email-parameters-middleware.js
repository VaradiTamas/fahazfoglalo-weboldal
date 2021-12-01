module.exports = async (req, res, next) => {
  res.locals.from = `"Sweet Farm", "sweetfarmeger@gmail.com"`;
  res.locals.to = req.body.email;
  res.locals.subject = 'Fizetés megerősítése';
  res.locals.template = 'payment-confirmation-email';
  res.locals.attachments = {
    path: 'booking_ticket.pdf'
  };
  res.locals.variables = {
    name: req.body.firstName
  }
  next();
};
