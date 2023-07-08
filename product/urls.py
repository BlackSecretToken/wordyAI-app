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
    path('test', views.test, name='test'),
]