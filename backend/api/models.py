from django.contrib.auth.models import AbstractUser
from django.db import models
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail, EmailMessage

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_superuser=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)
    user_type=models.CharField(max_length=30)
    university_name=models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to="profile_images/", blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class UserRole(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_roles')
    role = models.CharField(max_length=50)
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='assigned_roles')
    assigned_date = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    student_id = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='applicant')
    idnumber = models.CharField(max_length=20,blank=True)
    phonenumber = models.CharField(max_length=15)
    education=models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    program=models.CharField(max_length=50)
    student_cv = models.FileField(upload_to="documents")
    application_date = models.DateTimeField(auto_now_add=True)
    is_approved=models.BooleanField(default=False)

class Approvestudent(models.Model):
    applicant_id=models.OneToOneField(Application,on_delete=models.CASCADE)
    status=models.CharField(max_length=20)
    approved_by=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    approved_date=models.DateTimeField(auto_now_add=True)

class AssignTask(models.Model):
    supervisor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    approved_id = models.ForeignKey(Approvestudent, on_delete=models.CASCADE)
    assignment_title = models.CharField(max_length=30)
    assignment_description = models.TextField()
    assigned_date = models.DateField(auto_now_add=True)

class Comments(models.Model):
    assignmentId=models.ForeignKey(AssignTask,on_delete=models.CASCADE)
    comment=models.TextField()
    commented_by=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    commented_at=models.DateTimeField(auto_now_add=True)

class Contact(models.Model):
    name = models.CharField(max_length=50) 
    email = models.EmailField(max_length=50)  
    message = models.TextField()
    send_date=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
    

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    # the below like concatinates your websites reset password url and the reset email token which will be required at a later stage
    email_plaintext_message = "Open the link to reset your password" + " " + "{}{}".format(instance.request.build_absolute_uri("http://localhost:3000/login#/reset-password-form/"), reset_password_token.key)
    
    """
        this below line is the django default sending email function, 
        takes up some parameter (title(email title), message(email body), from(email sender), to(recipient(s))
    """
    send_mail(
        # title:
        "Password Reset for {title}".format(title="Crediation portal account"),
        # message:
        email_plaintext_message,
        # from:
        "info@yourcompany.com",
        # to:
        [reset_password_token.user.email],
        fail_silently=False,
    )
    



 





