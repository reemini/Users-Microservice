from django.urls import path
from .views import *


urlpatterns = [

    path('all-courses/api/', CourseListView.as_view(), name='all-courses'),
    path('all-courses/', listCourses, name='listCourses'),
    
    path('courseInfo/api/<int:course_id>/', CourseDetailView.as_view(), name='course-info'),
    path('courseInfo/<int:course_id>/', CourseDetailPageView.as_view(), name='courseInfo'),


]   

