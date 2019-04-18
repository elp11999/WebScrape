//
// WebScrape application
//
// This NodeJS Application allows users to view and leave comments on the latest
// Green Bay Packer news artices from www.espn.com. The application will save the
// articles and comments to a Mongo Database.
// 
// server.js - Entry point to the WebScrape application
//

// Load Express libray
const express = require("express");

// Load Express Handlebars library
const exphbs = require("express-handlebars");

// Load Path library
const path = require("path");

// Load Mongoose library
const mongoose = require("mongoose");

// Load Mongoose database schemas
const db = require("./models");

// Create express object
const app = express();

// Setup Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup location of static html content
app.use(express.static(path.join(__dirname, "public")));

// Set up Express Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Load API Routes library
require("./routes/apiRoutes")(app);

// Set port to listen on
const PORT = process.env.PORT || 3000;

// Set Mongo DB URL
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Lets get the app going
app.listen(PORT, function() {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});

// Export the Express object
module.exports = app;