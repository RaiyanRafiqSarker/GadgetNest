"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductImageUrl } from "@/lib/media";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
}

interface CartItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [message, setMessage] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(product.id));
  }, [product.id]);

  const canBuy =
    product.is_active && product.stock > 0;

  const handleToggleFavorite = () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      return;
    }

    const updatedFavorites = toggleFavorite({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      categoryName: product.category?.name,
      brandName: product.category?.name,
    });

    setFavorite(updatedFavorites.some((item) => item.id === product.id));
    window.dispatchEvent(new Event("storage"));
  };

  const addToCart = () => {
    if (!canBuy) {
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      return;
    }

    const userData = JSON.parse(savedUser);
    const storageKey = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
    const existingCart: CartItem[] = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const existingItem = existingCart.find(
      (item) => item.productId === product.id
    );

    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                product.stock
              ),
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          slug: product.slug,
        },
      ];
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedCart)
    );

    // Update Navbar cart count immediately
    window.dispatchEvent(new Event("storage"));

    setMessage("✓ Added to cart");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.08)",
        width: "100%",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: "100%",
          height: "240px",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <button
          type="button"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleToggleFavorite();
          }}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            background: favorite ? "#fff1f2" : "rgba(255,255,255,0.9)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.12)",
            color: favorite ? "#ef4444" : "#374151",
            fontSize: "18px",
            zIndex: 2,
          }}
        >
          {favorite ? "♥" : "♡"}
        </button>

        {product.image ? (
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <p
            style={{
              color: "#9ca3af",
            }}
          >
            No image
          </p>
        )}
      </div>

      {/* Product Information */}
      <div
        style={{
          padding: "20px",
        }}
      >
        {/* Category */}
        <div
          style={{
            display: "inline-block",
            background: "#eef2ff",
            color: "#4f46e5",
            fontSize: "12px",
            fontWeight: "600",
            padding: "5px 9px",
            borderRadius: "20px",
            marginBottom: "10px",
          }}
        >
          {product.category?.name ||
            "Uncategorized"}
        </div>

        {/* Product Name */}
        <h3
          style={{
            fontSize: "19px",
            fontWeight: "600",
            marginBottom: "8px",
            lineHeight: "1.3",
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "4px",
            height: "42px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {product.description}
        </p>

        {/* See More */}
        <Link
          href={`/products/${product.slug}`}
          style={{
            display: "inline-block",
            color: "#4f46e5",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            marginBottom: "14px",
          }}
        >
          See More
        </Link>

        {/* Price */}
        <p
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          ৳{product.price}
        </p>

        {/* Stock */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          Stock: {product.stock}
        </p>

        {/* Availability */}
        <p
          style={{
            color: product.is_active
              ? "green"
              : "red",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {product.is_active
            ? product.stock > 0
              ? "Available"
              : "Out of Stock"
            : "Unavailable"}
        </p>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={addToCart}
          disabled={!canBuy}
          style={{
            width: "100%",
            background: canBuy
              ? "#111827"
              : "#9ca3af",
            color: "white",
            padding: "11px 18px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: canBuy
              ? "pointer"
              : "not-allowed",
          }}
        >
          {canBuy
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

        {/* Success Message */}
        {message && (
          <p
            style={{
              color: "#15803d",
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}