

//
// Wait for the DOM to settle in
// 
$(function() {
    console.log("WebScrape.js started!!!");
  
    // Function to scrape new articles
    $(".scrape-articles").on("click", function(event) {
      console.log("WebScrape: clear articles!!!");
  
      // Send the PUT request.
      $.ajax("/api/scrape/", {
        type: "POST"
      }).then(
        function() {
          location.reload();
        }
      );
    });
  
    // Function to clear the current articles
    $(".clear-articles").on("click", function(event) {
      console.log("WebScrape: clear articles!!!");
  
      // Send the PUT request.
      $.ajax("/api/clear/", {
        type: "POST"
      }).then(
        function(resp) {
          console.log("response=" + resp);
          // Reload the page
          location.reload();
        }
      );
    });

    // Show Add note modal dialog
    $(".add-note").click(function(event) {
        // Show add note dialog
        $("#myModal").modal("show");
    });

  });