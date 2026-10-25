from django.contrib import admin

from .models import (
    Brand,
    Category,
    Order,
    OrderItem,
    Product,
    ProductImage,
)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ("image", "caption", "is_primary")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "brand",
        "category",
        "price",
        "discount_percent",
        "stock",
        "is_active",
        "created_at",
    )

    list_filter = (
        "brand",
        "category",
        "discount_percent",
        "is_active",
    )

    search_fields = (
        "name",
        "brand__name",
        "category__name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    inlines = [ProductImageInline]

    class Media:
        js = ("products/admin/image_upload.js",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "first_name",
        "last_name",
        "total_amount",
        "delivery_method",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "delivery_method",
        "payment_method",
        "created_at",
    )

    search_fields = (
        "first_name",
        "last_name",
        "email",
        "mobile",
        "user__username",
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product",
        "quantity",
        "price",
    )

    search_fields = (
        "product__name",
    )