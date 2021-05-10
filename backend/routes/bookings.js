const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Booking = require('../models/booking');
const controlPaidBooking = require("../middleware/checkIsPaidState")

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
  const year = +req.query.year;
  const month = +req.query.month;

  const fromDate = new Date();
  fromDate.setFullYear(year, month, 1);

  const toDate = new Date();
  if(month == 11){
    toDate.setFullYear(year + 1,1,1);
  }else{
    toDate.setFullYear(year, month +1, 1);
  }

  Booking.find( { $and: [ { from: { $gte: fromDate } }, { from: { $lt: toDate } } ] } )
    .then(bookings => {
      if(bookings){
        res.status(200).json(bookings.map(booking => {
          var reservedDays = [];
          const firstDay = booking.from.getDate();
          const lastDay = booking.to.getDate();
          for(let i = firstDay; i < lastDay; i++){
            if(i <= 31 && i >= firstDay){
              reservedDays.push(i);
            }
          }
          return {days: reservedDays};
        }));
      } else {
        res.status(200).json({days: []});
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
