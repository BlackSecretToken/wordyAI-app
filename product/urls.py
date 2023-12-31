from django.urls import path
from . import views

app_name = 'product'
urlpatterns = [
    path('product', views.product, name='product_view'),
    path('getStockData', views.getStockData, name='getStockData'),
    path('getCategoryData', views.getCategoryData, name='getCategoryData'),
    path('getProductData', views.getProductData, name='getProductData'),
    path('getProductDataById', views.getProductDataById, name='getProductDataById'),
    path('detail/<product_id>', views.product_detail, name='product_detail_view'),
    path('productOptimize', views.productOptimize, name='product_optimze'),
    path('productDownloadStart', views.productDownloadStart, name='product_download_start'),
    path('productDownloadStop', views.productDownloadStop, name='product_download_stop'),
    path('productDownloadStatus', views.productDownloadStatus, name='product_download_status'),
    path('saveProductDetail', views.saveProductDetail, name='save_product_detail'),
    path('getProductStatus', views.getProductStatus, name='get_product_status'),
    path('productPush', views.productPush, name='product_push'),
    path('productUploadStart', views.productUploadStart, name='product_upload_start'),
    path('productUploadStop', views.productUploadStop, name='product_upload_stop'),
    path('productUploadStatus', views.productUploadStatus, name='product_upload_status'),
    path('productOptimizeStart', views.productOptimizeStart, name='product_optimize_start'),
    path('productOptimizeStop', views.productOptimizeStop, name='product_optimize_stop'),
    path('productOptimizeStatus', views.productOptimizeStatus, name='product_optimize_status'),
    path('checkThreadStatus', views.checkThreadStatus, name='check_thread_status'),
    path('test', views.test, name='test'),
]