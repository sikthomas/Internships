from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, LoginSerializer,UserSerializer,RoleSerializer,UserRoleList,ApplicationSerializer,ApplicantSerializer,ApproveSerializer,ContactForm,AssignTaskSerializer,GetApprovedSerializer,CommentsSerializer,AssignTasksSerializer,CommentSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import CustomUser,UserRole,Application,Approvestudent,Comments,AssignTask
from rest_framework.authtoken.models import Token
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def users_api(request,user_id=None):
    if request.method=='GET':
        users = CustomUser.objects.all()
        serialized_data = UserSerializer(users, many=True, context={'request': request})  # Pass context for profile photo URL
        return Response(serialized_data.data)
    else:
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data.get('user', None)
        
        if user is None:
            raise AuthenticationFailed('Email does not exist.')  # In case the user is not found

        # If the user exists, proceed with creating the refresh token
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'user_type': user.user_type,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Returning validation errors if any

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    try:
        # Get the token for the authenticated user
        token = Token.objects.get(user=request.user)
        token.delete()  # Delete the token to log the user out
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({"message": "Token not found"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_role_api(request):
    if request.method == 'POST':
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            selecteduser = serializer.validated_data.get('user_id')
            role = serializer.validated_data.get('role')

            # Check if user exists
            if not selecteduser:
                return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Assign the role based on the 'role' parameter
            if role == "admin":
                selecteduser.user_type = "admin"
            elif role == "supervisor":
                selecteduser.user_type = "supervisor"
            elif role == "lecturer":
                selecteduser.user_type = "lecturer"
            elif role == "student":
                selecteduser.user_type = "student"
            selecteduser.save()
            # Now save the role assignment in the UserRole model
            serializer.save(assigned_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def roles_choices(request):
    roles_choices = [
        {"id": "admin", "name": "Admin"},
        {"id": "supervisor", "name": "Supervisor"},
        {"id": "lecturer", "name": "Lecturer"},
        {"id": "student", "name": "Student"},
    ]
    return Response(roles_choices, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])  
def user_role_list(request):
    userlist = CustomUser.objects.all()  
    serializedData = UserRoleList(userlist, many=True)  
    return Response(serializedData.data)

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def apply_internship(request):
    if request.method == "GET":
        try:
            myapplication = Application.objects.get(student_id=request.user.id)
            serialized_data = ApplicationSerializer(myapplication, context={'request': request})
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({"detail": "No application found for this user."}, status=status.HTTP_404_NOT_FOUND)


    if request.method == "PUT":
        # Get the existing application for the authenticated student
        myapplication = Application.objects.get(student_id=request.user.id)
        serializer = ApplicationSerializer(myapplication, data=request.data, partial=True, context={'request': request})  # Pass request context
        if serializer.is_valid():
            serializer.save()  # Save the updated application
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'POST':
        # Create a new application
        serializer = ApplicationSerializer(data=request.data, context={'request': request})  # Pass request context
        if serializer.is_valid():
            serializer.save(student_id=request.user)  # Assign student_id automatically
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applicant_detail(request, student_id):
    try:
        applicant = Application.objects.get(student_id=student_id)
        serializer = ApplicantSerializer(applicant, context={'request': request})
        return Response(serializer.data, status=200)
    except Application.DoesNotExist:
        return Response({"detail": "Applicant not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applicants_list(request):
    if request.method=="GET":
        applicants=Application.objects.all()
        serializedData=ApplicantSerializer(applicants,many=True, context={'request': request})
        return Response(serializedData.data, status=status.HTTP_200_OK)

    
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def approve_students(request, id):
    application = Application.objects.get(id=id)
    data = request.data.copy()
    data['applicant_id'] = application.id
    serializer = ApproveSerializer(data=data)
    if serializer.is_valid():
        application.is_approved = True
        application.save(update_fields=['is_approved'])
        serializer.save(approved_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_approved_list(request):
    approved_list = Approvestudent.objects.select_related('applicant_id__student_id').all()
    serializer = GetApprovedSerializer(approved_list, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_tasks(request, id):
    approved_student = Approvestudent.objects.get(id=id)
    data = request.data.copy()
    data['approved_id'] = id  
    serializer = AssignTasksSerializer(data=data)
    if serializer.is_valid():
        serializer.save(supervisor=request.user, approved_id=approved_student)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assignedtasks(request):
    userr=request.user
    if userr.user_type=='supervisor' or userr.user_type=='lecturer' :
        tasks = AssignTask.objects.all()
    else:
        tasks = AssignTask.objects.filter(approved_id__applicant_id__student_id=userr)
        print(f"[DEBUG] Found {tasks.count()} tasks for user {userr.email}")
        
    serializer = AssignTaskSerializer(tasks, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks_assigned_to_me(request,approved_id):
    tasks=AssignTask.objects.filter(approved_id=id)
    serializer=AssignTaskSerializer(tasks,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Comments, AssignTask
from .serializers import CommentSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_comment(request):
    assignment_id = request.query_params.get('assignment_id')
    if not assignment_id:
        return Response({"error": "assignment_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    comments = Comments.objects.filter(assignmentId__id=assignment_id).order_by('commented_at')
    serializer = CommentSerializer(comments, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_comment(request):
    assignment_id = request.data.get('assignmentId')
    comment_text = request.data.get('comment')
    if not assignment_id or not comment_text:
        return Response({"error": "assignmentId and comment are required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        assignment = AssignTask.objects.get(id=assignment_id)
    except AssignTask.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

    comment = Comments.objects.create(assignmentId=assignment,comment=comment_text,commented_by=request.user)
    serializer = CommentsSerializer(comment, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

    

@api_view(['POST'])
@permission_classes([AllowAny])
def contactus(request):
    if request.method=="POST":
        serilaizer=ContactForm(data=request.data)
        if serilaizer.is_valid():
            serilaizer.save()
            return Response(serilaizer.data, status=status.HTTP_201_CREATED)
    return Response(serilaizer.errors,status=status.HTTP_400_BAD_REQUEST)

