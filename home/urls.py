from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.dashboard, name='dashboard_view'),
    path('test', views.test, name='test' ),
    path('register', views.register, name='register_view' ),
    path('login', views.login, name='login_view' ),
    path('registerUser', views.registerUser, name='registerUser' ),
    path('loginUser', views.loginUser, name='loginUser' ),
    path('logoutUser', views.logoutUser, name='logoutUser'),
    path('resetPassword', views.resetPassword, name="resetPassword_view"),
    path('twostepVerification', views.twostepVerification, name="twostepVerification_view"),
    path('forgotPassword', views.forgotPassword, name="forgotPassword_view"),
    path('verifyEmail', views.verifyEmail, name="verifyEmail_view"),
    path('activatePassword/<uidb64>/<token>', views.activatePassword, name='activatePassword'),
    path('emailVerification/<uidb64>/<token>', views.emailVerification, name='emailVerification'),
    path('insertConnectData', views.insertConnectData, name="insertConnectData"), 
    path('resendEmailVerification', views.resendEmailVerification, name="resendEmailVerification"),
    path('checkConnection', views.checkConnection, name="checkConnection"),
]