import threading
import requests
import time
from .models import *
from wordyAI.openai import *
from woocommerce import API

class ProductDownloadThread(threading.Thread):
    def __init__(self, request, page):
        self.do_run = True
        self.count = 0
        self.page = page
        self.total = 0
        self.per_page = 10
        self.request = request
        email = self.request.session.get('email')
        user = Users.objects.get(email = email)
        apiData = ApiData.objects.get(users = user)
        self.apiData = apiData
        super().__init__()
    def run(self):
        wcapi = API(
            url= self.apiData.api_url,
            consumer_key= self.apiData.consumerKey,
            consumer_secret= self.apiData.consumerToken,
            version="wc/v3",
            timeout = 100
        )
        
        while self.do_run:
            cnt=0
            try:
                products = wcapi.get("products", params={"page": self.page, "per_page": self.per_page}).json() 
                print(len(products))
                for product in products:
                    ## check catetory is in ##
                    is_in = Category.objects.filter(apidata_id = self.apiData.id, category_id = product['categories'][0]['id']).exists()
                    category = []
                    if is_in :
                        category = Category.objects.get(apidata_id = self.apiData.id, category_id = product['categories'][0]['id'])
                        category.category_name = product['categories'][0]['name']
                        category.category_slug = product['categories'][0]['slug']
                        category.save()
                    else:
                        category = Category.objects.create(apidata_id = self.apiData.id, category_id = product['categories'][0]['id'], category_name = product['categories'][0]['name'], category_slug = product['categories'][0]['slug'])
                    ### register stock status  ############
                    is_in = StockStatus.objects.filter(apidata_id = self.apiData.id, status = product['stock_status']).exists()
                    stockstatus = None
                    if is_in:
                        stockstatus = StockStatus.objects.get(apidata_id = self.apiData.id, status = product['stock_status'])
                    else:
                        stockstatus = StockStatus.objects.create(apidata_id = self.apiData.id, status = product['stock_status'])
                        stockstatus.save()
                    
                    is_in = Product.objects.filter(apidata_id = self.apiData.id, product_id = product['id']).exists()
                    if is_in:
                        db_product = Product.objects.get(apidata_id = self.apiData.id, product_id = product['id'])
                        db_product.product_title = product['name']
                        db_product.product_slug = product['slug']
                        db_product.product_sku = product['sku']
                        db_product.product_image = product['images'][0]['src']
                        if not db_product.product_updated_description:
                            db_product.product_updated_description = product['description']
                        else:    
                            db_product.product_description = product['description']
                        db_product.product_stock_quantity = product['stock_quantity']
                        db_product.stockstatus_id = stockstatus.id
                        db_product.apidata_id = self.apiData.id
                        db_product.product_price = product['price']
                        db_product.save()
                    else:
                        db_product = Product.objects.create(
                            apidata_id = self.apiData.id, 
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
                self.total += cnt
                if cnt == 0:
                    break
                self.page +=1
                print(self.page)
            except Exception as e:
                # Handle any errors from the Stripe API
                print('error', e)
            self.setCount()
            self.check()
            time.sleep(0.1)

        # thread is terminated..
        is_exist = DownloadProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            downloadProductThreadStatus = DownloadProductThreadStatus.objects.get(apidata = self.apiData, is_completed = False)
            downloadProductThreadStatus.is_completed = True
            downloadProductThreadStatus.save()

    def stop(self, thread):
        self.thread = thread
        if hasattr(self, 'thread') and self.thread.is_alive():
            print('close')
            self.do_run = False
            self.thread.join()

    def check(self):
        is_exist = DownloadProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            self.do_run = True
        else:
            self.do_run = False
    def setCount(self):
        downloadProductThreadStatus = DownloadProductThreadStatus.objects.filter(apidata = self.apiData).latest('id')
        downloadProductThreadStatus.count = self.total
        downloadProductThreadStatus.save()

class ProductUploadThread(threading.Thread):
    def __init__(self, request):
        self.do_run = True
        self.count = 0
        self.request = request
        email = self.request.session.get('email')
        user = Users.objects.get(email = email)
        apiData = ApiData.objects.get(users = user)
        self.apiData = apiData
        super().__init__()

    def run(self):
        wcapi = API(
            url= self.apiData.api_url,
            consumer_key= self.apiData.consumerKey,
            consumer_secret= self.apiData.consumerToken,
            version="wc/v3",
            timeout = 100
        )
        
        products = Product.objects.filter(apidata_id = self.apiData.id, product_status = PRODUCTSTATUS.OPTIMIZED.value, is_uploaded = False).all()
        print(products.count())
        for product in products:
            if self.do_run == False:
                break
            self.count = self.count + 1
            try:
                data = { "description" : product.product_updated_description }
                wcapi.put( "products/" + str(product.product_id) , data).json()
                product.is_uploaded = True
                product.save()
                
            except Exception as e:
                # Handle any errors from the Stripe API
                print('error', e)

            self.setCount()
            self.check()
            time.sleep(0.1)
            
        # thread is terminated..
        is_exist = UploadProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            uploadProductThreadStatus = UploadProductThreadStatus.objects.get(apidata = self.apiData, is_completed = False)
            uploadProductThreadStatus.is_completed = True
            uploadProductThreadStatus.save()

    def stop(self, thread):
        self.thread = thread
        if hasattr(self, 'thread') and self.thread.is_alive():
            print('close')
            self.do_run = False
            self.thread.join()

    def check(self):
        is_exist = UploadProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            self.do_run = True
        else:
            self.do_run = False
    def setCount(self):
        uploadProductThreadStatus = UploadProductThreadStatus.objects.filter(apidata = self.apiData).latest('id')
        uploadProductThreadStatus.count = self.count
        uploadProductThreadStatus.save()

class ProductOptimizeThread(threading.Thread):
    def __init__(self, request):
        self.do_run = True
        self.count = 0
        self.request = request
        email = self.request.session.get('email')
        user = Users.objects.get(email = email)
        apiData = ApiData.objects.get(users = user)
        self.apiData = apiData
        super().__init__()

    def run(self):
        products = Product.objects.filter(apidata_id = self.apiData.id, product_status = PRODUCTSTATUS.UNOPTIMIZED.value).all()
        openaiPrompt = OpenaiPrompt.objects.first()
        print(products.count())
        for product in products:
            if self.do_run == False:
                break
            self.count = self.count + 1
            # do something..
            content = product.product_description
            res = chat(content, openaiPrompt.prompt, openaiPrompt.key, openaiPrompt.model)
            if (product.product_status == PRODUCTSTATUS.UNOPTIMIZED.value):
                product.product_status = PRODUCTSTATUS.OPTIMIZED.value
            else:
                product.is_uploaded = False
            product.product_updated_description = res
            product.save()

            self.setCount()
            self.check()
            time.sleep(1)
            
        # thread is terminated..
        is_exist = OptimizeProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            optimizeProductThreadStatus = OptimizeProductThreadStatus.objects.get(apidata = self.apiData, is_completed = False)
            optimizeProductThreadStatus.is_completed = True
            optimizeProductThreadStatus.save()

    def stop(self, thread):
        self.thread = thread
        if hasattr(self, 'thread') and self.thread.is_alive():
            print('close')
            self.do_run = False
            self.thread.join()

    def check(self):
        is_exist = OptimizeProductThreadStatus.objects.filter(apidata = self.apiData, is_completed = False).exists()
        if is_exist:
            self.do_run = True
        else:
            self.do_run = False
    def setCount(self):
        optimizeProductThreadStatus = OptimizeProductThreadStatus.objects.filter(apidata = self.apiData).latest('id')
        optimizeProductThreadStatus.count = self.count
        optimizeProductThreadStatus.save()

        