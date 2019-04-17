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

// URL to scrape
const URL = "http://www.espn.com/nfl/team/_/name/gb/green-bay-packers/";

// Express routes
module.exports = function(app) {

    // Route for getting all Articles from the db
    app.get("/", function(req, res) {
      // Get all Packer articles
      db.PackerNews.find({})
        .then(function(dbArticles) {
          ///console.log(dbArticles);          
            var newsObject = {
                articles: dbArticles
            };

          // Render the main page
          res.render("index", newsObject);
        })
        .catch(function(err) {
          console.log("Find failed: " + err);
          // Send error message to the client 
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
                    result.link = "http://www.espn.com" + $(h1Tag)
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
          // Send error message to the client 
          res.json(err);
        });
    });
    
    // Route for saving/updating an Article's associated Note
    app.post("/api/articles/:id", function(req, res) {
      // Create a new note and pass the req.body to the entry
      db.PackerNewsNotes.create(req.body)
        .then(function(dbNote) {
          // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
          // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          return db.PackerNews.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/api/articles/:id", function(req, res) {
      // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
      db.PackerNews.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
          // If we were able to successfully find an Article with the given id, send it back to the client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
    
};
