module.exports = async (req, res, next) => {
  res.locals.from = `"Sweet Farm", "sweetfarmeger@gmail.com"`;
  res.locals.to = req.body.email;
  res.locals.subject = 'Foglalás visszaigazolás';
  res.locals.template = 'booking-confirmation-email';
  res.locals.attachments = null;
  res.locals.variables = {
    name: req.body.firstName
  }
  next();
};
