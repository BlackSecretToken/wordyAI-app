import json
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from helpcenter.models import *
from django.core import serializers


@admin_login_required
def helpcenter_insert_content(request):
    if request.method == 'POST':
        res = {}
        data = json.loads(request.body)
        category = data['category']
        content = data['content']
        contentName = data['contentName']

        helpcategory = HelpCategory.objects.get(id = category)
        is_exist = HelpContent.objects.filter(helpcategory = helpcategory, contentName = contentName).exists()
        if is_exist:
            res['status'] = 'fail'
            res['message'] = CONTENT_ALREADY_EXIST
            return JsonResponse(res)
        else:
            helpContent = HelpContent.objects.create(helpcategory = helpcategory, contentName = contentName, content = content)
            helpContent.save()
            res['status'] = 'success'
            res['message'] = CONTENT_CREATE_SUCCESS
            return JsonResponse(res)
    else:
        context = {}
        context = default_context(request, context)
        return render(request, 'admin/helpcenter/insert_content.html', context)

@admin_login_required
def helpcenter_insert_category(request):
    if request.method == 'POST':
        res = {}
        data = json.loads(request.body)
        category = data['category']
        is_exist = HelpCategory.objects.filter(category = category).exists()
        if is_exist:
            res['status'] = 'fail'
            res['message'] = CATEGORY_ALREADY_EXIST
            return JsonResponse(res)
        else:
            helpCategory = HelpCategory.objects.create(category = category)
            helpCategory.save()
            res['status'] = 'success'
            res['message'] = CATEGORY_CREATE_SUCCESS
            return JsonResponse(res)    
    else:
        context = {}
        context = default_context(request, context)
        return render(request, 'admin/helpcenter/insert_category.html', context)
    
def helpcenter_get_category_data(request):
    category_data = HelpCategory.objects.filter(activate = 1).all()
    category_data = serializers.serialize('json', category_data)
    return JsonResponse(category_data, safe = False)

def helpcenter_delete_category(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    helpcategory = HelpCategory.objects.get(id = id)
    helpcategory.activate = 0
    helpcategory.save()

    res['status'] = 'success'
    res['message'] = CATEGORY_DLETEL_SUCCESS
    return JsonResponse(res)

def helpcenter_delete_category_bulk(request):
    res = {}
    data = json.loads(request.body)
    ids = data['ids']
    helpcategorys = HelpCategory.objects.filter(id__in = ids)

    for helpcategory in helpcategorys:
        helpcategory.activate = 0
        helpcategory.save()

    res['status'] = 'success'
    res['message'] = CATEGORY_DLETEL_SUCCESS
    return JsonResponse(res)

def helpcenter_edit_category(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    category_data = HelpCategory.objects.filter(id = id)
    category_data = serializers.serialize('json', category_data)
    return JsonResponse(category_data, safe = False)

def helpcenter_update_category(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    category = data['category']
    is_exist = HelpCategory.objects.filter(category = category).exists()
    if is_exist:
        res['status'] = 'fail'
        res['message'] = CATEGORY_ALREADY_EXIST
        return JsonResponse(res)
    else:
        category_data = HelpCategory.objects.get(id = id)
        category_data.category = category
        category_data.save()
        res['status'] = 'success'
        res['message'] = CATEGORY_UPDATE_SUCCESS
        return JsonResponse(res)
    
def helpcenter_get_content_data(request):
    content_data = HelpContent.objects.filter(activate = 1).all()
    content_data = serializers.serialize('json', content_data)
    return JsonResponse(content_data, safe = False)

def helpcenter_delete_content(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    helpcontent = HelpContent.objects.get(id = id)
    helpcontent.activate = 0
    helpcontent.save()

    res['status'] = 'success'
    res['message'] = CONTENT_DLETEL_SUCCESS
    return JsonResponse(res)

def helpcenter_delete_content_bulk(request):
    res = {}
    data = json.loads(request.body)
    ids = data['ids']
    helpcontents = HelpContent.objects.filter(id__in = ids)

    for helpcontent in helpcontents:
        helpcontent.activate = 0
        helpcontent.save()

    res['status'] = 'success'
    res['message'] = CONTENT_DLETEL_SUCCESS
    return JsonResponse(res)

def helpcenter_edit_content(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    content_data = HelpContent.objects.filter(id = id)
    content_data = serializers.serialize('json', content_data)
    return JsonResponse(content_data, safe = False)

def helpcenter_update_content(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    category = data['category']
    content = data['content']
    contentName = data['contentName']

    helpcategory = HelpCategory.objects.get(id = category)
    is_exist = HelpContent.objects.filter(helpcategory = helpcategory, contentName = contentName, content = content).exists()
    if is_exist:
        res['status'] = 'fail'
        res['message'] = CONTENT_ALREADY_EXIST
        return JsonResponse(res)
    else:
        helpContent = HelpContent.objects.get(id = id)
        helpContent.helpcategory = helpcategory
        helpContent.content = content
        helpContent.contentName = contentName
        helpContent.save()
        res['status'] = 'success'
        res['message'] = CONTENT_UPDATE_SUCCESS
        return JsonResponse(res)
    
def helpcenter_change_audience(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    status = data['status']

    helpcontent = HelpContent.objects.get(id= id)
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = HelpAudience.objects.filter(helpcontent = helpcontent, user = user).exists()
    if is_exist:
        helpaudience = HelpAudience.objects.get(helpcontent = helpcontent, user = user)
        helpaudience.isLike = status
        helpaudience.save()
    else:
        helpaudience = HelpAudience.objects.create(helpcontent = helpcontent, user = user, isLike = status)
        helpaudience.save()

    likeNum = HelpAudience.objects.filter(helpcontent = helpcontent, isLike = HELPAUDIENCE.LIKE.value).count()
    dislikeNum = HelpAudience.objects.filter(helpcontent = helpcontent, isLike = HELPAUDIENCE.DISLIKE.value).count()

    helpcontent.like = likeNum
    helpcontent.dislike = dislikeNum

    res['status'] = 'success'
    res['message'] = REQUEST_HANDLE_SUCCESS
    res['data'] = likeNum

    return JsonResponse(res)



