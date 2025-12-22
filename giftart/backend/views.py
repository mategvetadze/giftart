from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

def home(request):
    return render(request, "home.html")

def aboutus(request):
    return render(request, "aboutus.html")

def contact(request):
    return render(request, "contact.html")


def shop(request):
    return render(request, "shop.html")

def order(request):
    return render(request, "order.html")

def order_photo(request):
    return render(request, "order_photo.html")


def order_video(request):
    return render(request, "order_video.html")

def admin_login(request):
    return HttpResponse("Hello World")

def admin_dashboard(request):
    return HttpResponse("Hello World")
