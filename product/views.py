from django.shortcuts import render, redirect
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.core import serializers
from wordyAI.utils import *
from wordyAI.constant import *
from wordyAI.decorators import *
from wordyAI.message import *
from django.http import JsonResponse
import json
from woocommerce import API
from home.models import *
from .models import *
from wordyAI.openai import *
from .thread import *
import threading
# Create your views here.
def getCategory(wcapi, request):
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user)
    page = 1
    per_page = 100
    total = 0

    while True:
        cnt=0
        categories = wcapi.get("products/categories", params={"page": page, "per_page": per_page}).json() 
        for category in categories:
            is_in = Category.objects.filter(apidata_id = apiData.id, category_id = category['id']).exists()
            if is_in:
                db_category = Category.objects.get(apidata_id = apiData.id, category_id = category['id'])
                db_category.category_name = category['name']
                db_category.category_slug = category['slug']
                db_category.save()
            else:
                db_category = Category.objects.create(apidata_id = apiData.id, category_id = category['id'], category_name = category['name'], category_slug = category['slug'])
                db_category.save()
            cnt +=1
            ## save product ####
        total += cnt
        if cnt == 0:
            break
        page +=1
        print(page)
    print(total)

def getProduct(request):
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user)
    wcapi = API(
        url= apiData.api_url,
        consumer_key= apiData.consumerKey,
        consumer_secret= apiData.consumerToken,
        version="wc/v3",
        timeout = 100
    )
    page = 1
    per_page = 10
    total = 0

    while page < 5:
        cnt=0
        try:
            products = wcapi.get("products", params={"page": page, "per_page": per_page}).json() 
            if len(products) == per_page:
                print('error')
            for product in products:
                ## check catetory is in ##
                is_in = Category.objects.filter(apidata_id = apiData.id, category_id = product['categories'][0]['id']).exists()
                category = []
                if is_in :
                    category = Category.objects.get(apidata_id = apiData.id, category_id = product['categories'][0]['id'])
                    category.category_name = product['categories'][0]['name']
                    category.category_slug = product['categories'][0]['slug']
                    category.save()
                else:
                    category = Category.objects.create(apidata_id = apiData.id, category_id = product['categories'][0]['id'], category_name = product['categories'][0]['name'], category_slug = product['categories'][0]['slug'])
                ### register stock status  ############
                is_in = StockStatus.objects.filter(apidata_id = apiData.id, status = product['stock_status']).exists()
                stockstatus = None
                if is_in:
                    stockstatus = StockStatus.objects.get(apidata_id = apiData.id, status = product['stock_status'])
                else:
                    stockstatus = StockStatus.objects.create(apidata_id =apiData.id, status = product['stock_status'])
                    stockstatus.save()
                
                is_in = Product.objects.filter(apidata_id = apiData.id, product_id = product['id']).exists()
                if is_in:
                    db_product = Product.objects.get(apidata_id = apiData.id, product_id = product['id'])
                    db_product.product_title = product['name']
                    db_product.product_slug = product['slug']
                    db_product.product_sku = product['sku']
                    db_product.product_image = product['images'][0]['src']
                    db_product.product_description = product['description']
                    db_product.product_stock_quantity = product['stock_quantity']
                    db_product.stockstatus_id = stockstatus.id
                    db_product.apidata_id = apiData.id
                    db_product.product_price = product['price']
                    db_product.save()
                else:
                    db_product = Product.objects.create(
                        apidata_id = apiData.id, 
                        product_id = product['id'],
                        product_title = product['name'],
                        product_slug = product['slug'],
                        product_sku = product['sku'],
                        product_image = product['images'][0]['src'],
                        product_description = product['description'],
                        product_stock_quantity = product['stock_quantity'],
                        product_price = product['price'],
                        product_status = PRODUCTSTATUS.UNOPTIMIZED.value,
                        stockstatus_id = stockstatus.id,
                        category_id = category.id
                    )
                    db_product.save()
                cnt +=1
                ## save product ####
            total += cnt
            if cnt == 0:
                break
            page +=1
            print(page)
        except Exception as e:
            # Handle any errors from the Stripe API
            print('error')
    print(total)

def test(request):
    # getCategory(wcapi, request)
    getProduct(request)
    return JsonResponse({})

def get_products(api):
    pass

@login_required
def product(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'product/product.html', context)

@login_required
def product_detail(request, product_id):
    context = {}
    context = default_context(request, context)
    context['product_id'] = product_id
    return render(request, 'product/product_detail.html', context)

def getProductData(request):
    res = {}
    data = json.loads(request.body)
    filterStatus = data['filterStatus']
    filterStock = data['filterStock']
    filterCategory = data['filterCategory']
    pageNum = data['pageNum']
    orderQueue = data['orderQueue']
    print(orderQueue)

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user)

    products = Product.objects.all()
    products = products.filter(apidata_id = apiData.id)

    if filterStatus > 0:
        products = products.filter(product_status=filterStatus)

    if filterCategory > 0:
        products = products.filter(category_id=filterCategory)

    if filterStock > 0:
        products = products.filter(stockstatus_id=filterStock)

    totalCount = products.count()

    products = products.order_by(*orderQueue)

    products = products[(pageNum-1)*10:pageNum*10]
    products_data = serializers.serialize('json', products)
    res['totalCount'] = totalCount
    res['products'] = products_data

    return JsonResponse(res, safe=False)


def getStockData(request):
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user)
    stockstatus = StockStatus.objects.filter(apidata_id = apiData.id).all()
    stockstatus_data = serializers.serialize('json', stockstatus)
    return JsonResponse(stockstatus_data, safe = False)

def getCategoryData(request):
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user)
    stockstatus = Category.objects.filter(apidata_id = apiData.id).all()
    stockstatus_data = serializers.serialize('json', stockstatus)
    return JsonResponse(stockstatus_data, safe = False)

def getProductDataById(request):
    res = {}
    data = json.loads(request.body)
    product_id = data['id']
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apiData = ApiData.objects.get(users = user) 
    product = Product.objects.get(apidata_id = apiData.id, id = product_id)
    product_dict = model_to_dict(product)
    json_data = json.dumps(product_dict, cls=DjangoJSONEncoder)
    # product_data = serializers.serialize('json', product)
    return JsonResponse(json_data, safe = False)
    # return JsonResponse(res)

def productOptimize(request):
    res = {}
    data = json.loads(request.body)
    message = data['message']
    res['message'] = chat(message)
    return JsonResponse(res)

def productDownloadStart(request):
    res = {}
    data = json.loads(request.body)
    page = data['page']

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 

    is_exist = DownloadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
    if is_exist:
        res['status'] = STATUS_FAIL
        res['message'] = DOWNLOAD_THREAD_ALREADY_EXIST
    else:
        # check api ..
        # wcapi = API(
        #     url= apidata.api_url,
        #     consumer_key= apidata.consumerKey,
        #     consumer_secret= apidata.consumerToken,
        #     version="wc/v3",
        #     timeout = 100
        # )
        # try:
        #     products = wcapi.get("products", params={"page": 1, "per_page": 1}).json()
        download_thread = ProductDownloadThread(request, page)
        download_thread.start()

        productDownloadThreadStatus = DownloadProductThreadStatus.objects.create(apidata = apidata, count = 0, thread_id=download_thread.ident)
        productDownloadThreadStatus.save()

        request.session['download_thread_id'] = productDownloadThreadStatus.id
        res['thread_name'] = download_thread.name
        res['tread_id'] = download_thread.ident
        res['status'] = STATUS_SUCCESS
        res['message'] = DOWNLOAD_START
        res['new'] = get_thread_by_id(download_thread.ident).ident

        # except Exception as e:
        #     # Handle any errors from the Stripe API
        #     print('error')
        #     res['status'] = STATUS_FAIL
        #     res['message'] = INVALID_API

    return JsonResponse(res)

def productDownloadStop(request):
    res = {}
    download_thread_id = request.session.get('download_thread_id')
    productDownloadThreadStatus = DownloadProductThreadStatus.objects.get(id = download_thread_id )
    download_thread = get_thread_by_id(productDownloadThreadStatus.thread_id)

    if download_thread is not None:
        download_thread.stop(download_thread)
        res['status'] = 'success'
        res['message'] = DOWNLOAD_STOP
    else:
        res['message'] = NO_DOWNLOAD_THREAD
    
    return JsonResponse(res)

def get_thread_by_id(thread_id):
    for thread in threading.enumerate():
        if thread.ident == thread_id:
            return thread
    return None

def productDownloadStatus(request):
    res = {}
    download_thread_id = request.session.get('download_thread_id')
    print('------------', download_thread_id)
    if download_thread_id is None:
        email = request.session.get('email')
        user = Users.objects.get(email = email)
        apidata = ApiData.objects.get(users = user) 

        is_exist = DownloadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
        if is_exist:
            downloadProductThreadStatus = DownloadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
            download_thread = get_thread_by_id(downloadProductThreadStatus.thread_id)
            if download_thread.is_alive():
                res['total'] = download_thread.total
                res['download_status'] = True # true: thread is alive
            else:
                res['download_status'] = False
                downloadProductThreadStatus.is_completed = True
                downloadProductThreadStatus.save()
        else:
            res['download_status'] = False
    else:
        productDownloadThreadStatus = DownloadProductThreadStatus.objects.get(id = download_thread_id )
        print('------------', productDownloadThreadStatus.thread_id)
        download_thread = get_thread_by_id(productDownloadThreadStatus.thread_id)
        print('------------', download_thread)
        if download_thread is None:
            email = request.session.get('email')
            user = Users.objects.get(email = email)
            apidata = ApiData.objects.get(users = user)
            is_exist =  DownloadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
            if is_exist:
                downloadProductThreadStatus = DownloadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
                downloadProductThreadStatus.is_completed = True
                downloadProductThreadStatus.save()
            res['download_status'] = False
        else:
            if download_thread.is_alive():
                res['total'] = download_thread.total
                res['download_status'] = True # true: thread is alive
            else:
                res['download_status'] = False
                downloadProductThreadStatus.is_completed = True
                downloadProductThreadStatus.save()

    return JsonResponse(res)

