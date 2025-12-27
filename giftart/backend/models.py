from django.db import models

# Create your models here.

class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"

class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('generic', 'Generic'),
        ('photo', 'Photo'),
        ('video', 'Video'),
    ]

    # Customer info
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)

    # Order details
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES, default='generic')
    product = models.CharField(max_length=200, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Selected price/package cost")

    # File uploads
    uploaded_file = models.FileField(upload_to='orders/', null=True, blank=True)

    # Additional details
    message = models.TextField(blank=True, help_text="Special instructions or notes")
    delivery_address = models.TextField(blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ])

    def __str__(self):
        return f"{self.order_type} order by {self.customer_name}"
