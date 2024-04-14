from django.urls import path
from .views import *


urlpatterns = [

    path('all-courses/api/', CourseListView.as_view(), name='all-courses'),
    path('all-courses/', listCourses, name='listCourses'),
    
    path('courseInfo/api/<int:course_id>/', CourseDetailView.as_view(), name='course-info'),
    path('courseInfo/<int:course_id>/', CourseDetailPageView.as_view(), name='courseInfo'),

    path('courseInner/<int:course_id>/', CourseDetailsView.as_view(), name='innerCourse'),
    path('courseInner/api/<int:course_id>/', CourseContentDetailView.as_view(), name='course-details'),

    path('addSection/api/<int:course_id>/', SectionCreateView.as_view(), name='section-create'),
    path('addLesson/api/<int:section_id>/', LessonCreateProxyView.as_view(), name='proxy-lesson-create'),

    path('deleteSection/api/<int:section_id>/', DeleteSectionView.as_view(), name='delete_section'),
    path('deleteLesson/api/<int:lesson_id>/', DeleteLessonView.as_view(), name='delete_lesson'),

]   

