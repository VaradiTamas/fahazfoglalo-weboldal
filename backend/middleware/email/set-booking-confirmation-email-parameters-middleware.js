module.exports = async (req, res, next) => {
  res.locals.from = `"Sweet Farm", "info@sweetfarm.hu"`;
  res.locals.to = req.body.email;
  res.locals.subject = 'Foglalás megerősítése';
  res.locals.template = 'booking-confirmation-email';
  res.locals.attachments = {
    path: 'booking_ticket.pdf'
  };
  res.locals.variables = {
    name: req.body.firstName
  }
  next();
};
