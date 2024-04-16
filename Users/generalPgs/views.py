# views.py in Users microservice

from django.conf import settings
from django.http import Http404
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render, redirect



class CourseListView(APIView):
    def get(self, request, *args, **kwargs):
        # Construct the full URL using the settings value
        courses_service_url = settings.COURSES_SERVICE_URL
        endpoint = f"{courses_service_url}/courses/publishedCourses/api/"  # Adjusted path

        response = requests.get(endpoint)
        if response.status_code == 200:
            # Process the data here if necessary before sending it to the front-end
            return Response(response.json())
        else:
            return Response({"error": "Failed to fetch courses"}, status=response.status_code)
        

class CourseDetailView(APIView):
    def get(self, request, course_id, *args, **kwargs):
        # Construct the full URL using the settings value
        courses_service_url = settings.COURSES_SERVICE_URL
        endpoint = f"{courses_service_url}/courses/courses/api/{course_id}/"  # Adjusted path for a specific course

        response = requests.get(endpoint)
        if response.status_code == 200:
            # Optionally process the data here before sending it to the front-end
            return Response(response.json())
        else:
            return Response({"error": "Failed to fetch course details"}, status=response.status_code)
        

class CourseDetailPageView(APIView):
    def get(self, request, course_id, *args, **kwargs):
        courses_service_url = settings.COURSES_SERVICE_URL
        endpoint = f"{courses_service_url}/courses/courses/api/{course_id}/"

        try:
            response = requests.get(endpoint)
            response.raise_for_status()  # Raises an HTTPError for bad responses
            course = response.json()
            return render(request, 'courseinfo.html', {'course': course})
        except requests.exceptions.RequestException as e:
            raise Http404("Course not found or error in fetching course data")

        
@login_required
def listCourses(request):
    return render(request, 'courses.html')


def innerCourse(request):
    return render(request, 'CourseInner.html')


class CourseContentDetailView(APIView):
    def get(self, request, course_id):
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/courses/api/{course_id}/"
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.json())
        else:
            return Response({"error": "Failed to fetch course details"}, status=response.status_code)


class CourseDetailsView(APIView):
    def get(self, request, course_id):
        # Construct the URL to fetch the course details from the Courses microservice
        courses_service_url = settings.COURSES_SERVICE_URL
        endpoint = f"{courses_service_url}/courses/courses/api/{course_id}/"

        try:
            # Make the request to the Courses microservice
            response = requests.get(endpoint)
            response.raise_for_status()  # This will raise an exception for 4XX and 5XX status codes
            course_details = response.json()
        except requests.RequestException as e:
            # Log the error and show a user-friendly message
            print(e)
            raise Http404("The course data could not be retrieved.")

        # Render the template with the course details
        return render(request, 'CourseInner.html', {'course': course_details})
    
    
class SectionCreateView(APIView):
    def post(self, request, course_id):
        # URL of the Courses microservice
        courses_service_url = settings.COURSES_SERVICE_URL
        # Append the appropriate endpoint
        url = f"{courses_service_url}/courses/{course_id}/sections/"
        
        # Forward the POST request to the Courses microservice
        response = requests.post(url, json=request.data)
        
        if response.status_code == 201:
            return Response(response.json(), status=status.HTTP_201_CREATED)
        return Response(response.json(), status=response.status_code)
    
    
class LessonCreateProxyView(APIView):
    def post(self, request, section_id):
        # Adjust with the actual URL of the Courses microservice
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/sections/{section_id}/lessons/"
        response = requests.post(url, json=request.data)
        return Response(response.json(), status=response.status_code)
    
    
    
class DeleteSectionView(APIView):
    def delete(self, request, section_id):
        # Construct the URL to the Courses service
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/deleteSections/{section_id}/"

        # Forward the DELETE request to the Courses microservice
        response = requests.delete(url)

        # Return the same response status and data
        return Response(status=response.status_code, data=response.json() if response.content else None)
    
    
class DeleteLessonView(APIView):
    def delete(self, request, lesson_id):
        # Construct the URL to the Courses service
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/deleteLessons/{lesson_id}/"
        # Forward the DELETE request to the Courses microservice
        response = requests.delete(url)
        # Return the same response status and data
        return Response(status=response.status_code, data=response.json() if response.content else None)
    

class UpdateLessonProxyView(APIView):
    def post(self, request, lesson_id):
        # Construct the URL to the Courses service
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/updateLesson/api/{lesson_id}/"

        # Forward the POST request to the Courses microservice
        response = requests.post(url, json=request.data, headers={'Content-Type': 'application/json'})

        # Check for success status in the response
        if response.status_code == 200:
            return Response(response.json(), status=response.status_code)
        else:
            # Handle any errors that occur during the request
            return Response({"error": "Failed to update the lesson"}, status=response.status_code)

class SectionUpdateProxyView(APIView):
    def post(self, request, pk):
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/updateSection/api/{pk}/"  # Make sure URL is correct
        # Forward the PATCH request to the Courses microservice without the token
        response = requests.patch(url, json=request.data, headers={'Content-Type': 'application/json'})

        # Check for success status in the response
        if response.status_code == 200:
            return Response(response.json(), status=response.status_code)
        else:
            # Handle any errors that occur during the request
            return Response({"error": "Failed to update the section"}, status=response.status_code)

class ContentProxyView(APIView):
    def post(self, request):
        # Forwarding creation requests to the Course Microservice
        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/content/"  # Assuming the endpoint URL is like this
        response = requests.post(url, json=request.data, headers={'Content-Type': 'application/json'})
        return Response(response.json(), status=response.status_code)

    def put(self, request, id=None):
        # Forwarding update requests to the Course Microservice
        if id is None:
            return Response({"error": "No content ID provided for update"}, status=400)

        courses_service_url = settings.COURSES_SERVICE_URL
        url = f"{courses_service_url}/courses/content/{id}/"  # Endpoint with content ID
        response = requests.put(url, json=request.data, headers={'Content-Type': 'application/json'})
        return Response(response.json(), status=response.status_code)

def editQuiz(request):
    return render(request,'editQuiz.html')