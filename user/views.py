import json
from django.shortcuts import render, redirect
from wordyAI.utils import *
from wordyAI.constant import *
from wordyAI.decorators import *
from django.http import JsonResponse
from home.models import *
from wordyAI.message import *
from django.contrib.auth.hashers import make_password, check_password
from membership.models import *
from woocommerce import API
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
    stripeCustomers = StripeCustomer.objects.select_related('user').filter(user__email = request.session.get('email'))
    if stripeCustomers.count() == 1:
        for stripeCustomer in stripeCustomers:
            context['billingAddress'] = stripeCustomer.bill_address
            context['billingEmail'] = stripeCustomer.email
            context['city'] = stripeCustomer.city
            context['position'] = stripeCustomer.position
            context['mobileNumber'] = stripeCustomer.mobile
            context['state'] = stripeCustomer.state
            context['zipCode'] = stripeCustomer.zipcode
            context['country'] = stripeCustomer.country
            context['is_first'] = False
    else:
        context['is_first'] = True
    return render(request, 'user/billing.html', context)

def saveProfile(request):
    image = request.FILES.get('image', None)
    firstname = request.POST.get('firstname')
    company = request.POST.get('company')
    timezone = request.POST.get('timezone')
    lastname = request.POST.get('lastname')
    currency = request.POST.get('currency')

    user = Users.objects.get(email = request.session.get('email'))
    user.firstname = firstname
    user.company = company
    user.timezone = timezone
    user.lastname = lastname
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

def check_connection(request):
    res = {}
    email = request.session.get('email')
    apiData = ApiData.objects.select_related('users').filter(users__email = email).get()

    wcapi = API(
            url= apiData.api_url,
            consumer_key= apiData.consumerKey,
            consumer_secret= apiData.consumerToken,
            version="wc/v3",
            timeout = 100
        )
    try:
        products = wcapi.get("products", params={"page": 1, "per_page": 1}).json()
        res['status'] = STATUS_SUCCESS
        res['message'] = VALID_API

    except Exception as e:
        # Handle any errors from the Stripe API
        print(e)
        res['status'] = STATUS_FAIL
        res['message'] = INVALID_API
    return JsonResponse(res)

def edit_shop(request):
    res = {}
    email = request.session.get('email')
    apiData = ApiData.objects.select_related('users').filter(users__email = email).get()
    res['appName'] = apiData.applicationName
    res['apiUrl'] = apiData.api_url
    res['consumerKey'] = apiData.consumerKey
    res['consumerToken'] = apiData.consumerToken
    return JsonResponse(res)

def update_shop(request):
    res = {}
    data = json.loads(request.body)
    appName = data['appName']
    apiUrl = data['apiUrl']
    consumerKey = data['consumerKey']
    consumerToken = data['consumerToken']

    email = request.session.get('email')
    apiData = ApiData.objects.select_related('users').filter(users__email = email).get()
    apiData.applicationName = appName
    apiData.api_url = apiUrl
    apiData.consumerKey = consumerKey
    apiData.consumerToken = consumerToken
    apiData.save()

    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)
