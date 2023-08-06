import json
from wordyAI.constant import *
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from home.models import *
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password

@admin_login_required
def get_user(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/user/user.html', context)

@admin_login_required
def get_shop(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/user/shop.html', context)

def get_user_data(request):
    users = Users.objects.all()
    res = []
    print(users)
    for user in users:
        res.append({"id": user.id,
                "username": user.username,
                "email": user.email,
                "activate": user.activate,
                "role": user.role
                })
    return JsonResponse(res, safe = False)

def get_user_data_by_id(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.get(id = id)
    
    avatar_url = ''
    if str(user.avatar) == '':
        avatar_url='../static/assets/images/avatars/default.png'
    else:   
        avatar_url = 'media/'+ str(user.avatar)
    count = request.path.count('/')
    for i in range(count-1):
        avatar_url = '../' + avatar_url
    
    res = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": avatar_url,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "address": user.address,
        "mobile": user.mobile,
        "language": user.language,
        "timezone": user.timezone,
        "created_at": user.created_at,
        "updated_at": user.created_at,
    }
    return JsonResponse(res)

def delete_user_data_by_id(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.filter(id = id).get()
    user.activate = DEACTIVATE
    user.save()
    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def delete_user_bulk(request):
    res = {}
    data = json.loads(request.body)
    ids = data['ids']
    users = Users.objects.filter(id__in = ids)

    for user in users:
        user.activate = DEACTIVATE
        user.save()

    res['status'] = STATUS_SUCCESS
    res['message'] = CONTENT_DLETEL_SUCCESS
    return JsonResponse(res)

def activate_user_data_by_id(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.filter(id = id).get()
    user.activate = ACTIVATE
    user.save()
    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def change_user_role(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    role = data['role']
    user = Users.objects.filter(id = id).get()
    user.role = role
    
    user.save()
    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def create_user(request):
    res = {}
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    email = data['email']
    firstname = data['firstname']
    lastname = data['lastname']
    company = data['company']

    user_existance = Users.objects.filter(email = email).exists()

    if user_existance:
        res['message'] = USER_EXIST
        res['status'] = STATUS_FAIL
    else:
        user = Users.objects.create(username = username, email = email, password = make_password(password), activate = True, email_verification = False, gdpr = False, gender = Gender.NONE.value, firstname = firstname, lastname= lastname, organization = company)        
        user.save()
        res['message'] = USER_CREATE_SUCCESS
        res['status'] = STATUS_SUCCESS

    return JsonResponse(res)

def get_shop_data(request):
    apiDatas = ApiData.objects.select_related('users').filter(activate = ACTIVATE).all()
    res = []
    for apiData in apiDatas:
        res.append({"id": apiData.id,
                  "username": apiData.users.username,
                  "email": apiData.users.email,
                  "datatype": SHOP_DATATYPE[apiData.datatype],
                  "eshopType": SHOP_ESHOPTYPE[apiData.eshopType],
                  "appName": apiData.applicationName
                  })
    return JsonResponse(res, safe = False)

def get_shop_data_by_id(request):
    data = json.loads(request.body)
    id = data['id']
    apiData = ApiData.objects.filter(id = id).get()
    res = []
    res.append({"appName": apiData.applicationName,
                "apiUrl": apiData.api_url,
                "consumerKey": apiData.consumerKey,
                "consumerToken": apiData.consumerToken
                })
    return JsonResponse(res, safe = False)

def update_shop_data(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    appName = data['appName']
    apiUrl = data['apiUrl']
    consumerKey = data['consumerKey']
    consumerToken = data['consumerToken']
    apiData = ApiData.objects.filter(id = id).get()
    apiData.applicationName = appName
    apiData.api_url = apiUrl
    apiData.consumerKey = consumerKey
    apiData.consumerToken = consumerToken
    apiData.save()
    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)
    

