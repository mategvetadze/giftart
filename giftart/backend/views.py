from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib import messages
from decimal import Decimal, InvalidOperation

from .models import ContactMessage, Order

def home(request):
    return render(request, "home.html")

def aboutus(request):
    return render(request, "aboutus.html")

def contact(request):
    if request.method == "POST":
        name = request.POST.get("name", "")
        email = request.POST.get("email", "")
        message = request.POST.get("message", "")

        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message
        )
        messages.success(request, "Thank you! Your message has been sent.")
        return redirect("contact")

    return render(request, "contact.html")


def shop(request):
    return render(request, "shop.html")

def order(request):
    if request.method == "POST":
        # Extract all form data
        customer_name = request.POST.get("name", "")
        customer_email = request.POST.get("email", "")
        customer_phone = request.POST.get("phone", "")
        product = request.POST.get("product", "")
        quantity = request.POST.get("quantity")
        message = request.POST.get("message", "")
        delivery_address = request.POST.get("address", "")
        uploaded_file = request.FILES.get("file")

        # Handle price conversion
        price_decimal = None
        price_str = request.POST.get("price")
        if price_str:
            try:
                price_decimal = Decimal(price_str)
            except (InvalidOperation, ValueError):
                price_decimal = None

        # Create order
        Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            order_type='generic',
            product=product,
            quantity=int(quantity) if quantity else None,
            price=price_decimal,
            uploaded_file=uploaded_file,
            message=message,
            delivery_address=delivery_address
        )

        messages.success(request, "Your order has been placed successfully!")
        return redirect("order")

    return render(request, "order.html")

def order_photo(request):
    if request.method == "POST":
        # Extract form data
        customer_name = request.POST.get("name", "")
        customer_email = request.POST.get("email", "")
        customer_phone = request.POST.get("phone", "")
        message = request.POST.get("message", "")
        delivery_address = request.POST.get("address", "")
        uploaded_photo = request.FILES.get("photo")

        # Handle price
        price_decimal = None
        price_str = request.POST.get("price")
        if price_str:
            try:
                price_decimal = Decimal(price_str)
            except (InvalidOperation, ValueError):
                price_decimal = None

        # Create photo order
        Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            order_type='photo',
            price=price_decimal,
            uploaded_file=uploaded_photo,
            message=message,
            delivery_address=delivery_address
        )

        messages.success(request, "Your photo order has been placed successfully!")
        return redirect("order_photo")

    return render(request, "order-photo.html")


def order_video(request):
    if request.method == "POST":
        # Extract form data
        customer_name = request.POST.get("name", "")
        customer_email = request.POST.get("email", "")
        customer_phone = request.POST.get("phone", "")
        message = request.POST.get("message", "")
        delivery_address = request.POST.get("address", "")
        uploaded_video = request.FILES.get("video")

        # Handle price
        price_decimal = None
        price_str = request.POST.get("price")
        if price_str:
            try:
                price_decimal = Decimal(price_str)
            except (InvalidOperation, ValueError):
                price_decimal = None

        # Create video order
        Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            order_type='video',
            price=price_decimal,
            uploaded_file=uploaded_video,
            message=message,
            delivery_address=delivery_address
        )

        messages.success(request, "Your video order has been placed successfully!")
        return redirect("order_video")

    return render(request, "order-video.html")

def admin_login(request):
    if request.method == "POST":
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("admin_dashboard")
        else:
            messages.error(request, "Invalid username or password")
            return render(request, "adminlogin.html", {"error": "Invalid credentials"})

    return render(request, "adminlogin.html")

def admin_dashboard(request):
    if not request.user.is_authenticated:
        return redirect("admin_login")
    orders = Order.objects.all().order_by('-created_at')
    contact_messages = ContactMessage.objects.all().order_by('-created_at')

    context = {
        'orders': orders,
        'contact_messages': contact_messages,
        'total_orders': orders.count(),
        'pending_orders': orders.filter(status='pending').count(),
    }

    return render(request, "admin.html", context)
