// script for moving through the sections on the same page---------------------
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".menu a");
  const courseSection = document.querySelector(".course-section");

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", function (event) {
      const targetId = menuLink.getAttribute("href").substring(1); // Remove the leading '#' from the href
      const targetSection = document.getElementById(targetId);

      // Hide all sections
      const sections = document.querySelectorAll(".section");
      sections.forEach(function (section) {
        section.style.display = "none";
      });

      // Hide the old course-section
      courseSection.style.display = "none";

      // Show only the targeted section
      targetSection.style.display = "block";

      // Remove active class from all links
      menuLinks.forEach(function (link) {
        link.classList.remove("active");
      });

      // Add active class to the clicked link
      menuLink.classList.add("active");

      event.preventDefault(); // Prevent the default behavior of the link
    });
  });
});

// script for the category---------------------------------------
function toggleDropdown() {
  document.getElementById("categoryDropdown").classList.toggle("show");
}

function searchCategory() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("categorySearchInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("categoryDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

// script for making the numbers of analysis increase----------------------------
window.addEventListener("DOMContentLoaded", () => {
  const totalCoursesSpan = document.getElementById("total-courses");
  const coursesPerMonthSpan = document.getElementById("courses-per-month");
  const completedPercentageSpan = document.getElementById(
    "completed-percentage"
  );

  const totalCourses = 105; /*  total courses value */
  const coursesPerMonth = 15; /*  courses per month value */
  const completedPercentage = 76; /*  completed percentage value */

  animateNumber(totalCoursesSpan, totalCourses);
  animateNumber(coursesPerMonthSpan, coursesPerMonth);
  animatePercentage(completedPercentageSpan, completedPercentage);
});

function animateNumber(element, finalValue) {
  let currentValue = 0;
  const increment = Math.ceil(finalValue / 100); // Divide final value by 100 for smooth animation
  const interval = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue;
    if (currentValue >= finalValue) {
      clearInterval(interval);
    }
  }, 20); // Adjust the interval for desired animation speed
}

function animatePercentage(element, finalValue) {
  let currentValue = 0;
  const increment = Math.ceil(finalValue / 100); // Divide final value by 100 for smooth animation
  const interval = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue + "%";
    if (currentValue >= finalValue) {
      clearInterval(interval);
    }
  }, 20); // Adjust the interval for desired animation speed
}

//AJAX
document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/stdProfile/api/", {
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
      document.querySelector(".areasOfInterest").textContent =
        data.areas_of_interest;

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
