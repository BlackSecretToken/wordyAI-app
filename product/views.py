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
import psutil

thread_dict = {}
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
        wcapi = API(
            url= apidata.api_url,
            consumer_key= apidata.consumerKey,
            consumer_secret= apidata.consumerToken,
            version="wc/v3",
            timeout = 100
        )
        try:
            products = wcapi.get("products", params={"page": 1, "per_page": 1}).json()
            download_thread = ProductDownloadThread(request, page)
            download_thread.start()

            thread_dict[download_thread.ident] = download_thread
            productDownloadThreadStatus = DownloadProductThreadStatus.objects.create(apidata = apidata, count = 0, thread_id=download_thread.ident)
            productDownloadThreadStatus.save()


            request.session['download_thread_id'] = productDownloadThreadStatus.id
            res['status'] = 'success'
            res['message'] = DOWNLOAD_START

        except Exception as e:
            # Handle any errors from the Stripe API
            print('error')
            res['status'] = STATUS_FAIL
            res['message'] = INVALID_API

    return JsonResponse(res)

def productDownloadStop(request):
    res = {}

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    is_exist = DownloadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
    if is_exist:
        downloadProductThreadStatus = DownloadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
        downloadProductThreadStatus.is_completed = True
        downloadProductThreadStatus.save()
        res['status'] = 'success'
        res['message'] = DOWNLOAD_STOP
    else:
        res['message'] = NO_DOWNLOAD_THREAD
    
    return JsonResponse(res)


def productDownloadStatus(request):
    res = {}

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    is_exist = DownloadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
    if is_exist:
        downloadProductThreadStatus = DownloadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
        res['total'] = downloadProductThreadStatus.count
        res['download_status'] = True # true: thread is alive
    else:
        res['download_status'] = False

    return JsonResponse(res)

def saveProductDetail(request):
    res = {}
    data = json.loads(request.body)
    description = data['description']
    product_id = data['id']
    product = Product.objects.get(id = product_id)
    print(product.product_status)
    if (product.product_status == PRODUCTSTATUS.UNOPTIMIZED.value):
        product.product_status = PRODUCTSTATUS.OPTIMIZED.value
    else:
        product.is_uploaded = False
    product.product_updated_description = description
    product.save()

    res['status'] = STATUS_SUCCESS
    res['message'] = REQUEST_HANDLE_SUCCESS

    return JsonResponse(res)

def getProductStatus(request):
    res = {}
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user)
    active_cnt = Product.objects.filter(apidata_id = apidata.id).count()
    optimized_cnt = Product.objects.filter(apidata_id = apidata.id, product_status = PRODUCTSTATUS.OPTIMIZED.value).count()
    unoptimized_cnt = Product.objects.filter(apidata_id = apidata.id, product_status = PRODUCTSTATUS.UNOPTIMIZED.value).count()
    new_optimized_cnt = Product.objects.filter(apidata_id = apidata.id, product_status = PRODUCTSTATUS.OPTIMIZED.value, is_uploaded = False).count()
    res['active_cnt'] = active_cnt
    res['optimized_cnt'] = optimized_cnt
    res['unoptimized_cnt'] = unoptimized_cnt
    res['new_optimized_cnt'] = new_optimized_cnt

    return JsonResponse(res)

def productPush(request):
    res={}
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    wcapi = API(
        url= apidata.api_url,
        consumer_key= apidata.consumerKey,
        consumer_secret= apidata.consumerToken,
        version="wc/v3",
        timeout = 100
    )
    data = { "description": "Hello" }
    print(wcapi.put("products/184996", data).json())


    return JsonResponse(res)


def productUploadStart(request):
    res = {}

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    new_optimized_cnt = Product.objects.filter(apidata_id = apidata.id, product_status = PRODUCTSTATUS.OPTIMIZED.value, is_uploaded = False).count()
    if new_optimized_cnt > 0:
        is_exist = UploadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
        if is_exist:
            res['status'] = STATUS_FAIL
            res['message'] = UPLOAD_THREAD_ALREADY_EXIST
        else:
            # check api ..
            wcapi = API(
                url= apidata.api_url,
                consumer_key= apidata.consumerKey,
                consumer_secret= apidata.consumerToken,
                version="wc/v3",
                timeout = 100
            )
            try:
                products = wcapi.get("products", params={"page": 1, "per_page": 1}).json()
                upload_thread = ProductUploadThread(request)
                upload_thread.start()

                thread_dict[upload_thread.ident] = upload_thread
                productUploadThreadStatus = UploadProductThreadStatus.objects.create(apidata = apidata, count = 0, thread_id=upload_thread.ident)
                productUploadThreadStatus.save()


                request.session['upload_thread_id'] = productUploadThreadStatus.id
                res['status'] = 'success'
                res['message'] = UPLOAD_START

            except Exception as e:
                # Handle any errors from the Stripe API
                print(e)
                res['status'] = STATUS_FAIL
                res['message'] = INVALID_API
    else:
        res['status'] = STATUS_FAIL
        res['message'] = NO_UPLOAD_PRODUCT

    return JsonResponse(res)

def productUploadStop(request):
    res = {}

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    is_exist = UploadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
    if is_exist:
        uploadProductThreadStatus = UploadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
        uploadProductThreadStatus.is_completed = True
        uploadProductThreadStatus.save()
        res['status'] = 'success'
        res['message'] = UPLOAD_STOP
    else:
        res['message'] = NO_UPLOAD_THREAD
    
    return JsonResponse(res)


def productUploadStatus(request):
    res = {}

    email = request.session.get('email')
    user = Users.objects.get(email = email)
    apidata = ApiData.objects.get(users = user) 
    is_exist = UploadProductThreadStatus.objects.filter(apidata = apidata, is_completed = False).exists()
    if is_exist:
        uploadProductThreadStatus = UploadProductThreadStatus.objects.get(apidata = apidata, is_completed = False)
        res['total'] = uploadProductThreadStatus.count
        res['upload_status'] = True # true: thread is alive
    else:
        res['upload_status'] = False

    return JsonResponse(res)


    


