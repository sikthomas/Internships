from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser,UserRole,Application,Approvestudent,Contact,AssignTask,Comments,Report
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    university_name = serializers.ChoiceField(choices=[
        ('Kabianga', 'Kabianga'),
        ('University of Nairobi', 'University of Nairobi'),
        ('Kabarak University', 'Kabarak University')
    ])
    user_type = serializers.ChoiceField(choices=[
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('lecturer','Lecturer')
    ])

    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','username','user_type','university_name','profile_photo', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            username=validated_data['username'],
            user_type=validated_data['user_type'],
            university_name=validated_data['university_name'],
            profile_photo=validated_data.get('profile_photo'),
            password=validated_data['password']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'user_type', 'university_name', 'profile_photo', 'profile_photo_url']

    def get_profile_photo_url(self, obj):
        request = self.context.get('request')
        if obj.profile_photo:
            # Ensure it returns a URL under /api/media/ (since your app is named 'api')
            return request.build_absolute_uri(f"/api{obj.profile_photo.url}")
        else:
            # Default image if no profile photo exists
            default_image_path = 'profile_images/no-image.jpg'
            return request.build_absolute_uri(f"/api{settings.MEDIA_URL}{default_image_path}")
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        # Check if the email exists in the database
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('Email does not exist.')  # Proper error raised if email is not found

        # Authenticate the user with email and password
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password.')

        # Return user instance if everything is fine
        return {'user': user}

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'user_id', 'role', 'assigned_by', 'assigned_date']
        read_only_fields = ['assigned_by', 'assigned_date']


class UserRoleList(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email']

class ApplicationSerializer(serializers.ModelSerializer):
    student_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    student_cv_url = serializers.SerializerMethodField()

    education = serializers.ChoiceField(choices=[
        ('Degree', 'Degree'),
        ('Diploma', 'Diploma'),
    ])
    course = serializers.ChoiceField(choices=[
        ('Computer Science', 'Computer Science'),
        ('Software Engineering', 'Software Engineering'),
    ])
    program = serializers.ChoiceField(choices=[
        ('Application Development', 'Application Development'),
        ('Data Science', 'Data Science'),
         ('Artificial Intelligence', 'Artificial Intelligence'),
        ('Technical Support', 'Technical Support'),
        ('DevOps', 'DevOps')
    ])

    class Meta:
        model = Application
        fields = ['id', 'student_id', 'idnumber', 'phonenumber', 'education', 'course', 
                  'registration_number', 'program', 'student_cv','student_cv_url', 'application_date']
        read_only_fields = ['student_id', 'application_date']

    def get_student_cv_url(self, obj):
    # Check if 'request' is available in the context
      request = self.context.get('request')
    
    # Ensure request exists before calling build_absolute_uri
      if request and obj.student_cv:
        return request.build_absolute_uri(f"/api{obj.student_cv.url}")
    
    # If no CV exists, return a default "no file" path
      default_file_path = 'documents/no-file.pdf'
      return request.build_absolute_uri(f"/api{settings.MEDIA_URL}{default_file_path}") if request else default_file_path
        

class ApplicantSerializer(serializers.ModelSerializer):
    student_id = UserSerializer()
    student_cv_url = serializers.SerializerMethodField()

    education = serializers.ChoiceField(choices=[
        ('Degree', 'Degree'),
        ('Diploma', 'Diploma'),
    ])
    course = serializers.ChoiceField(choices=[
        ('Computer Science', 'Computer Science'),
        ('Software Engineering', 'Software Engineering'),
    ])
    program = serializers.ChoiceField(choices=[
        ('Application Development', 'Application Development'),
        ('Data Science', 'Data Science'),
         ('Artificial Intelligence', 'Artificial Intelligence'),
        ('Technical Support', 'Technical Support'),
        ('DevOps', 'DevOps')
    ])

    class Meta:
        model = Application
        fields = ['id', 'student_id', 'idnumber', 'phonenumber', 'education', 'course', 
                  'registration_number', 'program', 'student_cv','student_cv_url', 'application_date','is_approved']
        read_only_fields = ['student_id', 'application_date']

    def get_student_cv_url(self, obj):
        request = self.context.get('request')
        if obj.student_cv:
            # If there's a CV file, return the absolute URL for the CV file
            return request.build_absolute_uri(f"/api{obj.student_cv.url}")
        else:
            # If no CV exists, return a default "no file" path
            default_file_path = 'documents/no-file.pdf'
            return request.build_absolute_uri(f"/api{settings.MEDIA_URL}{default_file_path}")

class ApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approvestudent
        fields = ['id','applicant_id', 'status', 'approved_by', 'approved_date']
        read_only_fields = ['approved_by', 'approved_date']
 


class GetApprovedSerializer(serializers.ModelSerializer):
    applicant_id = serializers.PrimaryKeyRelatedField(queryset=Application.objects.all())
    student = serializers.SerializerMethodField()
    approved_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Approvestudent
        fields = ['id','applicant_id', 'status', 'approved_by', 'approved_date', 'student']

    def get_student(self, obj):
        # Fetch the related Application and CustomUser data
        application = obj.applicant_id
        student = application.student_id
        request = self.context.get('request')
        return {
            'id': student.id,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'program': application.program,
            'university_name': student.university_name,
            'application_date': application.application_date,
        }
class AssignTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignTask
        fields = ['id', 'supervisor', 'approved_id', 'assignment_title', 'assignment_description', 'assigned_date']
        read_only_fields = ['supervisor', 'assigned_date']


    
class AssignTaskSerializer(serializers.ModelSerializer):
    supervisor = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    class Meta:
        model = AssignTask
        fields = ['id', 'supervisor', 'student', 'assignment_title', 'assignment_description', 'assigned_date','is_rated']
        read_only_fields = ['supervisor', 'assigned_date']

    def get_supervisor(self, obj):
        # Fetch supervisor details (CustomUser)
        supervisor = obj.supervisor
        return {
            'id': supervisor.id,
            'first_name': supervisor.first_name,
            'last_name': supervisor.last_name,
            'profile_photo_url': self.get_profile_photo_url(supervisor)
        }

    def get_student(self, obj):
        # Traverse relationships: AssignTask → Approvestudent → Application → CustomUser
        approved_student = obj.approved_id
        application = approved_student.applicant_id
        student = application.student_id
        return {
            'id': student.id,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'university_name':student.university_name,
            'profile_photo_url': self.get_profile_photo_url(student)
        }

    def get_profile_photo_url(self, user):
        # Helper method to get profile photo URL
        request = self.context.get('request')
        if user.profile_photo:
            return request.build_absolute_uri(f"/api{user.profile_photo.url}")
        else:
            default_image_path = 'profile_images/no-image.jpg'
            return request.build_absolute_uri(f"/api{settings.MEDIA_URL}{default_image_path}")


class CommentsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Comments
        fields=['assignmentId','comment','commented_by','commented_at']
        read_only_fields = ['commented_by', 'commented_at']

class CommentSerializer(serializers.ModelSerializer):
    commented_by = serializers.SerializerMethodField()

    class Meta:
        model = Comments
        fields = ['id', 'assignmentId', 'comment', 'commented_by', 'commented_at']

    def get_commented_by(self, obj):
        user = obj.commented_by
        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_photo_url': self.get_profile_photo_url(user)
        }

    def get_profile_photo_url(self, user):
        request = self.context.get('request')
        if user.profile_photo:
            return request.build_absolute_uri(f"/api{user.profile_photo.url}")
        else:
            default_image_path = 'profile_images/no-image.jpg'
            return request.build_absolute_uri(f"/api{settings.MEDIA_URL}{default_image_path}")
        
class ReportSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Report  
        fields=['assignmentId','comment','score','commented_by','commented_at']
        read_only_fields = ['commented_by', 'commented_at']


class ContactForm(serializers.ModelSerializer):
    class Meta:
        model = AssignTask
        fields = ['name', 'email', 'message', 'send_date']
        read_only_fields = ['send_date']

class GetReportSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    assignment_title = serializers.CharField(source='assignmentId.assignment_title', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'assignmentId', 'assignment_title', 'comment', 'score', 'commented_by', 'commented_at', 'student']

    def get_student(self, obj):
        try:
            assign_task = obj.assignmentId
            approved = assign_task.approved_id
            application = approved.applicant_id
            student = application.student_id

            return {
                'id': student.id,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'email': student.email,
                'profile_photo_url': self.get_profile_photo_url(student)
            }

        except Exception:
            return None

    def get_profile_photo_url(self, user):
        request = self.context.get('request')
        if user.profile_photo and hasattr(user.profile_photo, 'url'):
            return request.build_absolute_uri(user.profile_photo.url) if request else user.profile_photo.url
        return None