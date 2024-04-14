$(document).ready(function () {
  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (
        !/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) &&
        !this.crossDomain
      ) {
        xhr.setRequestHeader(
          "X-CSRFToken",
          $('input[name="csrfmiddlewaretoken"]').val()
        );
      }
    },
  });

  // Sidebar toggle
  $(".btn").click(function () {
    $(".sidebar").toggleClass("collapsed");
  });

  // Use event delegation for dynamically created `.feat-btn`
  $(document).on("click", ".feat-btn", function () {
    $(this).next(".feat-show").slideToggle();
    $(this).find(".fa-caret-down").toggleClass("rotate");
  });

  // Since you have similar functionality, consolidate your handling for both feat-btn and serv-btn
  $(document).on("click", ".serv-btn", function () {
    $(this).next(".serv-show").slideToggle();
    $(this).find(".fa-caret-down").toggleClass("rotate");
  });

  // Modal toggle for lessons
  $(document).on("click", ".addLessonBtn", function () {
    var sectionId = $(this).closest("li.list-sidenev").data("section-id"); // Retrieve the section ID
    $("#createLessonModal")
      .data("sectionId", sectionId)
      .css("display", "block"); // Store it in the modal for later use
  });

  // add section part
  $("#createSectionBtn").click(function () {
    $("#createSectionModal").css("display", "block");
  });

  // Closing modals
  $(".close").click(function () {
    $(this).closest(".modal").css("display", "none");
  });

  window.onclick = function (event) {
    if (event.target == document.getElementById("createSectionModal")) {
      document.getElementById("createSectionModal").style.display = "none";
    }
    if (event.target == document.getElementById("createLessonModal")) {
      document.getElementById("createLessonModal").style.display = "none";
    }
  };

  // Form submissions for sections and lessons
  $("#sectionForm").submit(function (event) {
    event.preventDefault();
    const courseId = getCourseIdFromURL(); // Assuming this function is defined to extract the course ID from URL

    var sectionTitle = $("#sectionTitle").val();
    var sectionDesc = $("#sectionDesc").val();

    // Construct the data object
    var postData = {
      title: sectionTitle,
      description: sectionDesc,
    };

    // Perform the AJAX POST request
    $.ajax({
      url: `/addSection/api/${courseId}/`, // Adjust this URL to your API endpoint
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(postData),
      success: function (section) {
        console.log("Section created successfully:", section);
        appendNewSectionToUI(section);
        $("#createSectionModal").css("display", "none"); // Close the modal on success
      },
      error: function (xhr, status, error) {
        console.error("Failed to create section:", xhr.responseText);
        alert("Failed to create section. Please try again.");
      },
    });
  });

  function appendNewSectionToUI(section) {
    var $sectionList = $(".sidebar > ul");
    var $section = $("<li>")
      .addClass("list-sidenev")
      .data("section-id", section.id);
    var $sectionLink = $("<a>")
      .addClass("sectionTitle a-sidenev feat-btn")
      .attr("href", "#")
      .text(section.title);
    var $caret = $("<span>").addClass("fas fa-caret-down first");
    $sectionLink.append($caret);

    var $lessonsList = $("<ul>").addClass("feat-show").css("display", "none");
    $lessonsList.append(
      $("<li>").append(
        $("<a>")
          .addClass("addLessonBtn")
          .attr("href", "#")
          .text("Add New Lesson")
      )
    );

    $section.append($sectionLink).append($lessonsList);
    $sectionList.append($section);
  }

  function getCourseIdFromURL() {
    var pathname = window.location.pathname;
    var segments = pathname.split("/");
    return segments[segments.length - 2]; // Adjust if necessary based on your URL structure
  }

  $("#lessonForm").submit(function (event) {
    event.preventDefault();
    var sectionId = $("#createLessonModal").data("sectionId"); // Retrieve the stored section ID
    var lessonTitle = $("#lessonTitle").val();

    $.ajax({
      url: `/addLesson/api/${sectionId}/`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ title: lessonTitle }),
      success: function (lesson) {
        $("#createLessonModal").css("display", "none");
        appendNewLessonToUI(lesson, sectionId);
        var $lessonsList = $('li.list-sidenev[data-section-id="' + sectionId + '"]').find(".feat-show");
        // Create the new lesson element with lesson ID
    var $lessonItem = $("<li>").data("lesson-id", lesson.id);  // Set lesson ID here
    var $lessonLink = $("<a>")
        .addClass("lessonTitle")
        .attr("href", "#")
        .text(lesson.title)
        .data("content", lesson.contents || []);
    $lessonItem.append($lessonLink);

    // Append the new lesson to the list
    $lessonsList.append($lessonItem);
        
        
        // Call to a new function to handle UI update
        alert("Lesson added successfully!");
      },
      error: function (xhr) {
        alert("Failed to add lesson. Please try again.");
        console.error("Error:", xhr.responseText);
      },
    });
  });

  // Function to append the new lesson to the UI under the correct section
  function appendNewLessonToUI(lesson, sectionId) {
    // Find the section list where the lesson needs to be added
    var $lessonsList = $(
      'li.list-sidenev[data-section-id="' + sectionId + '"]'
    ).find(".feat-show");

    // Create the new lesson element
    var $lessonLink = $("<a>")
      .addClass("lessonTitle")
      .attr("href", "#")
      .text(lesson.title)
      .data("content", lesson.contents || []);
    var $lessonItem = $("<li>").append($lessonLink);

    // Append the new lesson to the list
    $lessonsList.append($lessonItem);
  }

  // Fetch and update course details dynamically
  function getCourseIdFromURL() {
    const pathname = window.location.pathname;
    const segments = pathname.split("/");
    return segments[segments.length - 2];
  }

  function fetchCourseDetails() {
    const courseId = getCourseIdFromURL(); // Ensure this ID is fetched correctly
    $.ajax({
      url: `/courseInner/api/${courseId}/`,
      type: "GET",
      dataType: "json",
      success: function (course) {
        updateCourseDetails(course);
      },
      error: function (error) {
        console.error("Failed to fetch course details:", error);
      },
    });
  }

  function updateCourseDetails(course) {
    $(".courseTitle").text(course.title);
    $(".Course-Title").text(course.title);
    $(".Course-topic").text(course.category);
    $(".Course-deficality").text(course.difficultyLevel);
    $(".Course-description").text(course.description);
    $(".coures-inner-img").attr(
      "src",
      course.coursePic || "/path/to/default/image.jpg"
    );

    $(".sidebar > ul").empty(); // Clear previous content

    course.sections.forEach(function (section) {
      var sectionEl = $("<li>")
        .addClass("list-sidenev")
        .data("section-id", section.id);

      var editIcon = $("<span>")
        .addClass("fas fa-edit edit-section")
        .attr("title", "Edit Section");
      var deleteIcon = $("<span>")
        .addClass("fas fa-trash delete-section")
        .attr("title", "Delete Section");
      var sectionLink = $("<a>")
        .addClass("sectionTitle a-sidenev feat-btn")
        .attr("href", "#");

      sectionLink
        .append(editIcon)
        .append(deleteIcon)
        .append(document.createTextNode(section.title)) // Ensure text is appended after icons
        .append($("<span>").addClass("fas fa-caret-down first")); // Caret icon

      var lessonsList = $("<ul>").addClass("feat-show").css("display", "none");

      lessonsList.append(
        $("<li>").append(
          $("<a>")
            .addClass("addLessonBtn")
            .attr("href", "#")
            .text("Add New Lesson")
        )
      );

      section.lessons.forEach(function (lesson) {
        var $lessonItem = $("<li>");
        var $lessonContainer = $("<div>").addClass("lesson-container");

        var editIcon = $("<span>")
          .addClass("fas fa-edit edit-lesson")
          .attr("title", "Edit Lesson")
          .data("lesson-id", lesson.id);

        var deleteIcon = $("<span>")
          .addClass("fas fa-trash delete-lesson")
          .attr("title", "Delete Lesson")
          .data("lesson-id", lesson.id);

        var $lessonLink = $("<a>")
          .addClass("lessonTitle")
          .attr("href", "#")
          .data("content", lesson.contents)
          .data("lesson-id", lesson.id)
          // Store the entire contents array
          .text(lesson.title);
        $lessonContainer.append(editIcon, deleteIcon, $lessonLink);

        // Append the container to the list item
        $lessonItem.append($lessonContainer);
        lessonsList.append($lessonItem);
      });

      sectionEl.append(sectionLink).append(lessonsList);
      $(".sidebar > ul").append(sectionEl);
    });
  }

  fetchCourseDetails();

  // Hide both sections initially (if not already hidden by CSS)
  $(".course-content").hide();
  $(".form1").hide();

  // Toggle course content visibility on clicking the course title
  $("#courseTitle").click(function () {
    $(".course-content").slideToggle(); // Toggle visibility of course content
    $(".form1").hide(); // Ensure the editor is hidden
  });

  // Show editor and load content when a lesson title is clicked
  $(document).on("click", ".lessonTitle", function () {
    $(".course-content").hide(); // Hide course content
    $(".form1").show(); // Make sure the editor is shown
    // Retrieve the lesson contents array from the data attribute
    var contents = $(this).data("content"); // This is an array of objects

    // Create a string from the contents array
    var contentString = contents.map((content) => content.reference).join(" "); // Join all references with a space

    // Update the Quill editor with the content
    if (quill) {
      quill.root.innerHTML = contentString; // Load the concatenated string into Quill
    } else {
      console.error("Quill not initialized");
    }
  });
});

/////
// for the editor-------------------------------------------------------------
// Initialize Quill.js on the editor container
var quill = new Quill("#editor-container", {
  theme: "snow", // Specify theme, 'snow' is one of the built-in themes
});

// Listen for form submission
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    // Get Quill's HTML content
    var descriptionHtml = document.querySelector(".ql-editor").innerHTML;

    // Set the HTML content to the hidden input field
    var descriptionTextArea = document.querySelector(
      'textarea[name="description"]'
    );
    descriptionTextArea.value = descriptionHtml;
  });
});


// Adjust AJAX calls for deleting sections
$(document).on("click", ".delete-section", function() {
    var sectionId = $(this).closest("li.list-sidenev").data("section-id");
    if(confirm("Are you sure you want to delete this section?")) {
        $.ajax({
            url: `/deleteSection/api/${sectionId}/`,  // Updated to Users microservice URL
            type: "DELETE",
            success: function() {
                alert("Section deleted successfully!");
                window.location.reload();  // Reload the page or dynamically remove the section from UI
            },
            error: function(xhr) {
                alert("Failed to delete the section.");
                console.error("Error:", xhr.responseText);
            }
        });
    }
});

// Adjust AJAX calls for deleting lessons
$(document).on("click", ".delete-lesson", function() {
  var lessonId = $(this).closest("li").data("lesson-id");  // Retrieve lesson ID correctly
  if(confirm("Are you sure you want to delete this lesson?")) {
        $.ajax({
            url: `/deleteLesson/api/${lessonId}/`,  // Updated to Users microservice URL
            type: "DELETE",
            success: function() {
                alert("Lesson deleted successfully!");
                window.location.reload();  // Reload the page or dynamically remove the lesson from UI
            },
            error: function(xhr) {
                alert("Failed to delete the lesson.");
                console.error("Error:", xhr.responseText);
            }
        });
    }
});
