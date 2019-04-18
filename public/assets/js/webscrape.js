//
// WebScrape application
//
// This Application allows users to view and leave comments on the latest
// Green Bay Packer news. Go Pack!!!!
// 
// webscrape.js - UI javascript for WebScrape 
//

//
// Wait for the DOM to settle in
// 
$(function() {
  
    // Function to scrape new articles
    $(".scrape-articles").on("click", function(event) {

      // Get article count
      var articleCount = $(".articles li").length;

      // Only scrape if no articles are displayed
      if (articleCount == 0) {
        // Send the PUT request.
        $.ajax("/api/scrape/", {
          type: "POST"
        }).then(
          function() {
            // Reload page
            location.reload();
          }
        );
      }
    });
  
    // Function to clear the articles
    $(".clear-articles").on("click", function(event) {
  
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

    // Function to save the article notes
    $(".note-save-button").on("click", function(event) {

      // Get the article id
      var thisId = $(this).attr("data-id");

      // Getthe note
      var newNote = $(".new-note").val().trim();
      if (newNote.length == 0)
        return;
    
      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/api/articles/" + thisId,
        data: {
          // Get note from the text area
          body: newNote
        }
      }).then(function(data) {
          //console.log(data);
          // Dismiss modal dialog
          $("#myModal").modal("hide");
        });
    
        // Clear textarea
        $(".new-note").val("");
      }); 

    // Function to add/display article notes
    $(".add-note").click(function(event) {

      // Get the article id
      var thisId = $(this).attr("data-id");

      // Set article id on the save note button
      $(".note-save-button").attr("data-id", $(this).attr("data-id"));
    
      // Now make an ajax call for the article and notes
      $.ajax({
        method: "GET",
        url: "/api/articles/" + thisId
      }).then(function(data) {
         console.log(data);

          // Get the notes list and clear it
          var notesListUl = $(".notes-list");
          $(notesListUl).empty();

          // Add notes to the notes list
          if (data.notes.length > 0) {
            for (var i = 0; i < data.notes.length; i++) {
              var li = $("<li class=\"note-item\"></li>");
              var span = $("<span class=\"article-note\">" + data.notes[i].body + "</span><button class=\"btn btn-danger btn-xs delete-note-button\" data-id=\"" + data.notes[i]._id + "\"><i class=\"fa fa-trash-o\"></i></button>");
              $(li).append(span)
              $(notesListUl).append(li);
            }
          } else {
            var li = $("<li class=\"note-item\"></li>");
            var span =$("<span class=\"article-note\">No notes available for this article</span>");
            $(li).append(span)
            $(notesListUl).append(li);
          }

          // Setup callback to delete notes
          $(".delete-note-button").on("click", deletePackerNote);

          // Show add note dialog
          $("#myModal").modal("show");
        });
    });    
  
    // Function to delete a note
   function deletePackerNote(event) {

      // Get the event target
      var target = $(event.currentTarget);

      // Get the parent li tag
      var liTag = target.parent();
  
      // Send the GET request.
      $.ajax({
        type: "GET",
        url: "/api/delete/" + target.attr("data-id"),
      }).then(
        function(resp) {
          console.log("response=" + resp);
          // Remove the note for the UI
          liTag.remove();                

          // Get current note count
          var notesCount = $(".notes-list li").length;

          // Indicate no notes available if count equals 0
          if (notesCount == 0) {          
            var notesListUl = $(".notes-list");
            var li = $("<li class=\"note-item\"></li>");
            var span =$("<span class=\"article-note\">No notes available for this article</span>");
            $(li).append(span)
            $(notesListUl).append(li);
          }
        }
      );
    };
     
  });