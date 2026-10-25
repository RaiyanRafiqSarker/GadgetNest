"use client";

import { useState } from "react";
import { getProductImageUrl } from "@/lib/media";

interface ProductActionsProps {
  productId: number;
  productName: string;
  price: string;
  stock: number;
  isActive: boolean;
  image: string;
  slug: string;
}

interface CartItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

export default function ProductActions({
  productId,
  productName,
  price,
  stock,
  isActive,
  image,
  slug,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(stock, current + 1));
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // Allow the input to be temporarily empty while typing
    if (value === "") {
      setQuantity(0);
      return;
    }

    const numericValue = Number(value);

    if (!Number.isInteger(numericValue)) {
      return;
    }

    if (numericValue < 1) {
      setQuantity(1);
      return;
    }

    if (numericValue > stock) {
      setQuantity(stock);
      return;
    }

    setQuantity(numericValue);
  };

  const handleQuantityBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    }

    if (quantity > stock) {
      setQuantity(stock);
    }
  };

  const canBuy = isActive && stock > 0;

  const addToCart = () => {
    if (!canBuy || quantity < 1) {
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
      (item) => item.productId === productId
    );

    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + quantity,
                stock
              ),
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          productId,
          productName,
          price,
          quantity,
          image: getProductImageUrl(image),
          slug,
        },
      ];
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedCart)
    );

    setMessage("✓ Product added to cart");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      {/* Quantity */}
      {canBuy && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Quantity
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Decrease */}
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              style={{
                width: "42px",
                height: "42px",
                border: "none",
                background:
                  quantity <= 1
                    ? "#e5e7eb"
                    : "#f3f4f6",
                color:
                  quantity <= 1
                    ? "#9ca3af"
                    : "#111827",
                fontSize: "20px",
                cursor:
                  quantity <= 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              −
            </button>

            {/* Editable Quantity */}
            <input
              type="number"
              min="1"
              max={stock}
              value={quantity === 0 ? "" : quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              style={{
                width: "58px",
                height: "42px",
                border: "none",
                outline: "none",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "16px",
                color: "#111827",
                background: "white",
              }}
            />

            {/* Increase */}
            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              style={{
                width: "42px",
                height: "42px",
                border: "none",
                background:
                  quantity >= stock
                    ? "#e5e7eb"
                    : "#f3f4f6",
                color:
                  quantity >= stock
                    ? "#9ca3af"
                    : "#111827",
                fontSize: "20px",
                cursor:
                  quantity >= stock
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              +
            </button>
          </div>

          <p
            style={{
              color: "#6b7280",
              fontSize: "13px",
              marginTop: "8px",
            }}
          >
            Maximum available: {stock}
          </p>
        </div>
      )}

      {/* Add To Cart */}
      <button
        type="button"
        onClick={addToCart}
        disabled={!canBuy || quantity < 1}
        style={{
          width: "100%",
          padding: "14px 20px",
          background:
            canBuy && quantity > 0
              ? "#111827"
              : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "9px",
          fontSize: "16px",
          fontWeight: "600",
          cursor:
            canBuy && quantity > 0
              ? "pointer"
              : "not-allowed",
        }}
      >
        {canBuy ? "Add to Cart" : "Out of Stock"}
      </button>

      {/* Success Message */}
      {message && (
        <p
          style={{
            marginTop: "12px",
            color: "green",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </>
  );
}