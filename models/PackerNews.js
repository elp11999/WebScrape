//
// WebScrape application
//
// This NodeJS Application allows users to view and leave comments on the latest
// Green Bay Packer news artices from www.espn.com. The application will save the
// articles and comments to a Mongo Database.
// 
// PackerNewsNote.js - Packer News Mongoose database schema

// Load mongoose library
var mongoose = require("mongoose");

// Get reference to the Mongoose Schema constructor
var Schema = mongoose.Schema;

// Create Packer News database schema
var PackerNewsSchema = new Schema({
  // News Title
  title: {
    type: String,
    required: true,
    unique: true    // Make title be a unique key
  },

  // News Link
  link: {
    type: String,
    required: true
  },

  // News Description
  description: {
    type: String,
    required: true
  },

  // News Image
  image: {
    type: String,
    required: false
  },
  
  // Set up a Packer news note assocation
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "PackerNewsNotes"
    }
  ]
});

// Create the Packer News model
var PackerNews = mongoose.model("PackerNews", PackerNewsSchema);

// Export the Packer News model
module.exports = PackerNews;
