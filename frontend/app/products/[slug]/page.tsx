import Link from "next/link";
import { getProductImageUrl } from "@/lib/media";
import ProductActions from "./ProductActions";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  category?: Category;
  is_active: boolean;
}

async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(
    `http://127.0.0.1:8000/api/products/${slug}/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

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
        {/* Back Button */}
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "25px",
            color: "#4f46e5",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Products
        </Link>

        {/* Product Details Card */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* Product Image */}
          <div
            style={{
              minHeight: "500px",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            {product.image ? (
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "18px",
                }}
              >
                No image available
              </p>
            )}
          </div>

          {/* Product Information */}
          <div
            style={{
              padding: "45px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Category */}
            {product.category && (
              <div
                style={{
                  display: "inline-block",
                  alignSelf: "flex-start",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "7px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "18px",
                }}
              >
                {product.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "18px",
              }}
            >
              {product.name}
            </h1>

            {/* Description */}
            <p
              style={{
                color: "#6b7280",
                fontSize: "17px",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              {product.description}
            </p>

            {/* Price */}
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "18px",
              }}
            >
              ৳{product.price}
            </h2>

            {/* Stock */}
            <p
              style={{
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              Stock: <strong>{product.stock}</strong>
            </p>

            {/* Availability */}
            <p
              style={{
                color: product.is_active ? "green" : "red",
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "25px",
              }}
            >
              {product.is_active
                ? "✓ Available"
                : "✕ Unavailable"}
            </p>

            {/* Quantity + Add To Cart */}
            <ProductActions
  productId={product.id}
  productName={product.name}
  price={product.price}
  stock={product.stock}
  isActive={product.is_active}
  image={product.image}
  slug={product.slug}
/>
          </div>
        </div>
      </div>
    </main>
  );
}