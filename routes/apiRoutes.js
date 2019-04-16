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

// Express routes
module.exports = function(app) {

    // Route for getting all Articles from the db
    app.get("/", function(req, res) {
      // Get all Packer articles
      db.PackerNews.find({})
        .then(function(dbArticles) {
          console.log(dbArticles);          
            var newsObject = {
                articles: dbArticles
            };
          
          res.render("index", newsObject);
        })
        .catch(function(err) {
          res.json(err);
        });
    });    
    
    // Scrape the Packer news site
    app.post("/api/scrape", function(req, res) {

        // Clear out current values
        //db.packernews.remove({});

        axios.get("http://www.espn.com/nfl/team/_/name/gb/green-bay-packers/").then(function(response) {
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
                        console.log(dbArticle);
                        })
                        .catch(function(err) {
                        console.log(err);
                        });
                    
                    //console.log(result);
                }
            });

            // Send a message to the client
            res.send("Scraping is all done!!!");
        });
    });
};
