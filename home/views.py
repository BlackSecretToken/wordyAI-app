from base64 import urlsafe_b64decode, urlsafe_b64encode
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
import json
from .models import Users, ApiData
from wordyAI.constant import *
from wordyAI.decorators import *
from .token import account_activation_token
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from wordyAI.utils import *


def test(request):
    uidb64 = urlsafe_b64encode(force_bytes(1))
    print(uidb64)
    uidb64 = b'MQ=='
    uid = force_str(urlsafe_b64decode(uidb64))
    print(uid)
    return JsonResponse({})
# Create your views here.
@login_required
def dashboard(request):
    context = {}
    context = default_context(request, context)
    if request.session.get('is_login') == Role.Admin.value:
        return redirect('superAdmin:dashboard_view')
    else:
        return redirect('dashboard:analytics_view')
    
def register(request):
    context = {}
    return render(request, 'home/register.html', context)

def login(request):
    context = {}
    if 'is_login' in request.session:
        if request.session.get('is_login') == Role.Admin.value:
            return redirect('superAdmin:dashboard_view')
        else:
            return redirect('home:dashboard_view')
    else:
        return render(request, 'home/login.html', context)

def registerUser(request):
    res = {}
    data = json.loads(request.body)
    username = data['username']
    email = data['emailAddress']
    password = data['password']
    user_existance = Users.objects.filter(email = email).exists()

    if user_existance:
        res['message'] = 'User already exists!'
        res['status'] = 'warning'
    else:
        user = Users.objects.create(username = username, email = email, password = make_password(password), activate = True, email_verification = False, gdpr = False, gender = Gender.NONE.value)        
        user.save()
        res['message'] = 'User successfuly registered!'
        res['status'] = 'success'
        request.session['email'] = email
    return JsonResponse(res)

def loginUser(request):
    res = {}
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    rememberMe = data['rememberMe']
    ########## check user existance ###############
    user_existance = Users.objects.filter(username = username, activate = 1).exists()
    if user_existance:
        user = Users.objects.get(username = username)
        res = manipulateLogin(user,password, request)
        if rememberMe :
            request.session.set_expiry(60 * 60 * 24 * 365)
        else:
            request.session.set_expiry(0)
    else:
        res['message'] = 'User does not exist!'
        res['status'] = 'fail'
    
    return JsonResponse(res)

def manipulateLogin(user, password, request):
    res = {}
    if check_password(password, user.password):
        res['message'] = 'Successfully logged in!'
        res['status'] = 'success'
        ####### register login  #######
        request.session['email'] = user.email
        request.session['is_login'] = user.role
        if user.role == Role.User.value:
            res['url'] = '/'
        else:
            res['url'] = '/superAdmin'
    else:
        res['message'] = 'Password does not match!'
        res['status'] = 'fail'

    return res

def logoutUser(request):
    res = {}
    del request.session['is_login']
    del request.session['email']
    res['message'] = 'Successfully logged out!'
    res['status'] = 'success'
    res['url'] = '/'
    return redirect('home:login_view')

def forgotPassword(request):
    if request.method == 'GET':
        context = {}
        return render(request, 'home/forgotPassword.html', context)
    else:
        res = {}
        data = json.loads(request.body)
        email = data['email']
        user_existance = Users.objects.filter(email = email).exists()
        if user_existance:
            res['message'] = 'Email successfully sent.. Please check your email box'
            res['status'] = 'success'
            user = Users.objects.get(email = email)
            activatePasswordEmail(request, user, email)
        else:
            res['message'] = 'User does not exist!'
            res['status'] = 'fail'
        return JsonResponse(res)

def resetPassword(request):
    if request.method == 'POST':
        res = {}
        data = json.loads(request.body)
        password = data['password']
        user = Users.objects.get(email = request.session.get('email'))
        user.password = make_password(password)
        user.save()
        res['status']='success'
        return JsonResponse(res)
    else:
        context = {
            'email': request.session.get('email')
        }
        return render(request, 'home/resetPassword.html', context)

def verifyEmail(request):
    if 'email' in request.session:
        context = {
            'email': request.session.get('email')
        }
        email = request.session.get('email')
        user = Users.objects.get(email = email)
        activateEmailVerification(request, user, email)
        return render(request, 'home/verifyEmail.html', context)
    else:
        return redirect('home:register_view')

def twostepVerification(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'home/twostepVerification.html', context)

def resendEmailVerification(request):
    res = {}
    if 'email' in request.session:
        context = {
            'email': request.session.get('email')
        }
        email = request.session.get('email')
        user = Users.objects.get(email = email)
        activateEmailVerification(request, user, email)
        res['status'] = 'success'
        res['message'] = 'Successfully sent the email. Please check your email box!'
    else:
        res['status'] = 'fail'
        res['message'] = 'Not registered user!'

def activateEmailVerification(request, user, to_email):
    print(to_email)
    mail_subject = 'Activate your user account.'
    message = render_to_string('home/template_email_verification.html', {
        'user': user.username,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_b64encode(force_bytes(user.id)),
        'token': account_activation_token.make_token(user),
        'protocol': 'https' if request.is_secure() else 'http'
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()

def activatePasswordEmail(request, user, to_email):
    print(to_email)
    mail_subject = 'Activate your user account.'
    message = render_to_string('home/template_activate_password.html', {
        'user': user.username,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_b64encode(force_bytes(user.id)),
        'token': account_activation_token.make_token(user),
        'protocol': 'https' if request.is_secure() else 'http'
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()

def activatePassword(request, uidb64, token):
    print(uidb64)
    try:
        uid = force_str(urlsafe_b64decode(uidb64[2:-1]))
        user = Users.objects.get(id=uid)
        
    except(TypeError, ValueError, OverflowError, Users.DoesNotExist):
        print('error')
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.save()
        request.session['email'] = user.email
        return redirect('home:resetPassword_view')
    else:
        return redirect('home:forgotPassword_view')
    
def emailVerification(request, uidb64, token):
    print(uidb64)
    try:
        uid = force_str(urlsafe_b64decode(uidb64[2:-1]))
        user = Users.objects.get(id=uid)
        
    except(TypeError, ValueError, OverflowError, Users.DoesNotExist):
        print('error')
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.email_verification = True
        user.save()
        request.session['email'] = user.email
        return redirect('home:login_view')
    else:
        return redirect('home:verifyEmail_view')

def insertConnectData(request):
    res = {}
    data = json.loads(request.body)
    email = request.session.get('email')
    user = Users.objects.get(email=email)
    applicationName = data['applicationName']
    apiUrl = data['apiUrl']
    consumerKey = data['consumerKey']
    consumerToken = data['consumerToken']
    category = data['category']
    eshopType = data['eshopType']

    apiData = ApiData(applicationName = applicationName, api_url = apiUrl, datatype = category, consumerKey = consumerKey,consumerToken = consumerToken, eshopType = eshopType, users = user)
    apiData.save()
    user.is_first = False
    user.save()
    res['status'] = 'success'

    return JsonResponse(res)    