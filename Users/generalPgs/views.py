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


