import json
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from home.models import *
from django.core import serializers

@admin_login_required
def get_user(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/user/user.html', context)

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
    user = Users.objects.filter(id = id).get()
    content_data = serializers.serialize('json', user)
    return JsonResponse(content_data, safe = False)

def delete_user_data_by_id(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.filter(id = id).get()
    user.activate = DEACTIVATE
    user.save()
    res['status'] = 'success'
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

    res['status'] = 'success'
    res['message'] = CONTENT_DLETEL_SUCCESS
    return JsonResponse(res)

def activate_user_data_by_id(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.filter(id = id).get()
    user.activate = ACTIVATE
    user.save()
    res['status'] = 'success'
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def toggle_user_role(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    user = Users.objects.filter(id = id).get()
    if  user.role == Role.Admin.value:
        user.role = Role.User.value
    else:
        user.role = Role.Admin.value
    user.save()
    res['status'] = 'success'
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

