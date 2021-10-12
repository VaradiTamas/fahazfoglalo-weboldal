const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Booking = require('../models/booking');
const controlPaidBooking = require("../middleware/checkIsPaidState");
const nodemailer = require("nodemailer");

router.post('/sendmail', (req, res) => {
  console.log('email sending request came');
  let bookingData = req.body;
  sendMail(bookingData, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.send(info);
    }
  });
});

const sendMail = (bookingData, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "varadi.thomas@gmail.com",
      pass: "98Ujjelszo89"
    }
  });

  const mailOptions = {
    from: `"Tamas Varadi", "varadi.thomas@gmail.com"`,
    to: bookingData.email,
    subject: "proba email",
    html: "<h1>And here is the place for HTML</h1>"
  };

  transporter.sendMail(mailOptions, callback);
}

router.post('', controlPaidBooking, (req,res,next) => {
  const booking = new Booking({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    numOfChildren: req.body.numOfChildren,
    numOfAdults: req.body.numOfAdults,
    numOfBedrooms: req.body.numOfBedrooms,
    comment: req.body.comment,
    isPaid: req.body.isPaid,
    voucherId: req.body.voucherId,
    from: req.body.from,
    to: req.body.to,
    offerName: req.body.offerName
  });
  booking.save().then(createdBooking => {
    res.status(201).json({
      message: 'Booking added successfully',
      bookingId: createdBooking._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a booking failed!"
    });
  });
});

router.get('', checkAuth, (req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const bookingQuery = Booking.find().sort({from: -1});
  let fetchedBookings;
  if(pageSize && currentPage){
    bookingQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  bookingQuery
    .then(bookings => {
      fetchedBookings = bookings;
      return Booking.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Bookings fetched successfully!",
        bookings: fetchedBookings,
        maxBookings: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching bookings failed!"
      });
    });
});

router.use('/delete/:id', checkAuth, (req,res,next) => {
  Booking.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Booking deleted!"});
  }).catch(error => {
    res.status(500).json({
      message: "Deleting booking failed!"
    });
  });
});

router.put('/edit/:id', checkAuth, (req,res,next) => {
  const booking = new Booking({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    numOfChildren: req.body.numOfChildren,
    numOfAdults: req.body.numOfAdults,
    numOfBedrooms: req.body.numOfBedrooms,
    comment: req.body.comment,
    isPaid: req.body.isPaid,
    voucherId: req.body.voucherId,
    from: req.body.from,
    to: req.body.to,
    offerName: req.body.offerName,
  });
  Booking.updateOne({_id: req.params.id}, booking).then(result => {
      res.status(200).json({message: 'Update successful!'});
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update booking!"
    });
  });
});

router.get('/reserved-days', (req,res,next) => {
  const currentYear = +req.query.year;
  const currentMonth = +req.query.month;

  let fromYear;
  let fromMonth;

  let toYear;
  let toMonth;

  if(currentMonth == 0){
    fromYear = currentYear - 1;
    fromMonth = 10;
  } else if (currentMonth == 1){
    fromYear = currentYear - 1;
    fromMonth = 11;
  } else {
    fromYear = currentYear;
    fromMonth = currentMonth - 2;
  }

  if(currentMonth == 10){
    toYear = currentYear + 1;
    toMonth = 0;
  } else if (currentMonth == 11){
    toYear = currentYear + 1;
    toMonth = 1;
  } else{
    toYear = currentYear;
    toMonth = currentMonth + 2;
  }

  const fromDate = new Date();
  const toDate = new Date();

  fromDate.setFullYear(fromYear, fromMonth,1);
  toDate.setFullYear(toYear, toMonth,1);

  Booking.find( { $and: [ { from: { $gte: fromDate } }, { from: { $lt: toDate } } ] } )
    .then(bookings => {
      if(bookings){
        res.status(200).json(bookings.map(booking => {
          fromDates = {year: booking.from.getFullYear(), month: booking.from.getMonth(), day: booking.from.getDate()}
          toDates = {year: booking.to.getFullYear(), month: booking.to.getMonth(), day: booking.to.getDate()}
          return {from: fromDates, to: toDates};
        }));
      } else {
        res.status(200).json({ from : null, to: null });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Finding reserved dates failed!"
      });
    });
});

router.get('/:id', checkAuth, (req,res,next) => {
  Booking.findById(req.params.id).then(booking => {
    if(booking){
      res.status(200).json(booking);
    } else{
      res.status(404).json({message: 'Booking not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching booking failed!"
    });
  });
});

module.exports = router;
