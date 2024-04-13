document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/tchrProfile/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Received JSON:", data); // Log the entire JSON to the console
      console.log("Courses data:", data.courses); // Specifically log the courses array
      if (!data.educator || !data.courses) {
        console.error("Missing 'educator' or 'courses' key in the response:", data);
      } else {
        const educator = data.educator;
        const courses = data.courses;
      document.querySelector(".name-profile").textContent = educator.full_name;
      document.querySelector(".ID-profile").textContent = "ID: " + educator.id;
      document.querySelector(".ProfeTitle-profile").textContent = educator.professional_title;
      document.querySelector(".company-profile").textContent = "Work at: " + educator.company;
      document.querySelector(".areaOfSpec").textContent = "Areas of specialization: " + educator.areas_of_specialization;
      document.querySelector(".pro-links a").textContent = educator.linkedIn_account;
      // Update the src for the profile picture
      let profilePicUrl = educator.user.profile_pic;
      // Ensure the profile picture URL is correct, prepend '/media/' if necessary
      if (!profilePicUrl.startsWith("http")) {
        profilePicUrl = profilePicUrl; // Assuming '/media/' is already included in the path
      }
      document.getElementById("user-profile-picture").src = profilePicUrl;
              // Render courses
              renderCourses(courses.filter(course => course.isPublished), 'MyPublishedCourses');
              renderCourses(courses.filter(course => !course.isPublished), 'MyArchive');
            }
          })
          .catch((error) => console.error("Error:", error));
      });
      
      function renderCourses(courses, sectionId) {
        let section; // Declare the variable to hold the correct section
    
        // Use an if statement to explicitly set the section based on sectionId
        if (sectionId === 'MyPublishedCourses') {
            section = document.getElementById('MyPublishedCourses').getElementsByClassName('course-section')[0];
        } else if (sectionId === 'MyArchive') {
            section = document.getElementById('MyArchive').getElementsByClassName('course-section')[0];

        }
    
        if (section) {
            section.innerHTML = ''; // Clear the section before appending new content
    
            courses.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.className = 'course-info';
                courseElement.onclick = function() { window.location.href = 'edit-profile.html'; };
    
                const courseImage = document.createElement('img');
                courseImage.className = 'course-image';
                courseImage.src = course.coursePic || `${STATIC_URL}images/default-course-image.jpg`;
                courseImage.alt = course.title;
    
                const courseTitle = document.createElement('div');
                courseTitle.className = 'course-title';
                courseTitle.textContent = course.title;
    
                const courseDetails = document.createElement('div');
                courseDetails.className = 'course-details';
    
                const category = document.createElement('div');
                category.className = 'category-type';
                category.textContent = course.category;
    
                const hours = document.createElement('div');
                hours.className = 'hours';
                hours.innerHTML = `<span class="emoji">&#9200;</span> ${course.duration}`;
    
                const students = document.createElement('div');
                students.className = 'students';
                students.innerHTML = `<span class="emoji">&#128100;</span> ${course.students || 'N/A'}`;
    
                const instructor = document.createElement('div');
                instructor.className = 'instructor';
                instructor.innerHTML = `<span class="emoji">&#128188;</span> ${course.instructor}`;
    
                const reviews = document.createElement('div');
                reviews.className = 'reviews';
                reviews.innerHTML = `${renderStars(course.rating)} <p>${course.reviews || '0'}</p>`;
    
                // Append all details to courseDetails
                courseDetails.append(category, hours, students, instructor, reviews);
    
                // Append all components to the main course element
                courseElement.append(courseImage, courseTitle, courseDetails);
    
                // Append the course element to the section
                section.appendChild(courseElement);
            });
        } else {
            console.error('Could not find the course section for sectionId:', sectionId);
        }
    }
    
    
    
    

function renderStars(rating) {
  const roundedRating = Math.round(rating);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < roundedRating ? '⭐' : '☆';
  }
  return stars;
}