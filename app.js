// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
const dotenv = require('dotenv').config()

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
const app = express();
require("./config")(app);
// ---------------------------------------------------
//      EXPRESS-SESSION CONFIG
// ---------------------------------------------------
const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(session({
  secret: process.env.SESSION_SECRET, //DON’T FORGET TO ADD THIS IN YOUR .‘.env’ File
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 24* 60 * 60 // your cookie will be cleared after these secondsy
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/ironstore",
    // Time to Live for sessions in DB. After that time it will delete it!
    ttl: 24* 60 * 60 // your session will be cleared after these seconds
  })
}));
// ---------------------------------------------------
//      EXPRESS-SESSION CONFIG
// ---------------------------------------------------
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes");
app.use("/api", allRoutes)

//auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const orderRoutes = require("./routes/Order.route");
app.use('/api', orderRoutes);

const productsRoutes = require("./routes/Products.route");
app.use('/api',productsRoutes);

const fileUploadRoutes = require('./routes/File-upload.routes')
app.use("/api", fileUploadRoutes);

//stripe routes
const stripeRoutes = require("./routes/stripe.routes")
app.use("/api", stripeRoutes);

//heroku
app.use((req, res, next) => {
	// If no routes match, send them the React HTML.
	res.sendFile(__dirname + "/public/index.html");
});



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;



//dependencies
// "multer": "^1.4.3",
//     "multer-storage-cloudinary": "^4.0.0",
//     "stripe": "^8.191.0"
//      "cloudinary": "^1.27.1",



