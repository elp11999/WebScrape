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
    
    // Scrape the Packer news site
    app.get("/scrape", function(req, res) {
        axios.get("https://packerswire.usatoday.com/category/latest-packers-news/").then(function(response) {
            const $ = cheerio.load(response.data, {normalizeWhitespace: true});
            
            // Find the news articles
            $("article h3").each(function(i, element) {
                let result = {};

                // Get the link
                result.link = $(this)
                    .children("a")
                    .attr("href");
                
                // Get the title
                result.title = $(this)
                    .children("a")
                    .text();

                // Get a short description....

                // Create a new database entry for the Packer news article
                db.PackerNews.create(result)
                    .then(function(dbArticle) {
                    console.log(dbArticle);
                    })
                    .catch(function(err) {
                    console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scraping is all done!!!");
        });
    });
};
