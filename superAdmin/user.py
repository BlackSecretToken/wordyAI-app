import json
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from home.models import *

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
