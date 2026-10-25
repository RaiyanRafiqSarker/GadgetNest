"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStrongPassword = (value: string) => {
    if (value.length <= 8) {
      return false;
    }

    if (!/[A-Z]/.test(value)) {
      return false;
    }

    if (!/[a-z]/.test(value)) {
      return false;
    }

    if (!/\d/.test(value)) {
      return false;
    }

    return true;
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be longer than 8 characters and contain uppercase, lowercase, and a number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            phone_number: phoneNumber,
            password,
            retype_password: retypePassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.retype_password) {
          setError(data.retype_password[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.phone_number) {
          setError(data.phone_number[0]);
        } else {
          setError("Unable to create account.");
        }

        return;
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setUsername("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setRetypePassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
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
          maxWidth: "565px",
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

        {/* Welcome */}
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

        <form onSubmit={handleRegister}>
          {/* Username */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f3b5b",
                marginBottom: "9px",
              }}
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Ralph Awards"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                border: "1px solid #d7dee8",
                borderRadius: "9px",
                outline: "none",
                fontSize: "14px",
                color: "#111827",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div
            style={{
              marginBottom: "18px",
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
              placeholder="example@mail.com"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                border: "1px solid #d7dee8",
                borderRadius: "9px",
                outline: "none",
                fontSize: "14px",
                color: "#111827",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Phone Number */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              htmlFor="phone"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f3b5b",
                marginBottom: "9px",
              }}
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
              placeholder="+880123456789"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                border: "1px solid #d7dee8",
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
              marginBottom: "18px",
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
                  border: "1px solid #d7dee8",
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

          {/* Retype Password */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              htmlFor="retype-password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f3b5b",
                marginBottom: "9px",
              }}
            >
              Retype Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                id="retype-password"
                type={
                  showRetypePassword ? "text" : "password"
                }
                value={retypePassword}
                onChange={(event) =>
                  setRetypePassword(event.target.value)
                }
                placeholder="**********"
                required
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 48px 0 14px",
                  border: "1px solid #d7dee8",
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
                  setShowRetypePassword(
                    !showRetypePassword
                  )
                }
                aria-label={
                  showRetypePassword
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
                {showRetypePassword ? "◉" : "◌"}
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

          {/* Create Account */}
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
            {loading
              ? "Creating Account..."
              : "Create An Account"}
          </button>
        </form>

        {/* Login Link */}
        <p
          style={{
            textAlign: "center",
            color: "#1f3b5b",
            fontSize: "14px",
            margin: "27px 0 4px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#1f3b5b",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}