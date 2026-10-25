from rest_framework import serializers
from .models import Brand, Category, Order, OrderItem, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
        ]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
        ]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    discounted_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    has_discount = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "brand",
            "name",
            "slug",
            "description",
            "price",
            "discount_percent",
            "discounted_price",
            "has_discount",
            "stock",
            "views_count",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "first_name",
            "last_name",
            "address",
            "upazila",
            "district",
            "mobile",
            "email",
            "comment",
            "payment_method",
            "delivery_method",
            "delivery_charge",
            "total_amount",
            "status",
            "items",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "delivery_charge",
            "total_amount",
            "status",
            "items",
            "created_at",
        ]