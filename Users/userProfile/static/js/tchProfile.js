//AJAX
document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/tchrProfile/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Include CSRF Token header as needed, especially if you're making POST requests
    },
    credentials: "include", // For cookies, if session-based authentication is used
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".name-profile").textContent = data.full_name;
      document.querySelector(".ID-profile").textContent = "ID: " + data.user.id; // Adjust if you have a specific student ID field
      document.querySelector(".ProfeTitle-profile").textContent = data.professional_title;
      document.querySelector(".company-profile").textContent = "Work at: " + data.company;
      document.querySelector(".areaOfSpec").textContent = "Areas of specialization: " + data.areas_of_specialization;
      document.querySelector(".pro-links a").textContent = data.linkedIn_account;

      // Update the src for the profile picture
      let profilePicUrl = data.user.profile_pic;
      // Ensure the profile picture URL is correct, prepend '/media/' if necessary
      if (!profilePicUrl.startsWith("http")) {
        profilePicUrl = profilePicUrl; // Assuming '/media/' is already included in the path
      }
      document.getElementById("user-profile-picture").src = profilePicUrl;
    })

    .catch((error) => console.error("Error:", error));
});
