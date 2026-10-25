"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  upazila: string;
  district: string;
  mobile: string;
  email: string;
  comment: string;
  payment_method: string;
  delivery_method: string;
  delivery_charge: string;
  total_amount: string;
  status: string;
  items: OrderItem[];
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setError("Unable to load your orders.");
        return;
      }

      const data = await response.json();

      setOrders(data);
    } catch {
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    setCancellingOrderId(orderId);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to cancel the order.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? data.order : order
        )
      );

      // Show cancellation toast
      setToastMessage(`Order #${orderId} cancelled successfully!`);
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch {
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "cancelled":
        return "Your order is cancelled from the shop.";
      case "confirmed":
        return "Order Accepted";
      case "pending":
        return "Your order is pending.";
      case "processing":
        return "Your order is being processed.";
      case "shipped":
        return "Your order has been shipped.";
      case "delivered":
        return "Your order has been delivered.";
      default:
        return "Order status updated.";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "confirmed":
        return {
          background: "#dbeafe",
          color: "#1e40af",
        };

      case "processing":
        return {
          background: "#e0e7ff",
          color: "#3730a3",
        };

      case "shipped":
        return {
          background: "#cffafe",
          color: "#155e75",
        };

      case "delivered":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "cancelled":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {
          background: "#f3f4f6",
          color: "#374151",
        };
    }
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "70vh",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <p>Loading your orders...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "70vh",
        background: "#f8fafc",
        padding: "50px 20px 80px",
      }}
    >
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "25px",
            zIndex: 9999,
            background: "#166534",
            color: "white",
            padding: "14px 20px",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: "600",
            minWidth: "250px",
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            My Orders
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            View and manage your orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "10px",
              }}
            >
              No Orders Yet
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "25px",
              }}
            >
              You haven't placed any orders yet.
            </p>

            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 22px",
                background: "#111827",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "25px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "5px",
                      }}
                    >
                      Order #{order.id}
                    </h2>

                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                      }}
                    >
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span
                    style={{
                      ...getStatusStyle(order.status),
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div
                  style={{
                    marginBottom: "18px",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background:
                      order.status === "cancelled"
                        ? "#fef2f2"
                        : order.status === "confirmed"
                        ? "#ecfdf5"
                        : "#f8fafc",
                    color:
                      order.status === "cancelled"
                        ? "#991b1b"
                        : order.status === "confirmed"
                        ? "#166534"
                        : "#374151",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {getStatusMessage(order.status)}
                </div>

                {/* Order Items */}
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "12px",
                    }}
                  >
                    Items
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "15px",
                          padding: "12px",
                          background: "#f9fafb",
                          borderRadius: "8px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontWeight: "600",
                              color: "#111827",
                              marginBottom: "3px",
                            }}
                          >
                            {item.product_name}
                          </p>

                          <p
                            style={{
                              color: "#6b7280",
                              fontSize: "13px",
                            }}
                          >
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p
                          style={{
                            fontWeight: "600",
                            color: "#111827",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ৳
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Delivery Method
                    </p>

                    <p
                      style={{
                        color: "#111827",
                        fontWeight: "600",
                      }}
                    >
                      {order.delivery_method === "home"
                        ? "Home Delivery"
                        : order.delivery_method === "store"
                        ? "Store Pickup"
                        : "Request Express"}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Payment Method
                    </p>

                    <p
                      style={{
                        color: "#111827",
                        fontWeight: "600",
                      }}
                    >
                      Cash on Delivery
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Delivery Charge
                    </p>

                    <p
                      style={{
                        color: "#111827",
                        fontWeight: "600",
                      }}
                    >
                      ৳{Number(order.delivery_charge).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "18px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    Total
                  </span>

                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    ৳{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                {/* Cancel Button */}
                {order.status === "pending" && (
                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "18px",
                      borderTop: "1px solid #e5e7eb",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrderId === order.id}
                      style={{
                        padding: "10px 18px",
                        background:
                          cancellingOrderId === order.id
                            ? "#9ca3af"
                            : "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor:
                          cancellingOrderId === order.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {cancellingOrderId === order.id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}