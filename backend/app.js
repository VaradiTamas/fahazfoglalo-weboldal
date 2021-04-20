const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookingsRoutes = require("./routes/bookings");
const vouchersRoutes = require("./routes/vouchers");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://fahazfoglalo:ChsgicCcXqDvda26@cluster0.vyq6f.mongodb.net/firstDatabase?w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    console.log('Connected to database!');
  })
  .catch(()=>{
    console.log('Connection to database failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/admin/bookings", bookingsRoutes);
app.use("/admin/vouchers", vouchersRoutes);
app.use("/admin/user", userRoutes);

module.exports = app;
