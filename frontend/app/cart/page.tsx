"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductImageUrl } from "@/lib/media";

interface CartItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const handleCheckout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!accessToken || !user) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }

    router.push("/checkout");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setCart([]);
      setLoaded(true);
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      const key = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
      const savedCart = localStorage.getItem(key);

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      const key = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
      localStorage.setItem(key, JSON.stringify(updatedCart));
    } catch {
      // ignore invalid user payload
    }
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cart
      .map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (productId: number) => {
    const updatedCart = cart.filter(
      (item) => item.productId !== productId
    );

    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  if (!loaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          Loading cart...
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Shopping Cart
          </h1>

          <Link
            href="/"
            style={{
              color: "#4f46e5",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "70px 20px",
              textAlign: "center",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "10px",
              }}
            >
              Your cart is empty
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "25px",
              }}
            >
              Add some products to your cart to see them here.
            </p>

            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "#111827",
                color: "white",
                padding: "12px 22px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* Cart Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.image ? (
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#9ca3af",
                        }}
                      >
                        No image
                      </span>
                    )}
                  </div>

                  {/* Product Information */}
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      style={{
                        color: "#111827",
                        textDecoration: "none",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      {item.productName}
                    </Link>

                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        margin: "10px 0",
                      }}
                    >
                      ৳{item.price}
                    </p>

                    {/* Quantity */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.productId)
                        }
                        style={{
                          width: "34px",
                          height: "34px",
                          border: "1px solid #d1d5db",
                          background: "#f3f4f6",
                          borderRadius: "6px",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          minWidth: "25px",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.productId)
                        }
                        style={{
                          width: "34px",
                          height: "34px",
                          border: "1px solid #d1d5db",
                          background: "#f3f4f6",
                          borderRadius: "6px",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "15px",
                      }}
                    >
                      ৳
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId)
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: "#dc2626",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "25px",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.06)",
                position: "sticky",
                top: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  color: "#6b7280",
                }}
              >
                <span>Items</span>
                <span>
                  {cart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "18px",
                  marginTop: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                <span>Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>

            
          <button
            type="button"
            onClick={handleCheckout}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "25px",
              padding: "14px 20px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "9px",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Proceed to Checkout
          </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}