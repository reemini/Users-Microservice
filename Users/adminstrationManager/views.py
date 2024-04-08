from django.shortcuts import render, redirect, get_object_or_404

from rest_framework.generics import ListAPIView
from userProfile.models import CustomUser
from userProfile.serializers import CustomUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework import serializers
from userProfile.serializers import CustomUserSerializer, AdminUserSerializer
from userProfile.models import CustomUser  # Ensure you import your CustomUser model
from rest_framework.generics import CreateAPIView


def AdminPanel(request):
    return render(request,'AdminPanel.html')

def AIrequest(request):
    return render(request,'AI-Request.html')

def EduRequest(request):
    return render(request,'Edu-Request.html')

def userMang(request):
    return render(request,'userMang.html')


class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(pk=user_id)
        user.delete()
        return Response(status=204)
    except CustomUser.DoesNotExist:
        return Response(status=404)
    


#Create User (in admin panel)
User = get_user_model()

class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer