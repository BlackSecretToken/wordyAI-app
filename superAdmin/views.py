import json
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from helpcenter.models import *
from .helpcenter import *
from .billing import *
from .user import *

# Create your views here.
@admin_login_required
def dashboard(request):
    context = {}
    context = default_context(request, context)
    print('here')
    return render(request, 'admin/dashboard/dashboard.html', context)

