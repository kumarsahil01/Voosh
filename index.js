const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser=require("body-parser")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");


const User=require("./Models/User")
const AuthRoute=require("./Routes/AuthRoutes")
const UserRoute=require('./Routes/UserRoutes')
const ImageRoute=require('./Routes/ImageRotes')


const passport = require("passport");
const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("connected to mongo db");
  } catch (error) {
    console.error(error);
  }
};
//session middleware 
app.use(session({
  secret:process.env.JWT_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}))
passport.serializeUser(function(user, done) {
  done(null, user.id); 
});
app.use(passport.initialize());
app.use(passport.session())

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); } 
    done(null, user);
  });
});

app.use(
  (cors = require("cors")({
    origin: "http://localhost:3000",
    credentials: true,
  }))
);
app.use(bodyParser.json());
app.use(cookieParser());


app.listen(8000, () => {
  connect();
  console.log("backend server is running  at port 8000");
});
app.use('/api/auth',AuthRoute)
app.use('/api/user',UserRoute)
app.use('/api/image',ImageRoute)
