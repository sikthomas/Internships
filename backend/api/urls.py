from django.urls import path,include
from django.conf import settings
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import signup_api,login_api,users_api,logout_api,assign_role_api,user_role_list,roles_choices,apply_internship,applicants_list,applicant_detail,approve_students,contactus,get_approved_list,assign_tasks,get_assignedtasks,post_comment,view_comment,post_report

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', signup_api, name='signup'),
    path('users/', users_api, name='users'),
    path('users/<int:user_id>/', users_api, name='delete-user'),
    path('login/', login_api, name='login'),
    path('lohout/', logout_api, name='logout'),
    path('assign-role/', assign_role_api, name='assign-role'),
    path('users_list/', user_role_list, name='users_list'),
    path('roles_choices/', roles_choices, name='roles_choices'), 
    path('apply_internship/', apply_internship, name='apply_internship'), 
    path('applicants_list/', applicants_list, name='applicants_list'),
    path('applicant_detail/<int:student_id>/',applicant_detail, name='applicant_detail'),
    path('approvestudent/<int:id>/', approve_students, name='approvestudent'),
    path('approvedlist/', get_approved_list, name='approvedlist'),
    path('assigntask/<int:id>/', assign_tasks, name='assigntask'),
    path('assignedtasks/', get_assignedtasks, name='assignedtasks'),
     path('sendcomment/', post_comment, name='sendcomment'),
    path('viewcomment/', view_comment, name='viewcomment'),
    path('postreport/', post_report, name='postreport'),
    path('contactus/', contactus, name='contactus'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset'))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)