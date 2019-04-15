//
// WebScrape application
//
// This Application allows users to view and leave comments on the latest
// Green Bay Packer news. Go Pack!!!!
// 
// PackerNewsNote.js - Packer News Mongoose database schema

// Load mongoose library
var mongoose = require("mongoose");

// Get reference to the Mongoose Schema constructor
var Schema = mongoose.Schema;

// Create Packer News database schema
var PackerNewsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Set up a Packer news note assocation
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Packer News model
var PackerNews = mongoose.model("PackerNews", PackerNewsSchema);

// Export the Packer News model
module.exports = PackerNews;
