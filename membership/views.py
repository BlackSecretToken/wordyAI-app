from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
from wordyAI.message import *
from wordyAI.decorators import *
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from .models import *
import stripe
import os
import json

stripe.api_key = os.getenv("STRIPE_PRIVATE_KEY")

@login_required
def billing(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'membership/billing.html', context)

@login_required
def join(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'membership/join.html', context)


def success(request):
    context = {}
    context = default_context(request, context)
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    if request.method == 'GET' and 'session_id' in request.GET:
        session = stripe.checkout.Session.retrieve(request.GET['session_id'],)
        print (session)
        customer = Customer()
        customer.user = user
        customer.stripeid = session.customer
        customer.membership = True
        customer.cancel_at_period_end = False
        customer.stripe_subscription_id = session.subscription
        customer.save()
    return render(request, 'membership/success.html', context)


def cancel(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'membership/cancel.html',context)


@login_required
def checkout(request):
    context = {}
    context = default_context(request, context)

    if request.method == 'POST':
        pass
    else:
        membership = 'monthly'
        final_dollar = 10
        membership_id = 'price_1NEQ50A2amj9Vq4WeYPhTPdT'
        if request.method == 'GET' and 'membership' in request.GET:
            if request.GET['membership'] == 'yearly':
                membership = 'yearly'
                membership_id = 'price_1NEQ50A2amj9Vq4WhYtEzrrM'
                final_dollar = 100

        # Create Strip Checkout
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email = request.session.get('email'),
            line_items=[{
                'price': membership_id,
                'quantity': 1,
            }],
            mode='subscription',
            allow_promotion_codes=True,
            success_url='http://127.0.0.1:8000/membership/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://127.0.0.1:8000/membership/cancel',
        )
        context['final_dollar'] = final_dollar
        context['session_id'] = session.id
        return render(request, 'membership/checkout.html', context)

def create_customer(request):
    res = {}
    data = json.loads(request.body)
    city = data['city']
    position = data['position']
    mobile = data['mobile']
    country = data['country']
    bill_address = data['bill_address']
    state = data['state']
    zipcode = data['zipcode']
    user = Users.objects.get(email = request.session.get('email'))

    try:
        response = stripe.Customer.create(
            name = user.username,
            email = user.email,
            description= WORDYAI_CUSTOMER_CREATE_DESCRIPTION,
        )
        if (response.id):
            customerid = response.id 
            stripecustomer = StripeCustomer.objects.create(
                customerid = customerid,
                email = user.email,
                city = city,
                position = position,
                mobile = mobile,
                country = country,
                bill_address = bill_address,
                state = state,
                zipcode = zipcode,
                user = user
            )        
            stripecustomer.save()

            res['status'] = STATUS_SUCCESS
            res['message'] = REQUEST_HANDLE_SUCCESS
        else:
            res['status'] = STATUS_FAIL
            res['message'] = STRIPE_ERROR
    except Exception as e:
        res['status'] = STATUS_FAIL
        res['message'] = STRIPE_ERROR

    return JsonResponse(res)

def update_customer(request):
    res = {}
    data = json.loads(request.body)
    id = data['id']
    city = data['city']
    position = data['position']
    mobile = data['mobile']
    country = data['country']
    bill_address = data['bill_address']
    state = data['state']
    zipcode = data['zipcode']

    user = Users.objects.get(email = request.session.get('email'))
    stripeCustomer = StripeCustomer.objects.get(id = id)
    stripeCustomer.city = city
    stripeCustomer.position = position
    stripeCustomer.mobile = mobile
    stripeCustomer.country = country
    stripeCustomer.bill_address = bill_address
    stripeCustomer.state = state
    stripeCustomer.zipcode = zipcode
    stripeCustomer.save()

    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS
    return JsonResponse(res)

def create_card(request):
    res = {}
    data = json.loads(request.body)
    token_id = data['token_id']
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()

    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            stripe.Customer.create_source(
                stripecustomer.customerid,
                source = token_id,
            )
            res['status'] = STATUS_SUCCESS
            res['message'] = REQUEST_HANDLE_SUCCESS
        except Exception as e:
            res['status'] = STATUS_FAIL
            res['message'] = STRIPE_ERROR
    else:
        res['status'] = STATUS_FAIL
        res['message'] = CUSTOMER_NOT_REGISTERED

    return JsonResponse(res)

def get_card_list(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()

    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            res = stripe.Customer.list_sources(
                stripecustomer.customerid,
                object="card",
            )
        except Exception as e:
            pass
    
    return JsonResponse(res)

def set_card_primary(request):
    res = {}
    data = json.loads(request.body)
    card_id = data['id']
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()

    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            stripe.Customer.modify(
                stripecustomer.customerid,
                default_source = card_id,
            )
            res['status'] = STATUS_SUCCESS
            res['message'] = REQUEST_HANDLE_SUCCESS
        except Exception as e:
            res['status'] = STATUS_FAIL
            res['message'] = STRIPE_ERROR
    
    return JsonResponse(res)
        
def delete_card(request):
    res = {}
    data = json.loads(request.body)
    card_id = data['id']
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()

    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            stripe.Customer.delete_source(
                stripecustomer.customerid,
                card_id,
            )
            res['status'] = STATUS_SUCCESS
            res['message'] = REQUEST_HANDLE_SUCCESS
        except Exception as e:
            res['status'] = STATUS_FAIL
            res['message'] = STRIPE_ERROR
    
    return JsonResponse(res)

def do_free_trial(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripe_customer = StripeCustomer.objects.get(user=user)
        is_exist =  BillingHistory.objects.filter(stripecustomer = stripe_customer, method = BILLINGMETHOD.FREE.value).exists()
        if is_exist:
            res['status'] = STATUS_FAIL
            res['message'] = REQUEST_HANDLE_REJECT
        else:
            billing_history = BillingHistory.objects.create(method = BILLINGMETHOD.FREE.value, stripecustomer = stripe_customer)
            billing_history.save()
            res['status'] = STATUS_SUCCESS
            res['message'] = REQUEST_HANDLE_SUCCESS

    else:
        res['status'] = STATUS_FAIL
        res['message'] = CUSTOMER_NOT_REGISTERED  

    return JsonResponse(res)

def get_plan_status(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripe_customer = StripeCustomer.objects.get(user=user)
        is_exist = StripeSubscription.objects.filter(stripecustomer = stripe_customer).exists()
        if is_exist:
            stripe_subscription = StripeSubscription.objects.get(stripecustomer = stripe_customer)
            res['name'] = stripe_subscription.stripeproduct.name
            res['mode'] = stripe_subscription.stripeproduct.mode
        else:
            res['name'] = ''
            res['mode'] = ''

    else:
        res['name'] = ''
        res['mode'] = ''
        
    return JsonResponse(res)

def choose_plan(request):
    res = {}
    data = json.loads(request.body)
    name = data['name']
    mode = data['mode']

    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            res = stripe.Customer.list_sources(
                stripecustomer.customerid,
                object="card",
            )
            if (res.data == []):
                res['status'] = STATUS_FAIL
                res['message'] = CARD_NOT_REGISTERED
                return JsonResponse(res)
            else:
                is_exist = StripeSubscription.objects.filter(stripecustomer = stripecustomer).exists()
                if is_exist: # update subscription
                    stripe_subscription = StripeSubscription.objects.get(stripecustomer = stripecustomer)
                    subscription_id = stripe_subscription.subscription_id
                    customer_id = stripecustomer.customerid
                    stripe_product = StripeProduct.objects.get(name = name, mode = mode)
                    product_id = stripe_product.productid

                    try:
                        subscription = stripe.Subscription.retrieve(subscription_id)

                        stripe.Subscription.modify(
                            subscription.id,
                            cancel_at_period_end=False,
                            proration_behavior='always_invoice',
                            items=[{
                                'id': subscription['items']['data'][0].id,
                                'price': product_id,
                            }]
                        )

                        stripe_subscription.stripeproduct = stripe_product
                        stripe_subscription.save()

                        billing_history = BillingHistory.objects.create(method = BILLINGMETHOD.MEMBERSHIP.value, stripesubscription_id = subscription.id, status = BILLINGSTATUS.UPDATE.value, stripecustomer = stripecustomer, stripeproduct_id = stripe_product.id)

                        billing_history.save()

                        res['status'] = STATUS_SUCCESS
                        res['message'] = REQUEST_HANDLE_SUCCESS
                        return JsonResponse(res)

                    except Exception as e:
                        res['status'] = STATUS_FAIL
                        res['message'] = STRIPE_ERROR
                        return JsonResponse(res)

                else:
                    stripe_product = StripeProduct.objects.get(name = name, mode = mode)
                    product_id = stripe_product.productid
                    customer_id = stripecustomer.customerid
                    # create subscription
                    try:
                        subscription = stripe.Subscription.create(
                            customer=customer_id,
                            items=[
                                {"price": product_id},
                            ],
                        )

                        stripe_subscription = StripeSubscription.objects.create(subscription_id = subscription.id, stripecustomer = stripecustomer, stripeproduct = stripe_product)
                        stripe_subscription.save()

                        billing_history = BillingHistory.objects.create(method = BILLINGMETHOD.MEMBERSHIP.value, stripesubscription_id = subscription.id, status = BILLINGSTATUS.CREATE.value, stripecustomer = stripecustomer, stripeproduct_id = stripe_product.id)

                        billing_history.save()
                        
                        res['status'] = STATUS_SUCCESS
                        res['message'] = REQUEST_HANDLE_SUCCESS
                        return JsonResponse(res)
                    
                    except Exception as e:
                        res['status'] = STATUS_FAIL
                        res['message'] = STRIPE_ERROR
                        return JsonResponse(res)

        except Exception as e:
            res['status'] = STATUS_FAIL
            res['message'] = STRIPE_ERROR
            return JsonResponse(res)
        
    else:
        res['status'] = STATUS_FAIL
        res['message'] = CUSTOMER_NOT_REGISTERED
        return JsonResponse(res)
    
def get_current_subscription(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        is_exist = StripeSubscription.objects.filter(stripecustomer = stripecustomer).exists()
        if is_exist:
            stripe_subscription = StripeSubscription.objects.get(stripecustomer = stripecustomer)
            subscription = stripe.Subscription.retrieve(
                stripe_subscription.subscription_id,
            )
            res['status'] = stripe_subscription.stripeproduct.name
            res['start_date'] = subscription.start_date
            res['mode'] = stripe_subscription.stripeproduct.mode
            return JsonResponse(res)
        else:
            is_exist = BillingHistory.objects.filter(stripecustomer = stripecustomer, method = BILLINGMETHOD.FREE.value).exists()
            if is_exist:
                billing_history = BillingHistory.objects.get(stripecustomer = stripecustomer, method = BILLINGMETHOD.FREE.value)
                res['status'] = FREE_PLAN
                res['start_date'] = billing_history.created_at
                return JsonResponse(res)

    res['status'] = FREE_PLAN
    res['start_date'] = ''
    return JsonResponse(res)

def get_invoice_data(request):
    res = {}
    user = Users.objects.get(email = request.session.get('email'))
    is_exist = StripeCustomer.objects.filter(user = user).exists()
    if is_exist:
        stripecustomer = StripeCustomer.objects.get(user = user)
        try:
            # Retrieve all invoices for the specified customer
            invoices = stripe.Invoice.list(
                customer = stripecustomer.customerid,
            )
            return JsonResponse(invoices)
        except Exception as e:
            # Handle any errors from the Stripe API
            return JsonResponse(res)
        
    return JsonResponse(res)

def get_customer_data(request):
    stripecustomers = StripeCustomer.objects.select_related('user').all()
    res = []
    for stripecustomer in stripecustomers:
        res.append({"id": stripecustomer.id,
                  "username": stripecustomer.user.username,
                  "email": stripecustomer.email,
                  "customerid": stripecustomer.customerid})
    return JsonResponse(res, safe = False)

def get_customer_data_by_id(request):
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
        "city": stripecustomer.city,
        "position": stripecustomer.position,
        "bill_address": stripecustomer.bill_address,
        "mobile": stripecustomer.mobile,
        "created_at": stripecustomer.created_at,
        "updated_at": stripecustomer.updated_at,
    }
    return JsonResponse(res)

def get_subscription_data(request):
    stripecustomers = StripeCustomer.objects.select_related('user').all()
    res = []
    for stripecustomer in stripecustomers:
        res.append({"id": stripecustomer.id,
                  "username": stripecustomer.user.username,
                  "email": stripecustomer.email,
                  "customerid": stripecustomer.customerid})
    return JsonResponse(res, safe = False)
