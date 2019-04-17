//
// WebScrape application
//
// This Application allows users to view and leave comments on the latest
// Green Bay Packer news. Go Pack!!!!
// 
// PackerNewsNote.js - Packer News Notes Mongoose database schema

// Load mongoose library
var mongoose = require("mongoose");

// Get reference to the Mongoose Schema constructor
var Schema = mongoose.Schema;

// Create Packer News Note database schema
var PackerNewsNotesSchema = new Schema({
  // `title` is of type String
  //title: String,
  // `body` is of type String
  body: String
});

// Create the Packer News Note model
var PackerNewsNotes = mongoose.model("PackerNewsNotes", PackerNewsNotesSchema);

// Export the Packer News Note model
module.exports = PackerNewsNotes;
