"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductImageUrl } from "@/lib/media";

interface CartItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserData | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [upazila, setUpazila] = useState("");
  const [district, setDistrict] = useState("Dhaka - City");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [deliveryMethod, setDeliveryMethod] =
    useState("home");

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [orderError, setOrderError] =
    useState("");

  useEffect(() => {
    const accessToken =
      localStorage.getItem("accessToken");

    const savedUser =
      localStorage.getItem("user");

    if (!accessToken || !savedUser) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login?next=/checkout");
      return;
    }

    let parsedUser: UserData;

    try {
      parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
      setEmail(parsedUser.email || "");
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
      return;
    }

    const savedUserData =
      localStorage.getItem("user");

    if (!savedUserData) {
      router.push("/login?next=/checkout");
      return;
    }

    const userData = JSON.parse(savedUserData);
    const cartKey = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
    const savedCart = localStorage.getItem(cartKey);

    if (!savedCart) {
      router.push("/cart");
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart);

      if (!parsedCart.length) {
        router.push("/cart");
        return;
      }

      setCart(parsedCart);

      /*
       * Get additional user information
       * from the backend.
       */
      fetch(
        "http://127.0.0.1:8000/api/auth/me/",
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      )
        .then(async (response) => {
          if (!response.ok) {
            return null;
          }

          return response.json();
        })
        .then((data) => {
          if (data) {
            setMobile(
              data.phone_number || ""
            );

            setEmail(
              data.email ||
                parsedUser.email ||
                ""
            );

            setFirstName(
              data.first_name || ""
            );

            setLastName(
              data.last_name || ""
            );

            setAddress(
              data.address || ""
            );

            setUpazila(
              data.upazila || ""
            );

            setDistrict(
              data.district ||
                "Dhaka - City"
            );
          }
        })
        .catch(() => {
          // Keep checkout fields editable.
        });
    } catch {
      router.push("/cart");
    }
  }, [router]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );

  const deliveryCharge =
    deliveryMethod === "home"
      ? 70
      : deliveryMethod === "express"
        ? 120
        : 0;

  const total =
    subtotal + deliveryCharge;

  /*
   * Place the order through Django API.
   */
  const handleConfirmOrder = async () => {
    setOrderError("");

    if (!agreeTerms) {
      alert(
        "Please agree to the Terms and Conditions."
      );
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !address.trim() ||
      !upazila.trim() ||
      !district.trim() ||
      !mobile.trim() ||
      !email.trim()
    ) {
      alert(
        "Please fill in all required shipping and billing fields."
      );
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty.");
      router.push("/cart");
      return;
    }

    const accessToken =
      localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      address: address.trim(),
      upazila: upazila.trim(),
      district: district.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      comment: comment.trim(),
      delivery_method: deliveryMethod,

      /*
       * Only send product ID and quantity.
       * Django calculates the actual prices.
       */
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOrderError(
          data.error ||
            "Failed to place the order."
        );

        setIsPlacingOrder(false);
        return;
      }

      /*
       * Order successfully created.
       * Remove the purchased cart.
       */
      localStorage.removeItem("cart");

      /*
       * Update navbar cart count.
       */
      window.dispatchEvent(
        new Event("storage")
      );

      alert(
        `Order #${data.order.id} placed successfully!`
      );

      /*
       * Go to account page for now.
       */
      router.push("/account");
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      setOrderError(
        "Unable to connect to the server. Please try again."
      );

      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main
  style={{
    minHeight: "100vh",
    background: "#f3f4f8",
    padding: "30px 20px 50px",
    color: "#1f2937",
  }}
>
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(320px, 1fr)",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* LEFT SIDE */}
          <div>
            {/* SHIPPING & BILLING */}
            <section
              style={{
                background: "white",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "28px",
                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "18px",
                  paddingBottom: "14px",
                  borderBottom:
                    "1px solid #eeeeee",
                }}
              >
                <span
                  style={{
                    color: "#ef4b2f",
                    marginRight: "10px",
                  }}
                >
                  ▮
                </span>
                Shipping & Billing
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px 30px",
                }}
              >
                <InputField
                  label="First Name"
                  placeholder="First Name*"
                  value={firstName}
                  onChange={setFirstName}
                />

                <InputField
                  label="Last Name"
                  placeholder="Last Name*"
                  value={lastName}
                  onChange={setLastName}
                />

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <InputField
                    label="Address"
                    placeholder="Address*"
                    value={address}
                    onChange={setAddress}
                  />
                </div>

                <InputField
                  label="Upazila/Thana"
                  placeholder="Upazila/Thana*"
                  value={upazila}
                  onChange={setUpazila}
                />

                <div>
                  <label
                    style={labelStyle}
                  >
                    District
                  </label>

                  <select
                    value={district}
                    onChange={(e) =>
                      setDistrict(e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option>
                      Dhaka - City
                    </option>
                    <option>Dhaka</option>
                    <option>Gazipur</option>
                    <option>Narayanganj</option>
                    <option>Chattogram</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                    <option>Barishal</option>
                    <option>Rangpur</option>
                    <option>Mymensingh</option>
                    <option>Comilla</option>
                  </select>
                </div>

                <InputField
                  label="Mobile"
                  placeholder="Telephone*"
                  value={mobile}
                  onChange={setMobile}
                />

                <InputField
                  label="Email"
                  placeholder="E-Mail*"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <label
                    style={labelStyle}
                  >
                    Comment
                  </label>

                  <textarea
                    placeholder="Any special requirement/instruction for us?"
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* PAYMENT + DELIVERY */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "28px",
              }}
            >
              {/* PAYMENT */}
              <section
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    paddingBottom: "14px",
                    borderBottom:
                      "1px solid #eeeeee",
                  }}
                >
                  <span
                    style={{
                      color: "#ef4b2f",
                      marginRight: "10px",
                    }}
                  >
                    ▤
                  </span>
                  Payment Method
                </h2>

                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "18px",
                  }}
                >
                  Select a payment method
                </p>

                <label
                  style={radioLabelStyle}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                  />
                  Cash on Delivery
                </label>

                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    marginTop: "28px",
                    marginBottom: "10px",
                  }}
                >
                  We Accept:
                </p>

                <p
                  style={{
                    color: "#666",
                    fontSize: "13px",
                  }}
                >
                  CASH ON DELIVERY
                </p>
              </section>

              {/* DELIVERY */}
              <section
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    paddingBottom: "14px",
                    borderBottom:
                      "1px solid #eeeeee",
                  }}
                >
                  <span
                    style={{
                      color: "#ef4b2f",
                      marginRight: "10px",
                    }}
                  >
                    🚚
                  </span>
                  Delivery Method
                </h2>

                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "18px",
                  }}
                >
                  Select a delivery method
                </p>

                <label
                  style={radioLabelStyle}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="home"
                    checked={
                      deliveryMethod === "home"
                    }
                    onChange={() =>
                      setDeliveryMethod("home")
                    }
                  />
                  Home Delivery - ৳70
                </label>

                <label
                  style={radioLabelStyle}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="store"
                    checked={
                      deliveryMethod === "store"
                    }
                    onChange={() =>
                      setDeliveryMethod("store")
                    }
                  />
                  Store Pickup - ৳0
                </label>

                <label
                  style={radioLabelStyle}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={
                      deliveryMethod === "express"
                    }
                    onChange={() =>
                      setDeliveryMethod("express")
                    }
                  />
                  Request Express - ৳120
                </label>
              </section>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <section
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.05)",
              position: "sticky",
              top: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                paddingBottom: "14px",
                borderBottom:
                  "1px solid #eeeeee",
              }}
            >
              <span
                style={{
                  color: "#ef4b2f",
                  marginRight: "10px",
                }}
              >
                ▤
              </span>
              Order Summary
            </h2>

            {/* CART ITEMS */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "flex",
                    gap: "12px",
                    paddingBottom: "14px",
                    marginBottom: "14px",
                    borderBottom:
                      "1px solid #eeeeee",
                  }}
                >
                  <img
                    src={getProductImageUrl(item.image)}
                    alt={item.productName}
                    style={{
                      width: "65px",
                      height: "65px",
                      objectFit: "contain",
                      borderRadius: "6px",
                      background: "#f8f8f8",
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      {item.productName}
                    </p>

                    <p
                      style={{
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      ৳{item.price} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ৳
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div
              style={{
                borderTop:
                  "1px solid #eeeeee",
              }}
            >
              <SummaryRow
                label="Sub-Total:"
                value={`৳${subtotal.toFixed(2)}`}
              />

              <SummaryRow
                label="Delivery:"
                value={`৳${deliveryCharge.toFixed(2)}`}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "18px 0",
                  borderTop:
                    "1px solid #eeeeee",
                  borderBottom:
                    "1px solid #eeeeee",
                }}
              >
                <strong
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Total:
                </strong>

                <strong
                  style={{
                    fontSize: "22px",
                    color: "#ef4b2f",
                  }}
                >
                  ৳{total.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* TERMS */}
            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: "16px",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(
                    e.target.checked
                  )
                }
                style={{
                  marginTop: "2px",
                }}
              />

              <span>
                I have read and agree to the{" "}
                <strong
                  style={{
                    color: "#ef4b2f",
                  }}
                >
                  Terms and Conditions
                </strong>
                ,{" "}
                <strong
                  style={{
                    color: "#ef4b2f",
                  }}
                >
                  Privacy Policy
                </strong>{" "}
                and{" "}
                <strong
                  style={{
                    color: "#ef4b2f",
                  }}
                >
                  Refund and Return Policy
                </strong>
              </span>
            </label>

            {/* ORDER ERROR */}
            {orderError && (
              <p
                style={{
                  color: "#dc2626",
                  background: "#fef2f2",
                  border:
                    "1px solid #fecaca",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "14px",
                  marginBottom: "0",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                {orderError}
              </p>
            )}

            {/* CONFIRM ORDER */}
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isPlacingOrder}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "4px",
                background: isPlacingOrder
                  ? "#9ca3af"
                  : "#3f51b5",
                color: "white",
                padding: "13px",
                marginTop: "16px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: isPlacingOrder
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {isPlacingOrder
                ? "Placing Order..."
                : "Confirm Order"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}


/* ---------- Reusable Input ---------- */

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
}


/* ---------- Summary Row ---------- */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "13px 0",
        fontSize: "14px",
      }}
    >
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}


/* ---------- Styles ---------- */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "8px",
};

if (typeof document !== "undefined") {
  // Placeholder styling is handled by the global style below.
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d5d5d5",
  borderRadius: "4px",
  padding: "11px 13px",
  fontSize: "14px",
  outline: "none",
  background: "white",
  color: "#111827",
};

const radioLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  marginBottom: "12px",
  cursor: "pointer",
};

<style jsx global>{`
  input::placeholder,
  textarea::placeholder {
    color: #9ca3af !important;
    opacity: 1 !important;
  }

  select {
    color: #111827 !important;
  }
`}</style>