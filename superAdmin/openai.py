import json
from wordyAI.constant import *
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from home.models import *
from django.core import serializers
from wordyAI.openai import *

@admin_login_required
def get_prompt(request):
    context = {}
    context = default_context(request, context)
    openaiPrompt = OpenaiPrompt.objects.first()
    context['teaser'] = openaiPrompt.teaser
    context['hint'] = openaiPrompt.hint
    context['prompt'] = openaiPrompt.prompt
    return render(request, 'admin/openai/prompt.html', context)

def save_prompt(request):
    res = {}
    data = json.loads(request.body)
    prompt = data['prompt']
    openaiPrompt = OpenaiPrompt.objects.first()
    openaiPrompt.prompt = prompt
    openaiPrompt.save()
    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def check_prompt(request):
    res = {}
    data = json.loads(request.body)
    title = data['title']
    description = data['description']
    openaiPrompt = OpenaiPrompt.objects.first()
    res['message'] = chat(description, openaiPrompt.prompt)
    return JsonResponse(res)