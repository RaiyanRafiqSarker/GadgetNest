from django.urls import path

from .views import (
    BrandListView,
    CategoryListView,
    ProductListCreateView,
    ProductDetailView,
    CreateOrderView,
    ShopOrderListView,
    OrderDetailView,
    ConfirmOrderView,
    CancelOrderView,
)

urlpatterns = [
    path(
        "brands/",
        BrandListView.as_view(),
        name="brand-list",
    ),

    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),

    path(
        "products/",
        ProductListCreateView.as_view(),
        name="product-list-create",
    ),

    path(
        "products/<slug:slug>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),

    path(
        "orders/",
        CreateOrderView.as_view(),
        name="orders",
    ),

    path(
        "orders/shop/",
        ShopOrderListView.as_view(),
        name="shop-orders",
    ),

    path(
        "orders/<int:order_id>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),

    path(
        "orders/<int:order_id>/confirm/",
        ConfirmOrderView.as_view(),
        name="order-confirm",
    ),

    path(
        "orders/<int:order_id>/cancel/",
        CancelOrderView.as_view(),
        name="order-cancel",
    ),
]