from django.shortcuts import render, redirect
from wordyAI.utils import *
from wordyAI.constant import *
from wordyAI.decorators import *
from django.http import JsonResponse
import json
# Create your views here.

def test(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'dashboard/analytics.html', context)

@login_required
def analytics(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'dashboard/analytics.html', context)
