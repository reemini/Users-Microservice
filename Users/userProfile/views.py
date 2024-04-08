from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CustomUserSerializer, StudentProfileSerializer, EditStudentProfileSerializer, TeacherProfileSerializer, EditTeacherProfileSerializer
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.urls import reverse
from django.core.signing import BadSignature, Signer
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from .utils import send_verification_email
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from .tokens import account_activation_token
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_str


from .models import CustomUser, Student, Educator  
from django.contrib.auth import logout

from django.contrib.auth.decorators import login_required

#for re-set password
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import token_generator

#for Profile
from rest_framework.permissions import IsAuthenticated

#for saving pic
from rest_framework.parsers import MultiPartParser, FormParser



signer = Signer()
User = get_user_model()

def verify_email(request, token):
    try:
        user_id = signer.unsign(token)
        user = get_object_or_404(User, pk=user_id)
        user.email_verified = True
        user.save()
        return HttpResponse('Email verified successfully!')
    except BadSignature:
        return HttpResponse('Invalid or expired token.', status=400)

def logout_user(request):
    logout(request)
    return redirect('login_page')

class UserSignUpView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse('userHome'))
        serializer = CustomUserSerializer(data=request.data)     
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email(user)
            return Response({"message": "User created successfully. Please check your email to verify your account."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def signup_page(request):
    if request.user.is_authenticated:
        # If user is already logged in, redirect to userHome
        return redirect(reverse('userHome'))
    
    return render(request, 'signup.html')

def login_page(request):
    if request.user.is_authenticated:
        # If user is already logged in, redirect to userHome
        return redirect(reverse('userHome'))

    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = CustomUser.objects.get(email=email)  # Attempt to retrieve the user by email
            if not user.email_verified:
                messages.error(request, 'Email has not been verified. Please check your inbox.')
            else:
                user = authenticate(request, username=email, password=password)
                if user is not None:
                    login(request, user)
                    messages.success(request, 'You are now logged in.')
                    return redirect(reverse('userHome'))
                else:
                    messages.error(request, 'Invalid password.')
        except CustomUser.DoesNotExist:
            messages.error(request, 'The email has not been registered.')

    return render(request, 'login.html')

def home(request):
    return render(request, 'home.html')


@login_required
def userHome(request):
    return render(request, 'homeSigned.html')

@login_required
def stdProfile(request):
    return render(request, 'student.html')

@login_required
def tchrProfile(request):
    return render(request, 'teacher.html')

@login_required
def editStdProfile(request):
    return render(request, 'EditStudentProfile.html')

@login_required
def editTchProfile(request):
    return render(request, 'EditTeacherProfile.html')



@login_required
def profile_redirect(request):
    if request.user.role == 'teacher':
        return redirect('tchrProfile')
    elif request.user.role == 'student':
        return redirect('stdProfile')
    else:
        # Handle other roles or lack of role
        return redirect('home')



#FOR RESETTING PASSWORD

def forgetPass(request):
    return render(request, 'forgetpass.html')



def confirm_password_reset(request, uidb64, token):
    # Pass the uidb64 and token to the template
    context = {
        'uidb64': uidb64,
        'token': token
    }
    return render(request, 'confirmpass.html', context)

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

            token = token_generator.make_token(user)
            reset_url = reverse('confirmPass', args=[uidb64, token])
            full_reset_url = request.build_absolute_uri(reset_url)
            send_mail(
                'Password Reset Request',
                f'Please click on the link to reset your password: {full_reset_url}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
    

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
                # Decode uidb64 to get the user's ID
        print('Passed-posti')

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_object_or_404(User, pk=uid)
            print('Passed-try')

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            print('Passed-except')


        if user is not None and token_generator.check_token(user, token):
            new_password = request.data.get("new_password")
            user.set_password(new_password)
            user.save()
            print('Passed')
            return Response({"message": "Password has been reset successfully."})
        else:
            print('Failed')

            return Response({"error": "Invalid token or user ID."}, status=status.HTTP_400_BAD_REQUEST)
        



#For Student Profile
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            student_profile = Student.objects.get(user=request.user)
            serializer = StudentProfileSerializer(student_profile)
            return Response(serializer.data)
        except Student.DoesNotExist:
                raise Http404("Student profile does not exist for this user.")
    


class EditStudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            student_profile = Student.objects.get(user=request.user)
            serializer = EditStudentProfileSerializer(student_profile)
            return Response(serializer.data)
        except Student.DoesNotExist:
                raise Http404("Student profile does not exist for this user.")
    def post(self, request, *args, **kwargs):
        student_profile = Student.objects.get(user=request.user)
        serializer = EditStudentProfileSerializer(student_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print('saved')
            return Response({"message": "Profile updated successfully."})
        print('failed')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




#For teacher profile
class TeacherProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            teacher_profile = Educator.objects.get(user=request.user)
            serializer = TeacherProfileSerializer(teacher_profile)
            return Response(serializer.data)
        except Educator.DoesNotExist:
                raise Http404("Educator profile does not exist for this user.")
        


class EditTeacherProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            teacher_profile = Educator.objects.get(user=request.user)
            serializer = EditTeacherProfileSerializer(teacher_profile)
            return Response(serializer.data)
        except Educator.DoesNotExist:
                raise Http404("Educator profile does not exist for this user.")
    def post(self, request, *args, **kwargs):
        teacher_profile = Educator.objects.get(user=request.user)
        serializer = EditTeacherProfileSerializer(teacher_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print('saved')
            return Response({"message": "Profile updated successfully."})
        print('failed')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    