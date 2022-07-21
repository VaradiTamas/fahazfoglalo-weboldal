const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const bookingsRoutes = require("./routes/bookings");
const vouchersRoutes = require("./routes/vouchers");
const emailsRoutes = require("./routes/emails");
const userRoutes = require("./routes/user");

const app = express();

function getDatabaseURI() {
  if (process.env.NODE_ENV === "production") {
    return `mongodb+srv://tamasvaradi:${process.env.PROD_DB_PW}@cluster0.k5ycb.mongodb.net/?retryWrites=true&w=majority`;
  }
  return `mongodb+srv://fahazfoglalo:${process.env.DEV_DB_PW}@cluster0.vyq6f.mongodb.net/firstDatabase?w=majority`;
}

mongoose.connect(getDatabaseURI(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('Connected to database!');
  })
  .catch(()=>{
    console.log('Connection to database failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use((req, res, next) => {
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
app.use("/admin/emails", emailsRoutes);
app.use("/admin/user", userRoutes);

module.exports = app;
