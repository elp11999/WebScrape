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
        axios.get("http://www.espn.com/nfl/team/_/name/gb/green-bay-packers/").then(function(response) {
            const $ = cheerio.load(response.data, {normalizeWhitespace: true});
            
            $("article").each(function(i, element) {
                let result = {};
                console.log("found a article");                

                // Get the <h1> tag
                let figureTag = $(this).children("figure");
                if (figureTag.length > 0) {
                    let divTag = $(figureTag).children("div");
                    let aTag = $(divTag).children("a");
                    let pictureTag = $(aTag).children("picture");
                    let imgTag = $(pictureTag).children("img");

                    // Get the image link
                    result.link = $(imgTag).attr("data-default-src");
                    console.log("imgTag src==" + result.link);
                };    
            });
            
            /*
            $(".item-info-wrap").each(function(i, element) {
                let result = {};

                console.log("New stuff!!!!");

                // Get the <h1> tag
                let h1Tag = $(this).children("h1"); 
                
                // Get the <p> tag
                let pTag = $(this).children("p");

                // Get the link
                result.link = $(h1Tag)
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
            });


            */

            // Send a message to the client
            res.send("Scraping is all done!!!");
        });
    });
};
