from django.shortcuts import render, redirect
from wordyAI.utils import *
from wordyAI.constant import *
from wordyAI.decorators import *
from django.http import JsonResponse
from home.models import *
from wordyAI.message import *
from django.contrib.auth.hashers import make_password, check_password
import json
# Create your views here.

@admin_login_required
def get_users(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/user/user.html', context)

def test(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'dashboard/analytics.html', context)

@login_required
def security(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'user/security.html', context)

@login_required
def notification(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'user/notification.html', context)

@login_required
def connections(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'user/connections.html', context)

@login_required
def profile(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'user/profile.html', context)

@login_required
def billing(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'user/billing.html', context)

def saveProfile(request):
    image = request.FILES.get('image', None)
    firstname = request.POST.get('firstname')
    phone = request.POST.get('phoneNumber')
    state = request.POST.get('state')
    timezone = request.POST.get('timezone')
    country = request.POST.get('country')
    lastname = request.POST.get('lastname')
    organization = request.POST.get('organization')
    address = request.POST.get('address')
    zipcode = request.POST.get('zipcode')
    language = request.POST.get('language')
    currency = request.POST.get('currency')

    user = Users.objects.get(email = request.session.get('email'))
    user.firstname = firstname
    user.phone = phone
    user.state = state
    user.timezone = timezone
    user.country = country
    user.lastname = lastname
    user.organization = organization
    user.address = address
    user.zipcode = zipcode
    user.language = language
    user.currency = currency
    
    if image is not None:
        user.avatar = image  

    user.save()

    return redirect('user:profile_view')

def deactivate_account(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    user.activate = 0
    user.save()
    res['status'] = "success"
    res['message'] = DEACTIVATE_ACCOUNT_SUCCESS
    
    return JsonResponse(res)

def update_password(request):
    res = {}
    data = json.loads(request.body)
    currentPassword = data['currentPassword']
    newPassword = data['newPassword']
    user = Users.objects.get(email = request.session.get('email'))
    if check_password(currentPassword, user.password):
        user.password = make_password(newPassword)
        user.save()
        res['status'] = 'success'
        res['message']= PASSWORD_UPDATE_SUCCESS
    else:
        res['status'] = 'fail'
        res['message']= PASSWORD_NOT_CORRECT
    
    return JsonResponse(res)
