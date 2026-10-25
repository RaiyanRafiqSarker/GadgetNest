"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/me/",
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
          setError(
            "Unable to load your profile."
          );
          return;
        }

        const userData = await response.json();

        setUser(userData);

        setFirstName(
          userData.first_name || ""
        );

        setLastName(
          userData.last_name || ""
        );

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      } catch {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    const accessToken =
      localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/me/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }),
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
        setError(
          data.error ||
            "Unable to update your profile."
        );
        return;
      }

      setUser(data.user);

      setFirstName(
        data.user.first_name || ""
      );

      setLastName(
        data.user.last_name || ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------
     Loading
  -------------------------------- */

  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "calc(100vh - 73px)",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          Loading your profile...
        </p>
      </main>
    );
  }

  /* --------------------------------
     Error
  -------------------------------- */

  if (error && !user) {
    return (
      <main
        style={{
          minHeight:
            "calc(100vh - 73px)",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            border: "1px solid #f0f0f0",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              color: "#dc2626",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>

          <Link
            href="/"
            style={{
              color: "#4f46e5",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "calc(100vh - 73px)",
        background: "#f8fafc",
        padding: "50px 20px",
        color: "#111827",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* Page Heading */}

        <h1
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          My Profile
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Manage your account information.
        </p>

        {/* Profile Card */}

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* User Header */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "30px",
              paddingBottom: "25px",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              {user?.username
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 5px",
                  fontSize: "22px",
                  color: "#111827",
                }}
              >
                {user?.username}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                GadgetNest Customer
              </p>
            </div>
          </div>

          {/* Username */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <p
              style={{
                margin: "0 0 7px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              USERNAME
            </p>

            <input
              type="text"
              value={user?.username || ""}
              disabled
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#f3f4f6",
                color: "#6b7280",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Email */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <p
              style={{
                margin: "0 0 7px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              EMAIL
            </p>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#f3f4f6",
                color: "#6b7280",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* First Name */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <p
              style={{
                margin: "0 0 7px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              FIRST NAME
            </p>

            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              placeholder="Enter your first name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#111827",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Last Name */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <p
              style={{
                margin: "0 0 7px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              LAST NAME
            </p>

            <input
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              placeholder="Enter your last name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#111827",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Error Message */}

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                border:
                  "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Success Message */}

          {success && (
            <div
              style={{
                background: "#f0fdf4",
                color: "#15803d",
                border:
                  "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          {/* Save Button */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px 20px",
              border: "none",
              borderRadius: "9px",
              background: saving
                ? "#9ca3af"
                : "#111827",
              color: "white",
              fontSize: "15px",
              fontWeight: "700",
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}