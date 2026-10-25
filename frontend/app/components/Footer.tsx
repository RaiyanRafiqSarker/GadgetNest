import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111827",
        color: "white",
        marginTop: "60px",
        borderTop:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "50px 20px 30px",
        }}
      >
        {/* Main Footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1.5fr",
            gap: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "19px",
                  fontWeight: "800",
                }}
              >
                G
              </div>

              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                }}
              >
                Gadget
                <span
                  style={{
                    color: "#818cf8",
                  }}
                >
                  Nest
                </span>
              </span>
            </Link>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                lineHeight: "1.7",
                maxWidth: "380px",
                margin: 0,
              }}
            >
              Your trusted destination for
              quality gadgets, electronics, and
              smart technology products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                marginBottom: "18px",
              }}
            >
              Quick Links
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "11px",
              }}
            >
              <Link
                href="/"
                style={footerLinkStyle}
              >
                Home
              </Link>

              <Link
                href="/"
                style={footerLinkStyle}
              >
                Products
              </Link>

              <Link
                href="/cart"
                style={footerLinkStyle}
              >
                Shopping Cart
              </Link>

              <Link
                href="/account"
                style={footerLinkStyle}
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                marginBottom: "18px",
              }}
            >
              Customer Service
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "11px",
              }}
            >
              <Link
                href="/"
                style={footerLinkStyle}
              >
                Contact Us
              </Link>

              <Link
                href="/"
                style={footerLinkStyle}
              >
                Delivery Information
              </Link>

              <Link
                href="/"
                style={footerLinkStyle}
              >
                Return & Refund
              </Link>

              <Link
                href="/"
                style={footerLinkStyle}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                marginBottom: "18px",
              }}
            >
              Contact Us
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "#9ca3af",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              <p
                style={{
                  margin: 0,
                }}
              >
                📍 Dhaka, Bangladesh
              </p>

              <p
                style={{
                  margin: 0,
                }}
              >
                📞 +880 1XXX-XXXXXX
              </p>

              <p
                style={{
                  margin: 0,
                }}
              >
                ✉️ support@gadgetnest.com
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "rgba(255,255,255,0.1)",
            margin:
              "40px 0 22px",
          }}
        />

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            © {new Date().getFullYear()}{" "}
            GadgetNest. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              gap: "18px",
            }}
          >
            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Secure Shopping
            </span>

            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


/* --------------------------------
   Footer Link Style
-------------------------------- */

const footerLinkStyle: React.CSSProperties = {
  color: "#9ca3af",
  textDecoration: "none",
  fontSize: "14px",
};