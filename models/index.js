//
// WebScrape application
//
// This NodeJS Application allows users to view and leave comments on the latest
// Green Bay Packer news artices from www.espn.com. The application will save the
// articles and comments to a Mongo Database.
// 
// index.js - Export the Packer Mongoose database schemas

module.exports = {
  PackerNews: require("./PackerNews"),
  PackerNewsNotes: require("./PackerNewsNotes")
};
