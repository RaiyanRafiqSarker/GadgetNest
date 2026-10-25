"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.non_field_errors?.[0] ||
          data.detail ||
          "Invalid email or password.";

        setError(message);
        return;
      }

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Save JWT tokens
      localStorage.setItem(
        "accessToken",
        data.access
      );

      localStorage.setItem(
        "refreshToken",
        data.refresh
      );

      setSuccess("Login successful.");

      setTimeout(() => {
        const normalizedEmail = (data.user?.email || "").toLowerCase();
        const isShopUser = normalizedEmail === "shop@gadgetnest.com";

        const redirectTarget =
          typeof window !== "undefined"
            ? localStorage.getItem("redirectAfterLogin") ||
              new URLSearchParams(window.location.search).get("next") ||
              (isShopUser ? "/shop" : "/")
            : "/";

        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectTarget;
      }, 1000);
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 73px)",
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
          maxWidth: "555px",
          background: "white",
          borderRadius: "16px",
          padding: "36px 55px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  fontWeight: "800",
                }}
              >
                G
              </div>

              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#4f46e5",
                  letterSpacing: "-1px",
                }}
              >
                GadgetNest
              </span>
            </div>
          </Link>
        </div>

        {/* Welcome Text */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "400",
            color: "#111827",
            margin: "8px 0 34px",
          }}
        >
          Welcome To SHOP
        </h1>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f3b5b",
                marginBottom: "9px",
              }}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "9px",
                outline: "none",
                fontSize: "14px",
                color: "#111827",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div
            style={{
              marginBottom: "34px",
            }}
          >
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f3b5b",
                marginBottom: "9px",
              }}
            >
              Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="**********"
                required
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 48px 0 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#111827",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#cbd5e1",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "11px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "18px",
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "11px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "18px",
              }}
            >
              {success}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              border: "none",
              borderRadius: "10px",
              background: "#1f2937",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow:
                "0 5px 14px rgba(31,41,55,0.18)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p
          style={{
            textAlign: "center",
            color: "#1f3b5b",
            fontSize: "14px",
            margin: "27px 0",
          }}
        >
          Don&apos;t have account?{" "}
          <Link
            href="/register"
            style={{
              color: "#1f3b5b",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Register
          </Link>
        </p>

        {/* Forgot Password */}
        <div
          style={{
            background: "#f3f4f8",
            borderRadius: "5px",
            padding: "20px 10px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#1f3b5b",
              fontSize: "14px",
            }}
          >
            Forgot your password?{" "}
          </span>

          <Link
            href="/forgot-password"
            style={{
              color: "#1f3b5b",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Reset It
          </Link>
        </div>
      </div>
    </main>
  );
}