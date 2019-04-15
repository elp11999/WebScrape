//
// WebScrape application
//
// This Application allows users to view and leave comments on the latest
// Green Bay Packer news. Go Pack!!!!
// 
// index.js - Export the Packer Mongoose database schemas

module.exports = {
  PackerNews: require("./PackerNews"),
  PackerNewsNotes: require("./PackerNewsNotes")
};
