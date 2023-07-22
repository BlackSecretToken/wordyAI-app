import json
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from membership.models import *

@admin_login_required
def billing_customer(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/billing/customer.html', context)

@admin_login_required
def billing_subscriptions(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/billing/subscriptions.html', context)

def billing_get_customer_data(request):
    stripecustomers = StripeCustomer.objects.select_related('user').all()
    res = []
    for stripecustomer in stripecustomers:
        res.append({"id": stripecustomer.id,
                  "username": stripecustomer.user.username,
                  "email": stripecustomer.email,
                  "customerid": stripecustomer.customerid})
    return JsonResponse(res, safe = False)

def billing_get_customer_data_by_id(request):
    data = json.loads(request.body)
    id = data['id']
    stripecustomer = StripeCustomer.objects.select_related('user').filter(id=id).get()
    res = {
        "id": stripecustomer.id,
        "username": stripecustomer.user.username,
        "email": stripecustomer.email,
        "customerid": stripecustomer.customerid,
        "company": stripecustomer.company,
        "country": stripecustomer.country,
        "state": stripecustomer.state,
        "zipcode": stripecustomer.zipcode,
        "taxid": stripecustomer.taxid,
        "vatnum": stripecustomer.vatnum,
        "bill_address": stripecustomer.bill_address,
        "mobile": stripecustomer.mobile,
        "created_at": stripecustomer.created_at,
        "updated_at": stripecustomer.updated_at,
    }
    return JsonResponse(res)
def billing_get_subscription_data(request):
    stripecustomers = StripeCustomer.objects.select_related('user').all()
    res = []
    for stripecustomer in stripecustomers:
        res.append({"id": stripecustomer.id,
                  "username": stripecustomer.user.username,
                  "email": stripecustomer.email,
                  "customerid": stripecustomer.customerid})
    return JsonResponse(res, safe = False)

def billing_get_customer_data_by_user_id(request):
    data = json.loads(request.body)
    user_id = data['id']
    res = []
    user = Users.objects.filter(id = user_id).get()
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripeCustomer = StripeCustomer.objects.filter(user = user).get()
        res.append({"id": stripeCustomer.id,
                  "country": stripeCustomer.country,
                  "email": stripeCustomer.email,
                  "customerid": stripeCustomer.customerid,
                  "bill_address": stripeCustomer.bill_address,
                  "created_at": stripeCustomer.created_at,
                  'updated_at': stripeCustomer.updated_at})
    return JsonResponse(res, safe = False)
