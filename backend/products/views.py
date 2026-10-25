from decimal import Decimal

from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Order, OrderItem, Brand, Category
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    BrandSerializer,
    CategorySerializer,
)


class BrandListView(generics.ListAPIView):

    queryset = Brand.objects.filter(is_active=True).order_by("name")

    serializer_class = BrandSerializer


class CategoryListView(generics.ListAPIView):

    queryset = Category.objects.filter(is_active=True).order_by("name")

    serializer_class = CategorySerializer


class ProductListCreateView(generics.ListCreateAPIView):

    queryset = Product.objects.filter(is_active=True)

    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    lookup_field = "slug"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count = (instance.views_count or 0) + 1
        instance.save(update_fields=["views_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CreateOrderView(APIView):

    permission_classes = [IsAuthenticated]

    # -----------------------------------------
    # GET: Logged-in user's orders
    # -----------------------------------------
    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related(
            "items"
        ).order_by(
            "-created_at"
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -----------------------------------------
    # POST: Create a new order
    # -----------------------------------------
    @transaction.atomic
    def post(self, request):

        data = request.data

        items = data.get("items", [])

        if not items:
            return Response(
                {
                    "error": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        required_fields = [
            "first_name",
            "last_name",
            "address",
            "upazila",
            "district",
            "mobile",
            "email",
            "delivery_method",
        ]

        for field in required_fields:

            if not data.get(field):

                return Response(
                    {
                        "error": (
                            f"{field.replace('_', ' ').title()} "
                            "is required."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        delivery_method = data.get(
            "delivery_method"
        )

        delivery_charges = {
            "home": Decimal("70.00"),
            "store": Decimal("0.00"),
            "express": Decimal("120.00"),
        }

        if delivery_method not in delivery_charges:

            return Response(
                {
                    "error": "Invalid delivery method."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        delivery_charge = delivery_charges[
            delivery_method
        ]

        payment_method = "cod"

        subtotal = Decimal("0.00")

        validated_items = []

        for item in items:

            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if not product_id or not quantity:

                return Response(
                    {
                        "error": "Invalid cart item."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:

                quantity = int(quantity)

            except (TypeError, ValueError):

                return Response(
                    {
                        "error": "Invalid quantity."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if quantity <= 0:

                return Response(
                    {
                        "error": (
                            "Quantity must be greater than zero."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:

                product = (
                    Product.objects
                    .select_for_update()
                    .get(id=product_id)
                )

            except Product.DoesNotExist:

                return Response(
                    {
                        "error": (
                            f"Product with ID {product_id} "
                            "does not exist."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not product.is_active:

                return Response(
                    {
                        "error": (
                            f"{product.name} "
                            "is currently unavailable."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.stock < quantity:

                return Response(
                    {
                        "error": (
                            f"Only {product.stock} unit(s) "
                            f"of {product.name} are available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            item_total = (
                product.price * quantity
            )

            subtotal += item_total

            validated_items.append(
                {
                    "product": product,
                    "quantity": quantity,
                    "price": product.price,
                }
            )

        total_amount = (
            subtotal + delivery_charge
        )

        order = Order.objects.create(
            user=request.user,
            first_name=data["first_name"],
            last_name=data["last_name"],
            address=data["address"],
            upazila=data["upazila"],
            district=data["district"],
            mobile=data["mobile"],
            email=data["email"],
            comment=data.get("comment", ""),
            payment_method=payment_method,
            delivery_method=delivery_method,
            delivery_charge=delivery_charge,
            total_amount=total_amount,
            status="pending",
        )

        for item in validated_items:

            product = item["product"]
            quantity = item["quantity"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=item["price"],
            )

            product.stock -= quantity

            product.save(
                update_fields=["stock"]
            )

        serializer = OrderSerializer(
            order
        )

        return Response(
            {
                "message": "Order placed successfully.",
                "order": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
class ShopOrderListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response(
                {
                    "error": "Access denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        orders = (
            Order.objects
            .select_related("user")
            .prefetch_related("items")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(orders, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class OrderDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):

        try:
            order = (
                Order.objects
                .prefetch_related("items")
                .get(
                    id=order_id,
                    user=request.user
                )
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ConfirmOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, order_id):

        if not request.user.is_staff:
            return Response(
                {
                    "error": "Access denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            order = (
                Order.objects
                .select_for_update()
                .prefetch_related("items")
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status == "cancelled":
            return Response(
                {
                    "error": "Cancelled orders cannot be accepted."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.status == "confirmed":
            serializer = OrderSerializer(order)
            return Response(
                {
                    "message": "Order already accepted.",
                    "order": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        order.status = "confirmed"
        order.save(update_fields=["status"])

        serializer = OrderSerializer(order)

        return Response(
            {
                "message": "Order accepted successfully.",
                "order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class CancelOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, order_id):

        if request.user.is_staff:
            try:
                order = (
                    Order.objects
                    .select_for_update()
                    .prefetch_related("items")
                    .get(id=order_id)
                )
            except Order.DoesNotExist:
                return Response(
                    {
                        "error": "Order not found."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            try:
                order = (
                    Order.objects
                    .select_for_update()
                    .prefetch_related("items")
                    .get(
                        id=order_id,
                        user=request.user
                    )
                )
            except Order.DoesNotExist:
                return Response(
                    {
                        "error": "Order not found."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

        if order.status == "cancelled":
            return Response(
                {
                    "error": "This order is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.is_staff and order.status != "pending":
            return Response(
                {
                    "error": "Only pending orders can be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save(update_fields=["stock"])

        order.status = "cancelled"
        order.save(update_fields=["status"])

        serializer = OrderSerializer(order)

        return Response(
            {
                "message": "Order cancelled successfully.",
                "order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
        