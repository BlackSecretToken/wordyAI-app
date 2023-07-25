import json
import os
from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from django.http import JsonResponse
from wordyAI.message import *
from membership.models import *
import stripe
stripe.api_key = os.getenv("STRIPE_PRIVATE_KEY")

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

def get_subscription_status_id(request):
    data = json.loads(request.body)
    user_id = data['id']
    status = data['status']
    res = []
    user = Users.objects.filter(id = user_id).get()
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripeCustomer = StripeCustomer.objects.filter(user = user).get()
        try:
            subscriptions = stripe.Subscription.list(customer=stripeCustomer.customerid, status=status)
            
            for subscription in subscriptions.data:
                product_id = subscription["items"]["data"][0]["price"]["id"]
                
                stripeProduct = StripeProduct.objects.filter(productid = product_id).get()
                res.append({"id": subscription["id"],
                  "status": subscription["status"],
                  "created_at": subscription["created"],
                  "currency": subscription["currency"],
                  "period_end": subscription["current_period_end"],
                  "period_start": subscription["current_period_start"],
                  "canceled_at": subscription["canceled_at"],
                  "product_price": stripeProduct.price,
                  "product_mode": stripeProduct.mode,
                  "product_name": stripeProduct.name,
                  "product_type": subscription["items"]["data"][0]["price"]["type"]
                  })

        except stripe.error.StripeError as e:
            print('Error:', e)
    return JsonResponse(res, safe = False)

def get_invoice_data_id(request):
    data = json.loads(request.body)
    user_id = data['id']
    res = []
    user = Users.objects.filter(id = user_id).get()
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripeCustomer = StripeCustomer.objects.filter(user = user).get()
        try:
            # Retrieve all invoices for the specified customer
            invoices = stripe.Invoice.list(
                customer = stripeCustomer.customerid,
            )
            return JsonResponse(invoices)
        except Exception as e:
            # Handle any errors from the Stripe API
            return JsonResponse(res, safe = False)
        
    return JsonResponse(res, safe = False)
