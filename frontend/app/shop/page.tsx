"use client";

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
  user: number;
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

export default function ShopPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const fetchOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(savedUser);
    const isShopUser = (user.email || "").toLowerCase() === "shop@gadgetnest.com";

    if (!isShopUser) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/shop/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Unable to load orders.");
        return;
      }

      const data = await response.json();
      setOrders(data);
      setError("");
    } catch {
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, endpoint: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    setProcessingId(orderId);
    setError("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update order status.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? data.order : order
        )
      );

      setToast(
        endpoint === "/confirm/"
          ? "Order Accepted"
          : "Order cancelled from the shop."
      );
    } catch {
      setError("Unable to update order status right now.");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { background: "#fef3c7", color: "#92400e" };
      case "confirmed":
        return { background: "#dbeafe", color: "#1e40af" };
      case "processing":
        return { background: "#e0e7ff", color: "#3730a3" };
      case "shipped":
        return { background: "#cffafe", color: "#155e75" };
      case "delivered":
        return { background: "#dcfce7", color: "#166534" };
      case "cancelled":
        return { background: "#fee2e2", color: "#991b1b" };
      default:
        return { background: "#f3f4f6", color: "#374151" };
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <p style={{ fontSize: "18px", color: "#374151" }}>Loading shop orders...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "70vh", background: "#f8fafc", padding: "40px 20px 80px" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "25px",
            zIndex: 9999,
            background: "#166534",
            color: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            fontWeight: 600,
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
            Shop Orders
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Review customer orders and accept or cancel them.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>No orders yet</h2>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>New customer orders will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "22px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "16px",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
                      Order #{order.id}
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: "13px" }}>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    style={{
                      ...getStatusStyle(order.status),
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "18px" }}>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Customer</p>
                    <p style={{ color: "#111827", fontWeight: 600 }}>
                      {order.first_name} {order.last_name}
                    </p>
                    <p style={{ color: "#4b5563", fontSize: "13px" }}>{order.email}</p>
                  </div>

                  <div>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Address</p>
                    <p style={{ color: "#111827", fontWeight: 600 }}>
                      {order.address}, {order.upazila}, {order.district}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Phone</p>
                    <p style={{ color: "#111827", fontWeight: 600 }}>{order.mobile}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>Items</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", background: "#f9fafb", borderRadius: "10px", padding: "12px" }}>
                        <div>
                          <p style={{ fontWeight: 600, color: "#111827" }}>{item.product_name}</p>
                          <p style={{ fontSize: "13px", color: "#6b7280" }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 700, color: "#111827" }}>
                          ৳{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e5e7eb", paddingTop: "18px", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Total</p>
                    <p style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>
                      ৳{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "/confirm/")}
                      disabled={order.status === "confirmed" || order.status === "cancelled" || processingId === order.id}
                      style={{
                        background: order.status === "confirmed" || order.status === "cancelled" ? "#cbd5e1" : "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        fontWeight: 700,
                        cursor: order.status === "confirmed" || order.status === "cancelled" || processingId === order.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {processingId === order.id ? "Updating..." : "Accept Order"}
                    </button>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "/cancel/")}
                      disabled={order.status === "cancelled" || processingId === order.id}
                      style={{
                        background: order.status === "cancelled" || processingId === order.id ? "#cbd5e1" : "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        fontWeight: 700,
                        cursor: order.status === "cancelled" || processingId === order.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {processingId === order.id ? "Updating..." : "Cancel Order"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
