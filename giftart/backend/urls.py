from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('contact/', views.contact, name='contact'),
    path('shop/', views.shop, name='shop'),
    path('order/', views.order, name='order'),
    path('order/photo/', views.order_photo, name='order_photo'),
    path('order/video/', views.order_video, name='order_video'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin_login/', views.admin_login, name='admin_login'),
]
