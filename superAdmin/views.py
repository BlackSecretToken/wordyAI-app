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
from django.db.models import Count

# Create your views here.
@admin_login_required
def dashboard(request):
    context = {}
    context = default_context(request, context)
    ## get total customers 
    customers_cnt = StripeCustomer.objects.count()
    context['customers_cnt'] = customers_cnt

    ## get total products
    unique_product_names = StripeProduct.objects.values_list('name', flat=True).distinct()
    context['products_cnt'] = len(unique_product_names)

    ## sales count
    sales_count = BillingHistory.objects.count()
    context['sales_cnt'] = sales_count

    ## calculate revenue
    stripeProducts = StripeProduct.objects.all()
    products = {}
    products_name = {}
    for stripeProduct in stripeProducts:
        products[stripeProduct.id] = stripeProduct.price
        products_name[stripeProduct.id] = stripeProduct.name
    
    billingHistories = BillingHistory.objects.all()
    revenue = 0
    for billingHistory in billingHistories:
        revenue = revenue + products[billingHistory.stripeproduct_id]

    context['revenue'] = revenue

    # get the popular products
    popular_products = {"Basic": 0, "Standard": 0, "Enterprise": 0}
    billing_histories = BillingHistory.objects.values('stripeproduct_id').annotate(count=Count('id'))
    for billing_history in billing_histories:
        popular_products[products_name[billing_history['stripeproduct_id']]] = popular_products[products_name[billing_history['stripeproduct_id']]] + billing_history['count']
    products_set = []
    products_set.append({"Name": "Basic",
                  "count": popular_products['Basic']})
    products_set.append({"Name": "Standard",
                  "count": popular_products['Standard']})
    products_set.append({"Name": "Enterprise",
                  "count": popular_products['Enterprise']})
    
    ordered_products = sorted(products_set, key=lambda x: x['count'], reverse=True)
    print(ordered_products)
    context['popular_products'] = ordered_products

    # get the sales report


    # sales by country
    sales_by_country = BillingHistory.objects.select_related('stripecustomer').values('stripecustomer__country').annotate(count = Count('stripecustomer')).order_by('stripecustomer__country').all()
    context['sales_by_country'] = sales_by_country

    # get last invoices
    

    return render(request, 'admin/dashboard/dashboard.html', context)

