//
// WebScrape application
//
// This Application allows users to view and leave comments on the latest
// Green Bay Packer news. Go Pack!!!!
// 
// apiRoutes.js - Express API routes 
//

// Load Axios library
const axios = require("axios");

// Load Cheerios library
const cheerio = require("cheerio");

// Load Mongoose database schemas
const db = require("../models");

// Website name
const siteName = "http://www.espn.com";

// URL to scrape
const URL = siteName + "/nfl/team/_/name/gb/green-bay-packers/";

// Express routes
module.exports = function(app) {

    // Route for getting all articles
    app.get("/", function(req, res) {
      // Get all Packer articles
      db.PackerNews.find({})
        .then(function(dbArticles) {
            //console.log(dbArticles);          
            var newsObject = {
                articles: dbArticles
            };

          // Render the main page
          res.render("index", newsObject);
        })
        .catch(function(err) {
          console.log("Find failed: " + err);
          // Send error to client 
          res.json(err);
        });
    });    
    
    // Scrape the Packer news site
    app.post("/api/scrape/", function(req, res) {

        axios.get(URL).then(function(response) {
            const $ = cheerio.load(response.data, {normalizeWhitespace: true});
            
            $("article").each(function(i, element) {
                let result = {};

                // Get the article image link
                let figureTag = $(this).children("figure");
                if (figureTag.length > 0) {
                    let divTag = $(figureTag).children("div");
                    let aTag = $(divTag).children("a");
                    let pictureTag = $(aTag).children("picture");
                    let imgTag = $(pictureTag).children("img");

                    // Get the image link
                    result.image = $(imgTag).attr("data-default-src");
                };
                
                // Get the news article link, title, and description
                let containerDiv = $(this).children(".text-container");
                let itemInfoDiv = $(containerDiv).children(".item-info-wrap");
                if (itemInfoDiv.length > 0) {
                    // Get the <h1> tag
                    let h1Tag = $(itemInfoDiv).children("h1"); 
                    
                    // Get the <p> tag
                    let pTag = $(itemInfoDiv).children("p");

                    // Get the link
                    result.link = siteName + $(h1Tag)
                        .children("a")
                        .attr("href");
                    
                    // Get the title
                    result.title = $(h1Tag)
                        .children("a")
                        .text();

                    // Get a short description.
                    result.description = $(pTag).text();

                    // Create a new database entry for the Packer news article
                    db.PackerNews.create(result)
                        .then(function(dbArticle) {
                            //console.log(dbArticle);
                        })
                        .catch(function(err) {
                            console.log("Add failed: " + err);
                        });
                    
                    //console.log(result);
                }
            });

            // Send a message to the client
            res.json("ok");
        });
    });

    // Route for removing all Packer articles from the db
    app.post("/api/clear/", function(req, res) {
      // Remove all Packer articles
      db.PackerNews.deleteMany({})
        .then(function() {
          // Send a message to the client          
          res.json("ok");
        })
        .catch(function(err) {
          console.log("Remove failed:" + err);
          // Send error to client 
          res.json(err);
        });
    });
    
    // Route for creating an article note
    app.post("/api/articles/:id", function(req, res) {
      db.PackerNewsNotes.create(req.body)
        .then(function(dbNote) {
          // Update article with new note
          return db.PackerNews.findOneAndUpdate({ _id: req.params.id}, { $push: { notes: dbNote._id } }, { new: true });
          //return db.PackerNews.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
          // Send updated article to client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // Send error to client 
          res.json(err);
        });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/api/articles/:id", function(req, res) {
      // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
      db.PackerNews.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function(dbArticle) {
          // If we were able to successfully find an Article with the given id, send it back to the client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

    // Route for removing an article note
    app.get("/api/delete/:id", function(req, res) {
      // Remove all Packer articles
      db.PackerNewsNotes.deleteOne({ _id: req.params.id })
        .then(function() {
          // Send a message to the client          
          res.json("ok");
        })
        .catch(function(err) {
          console.log("Remove failed:" + err);
          // Send error to client 
          res.json(err);
        });
    });
    
};
