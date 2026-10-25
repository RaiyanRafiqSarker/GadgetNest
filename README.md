# GadgetNest 🛍️⚡

GadgetNest is a modern, full-stack e-commerce web platform designed for tech enthusiasts, offering gadgets, electronics, accessories, and computer peripherals. Built with a **Next.js 16 (React 19)** frontend and a **Django 6 REST Framework** backend.

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Dynamic Catalog & Shop**: Browse gadgets by category and brand with real-time filtering, price range, and search.
- **Product Details & Gallery**: Multi-image product gallery, stock indicators, view counters, and automated discount pricing.
- **Cart & Checkout**: Persistent cart management, delivery method selection (Home Delivery, Store Pickup, Express), and Cash on Delivery (COD) checkout.
- **Wishlist / Favorites**: Save favourite gadgets for later.
- **Customer Account & Orders**: Track order history, order statuses (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled), and manage personal profile details.

### 🔐 Authentication & Security
- **JWT Authentication**: Secure user registration, login, and session persistence using `djangorestframework-simplejwt`.
- **Protected Endpoints**: User-isolated order queries and profile endpoints.

### ⚙️ Admin & Management
- **Django Admin Panel**: Manage products, multiple product images, brands, categories, discounts, and order statuses.
- **CORS Configured**: Seamless local and production API integration between Next.js and Django.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), TypeScript |
| **Backend Framework** | [Django 6.1](https://www.djangoproject.com/) |
| **API Architecture** | [Django REST Framework (DRF)](https://www.django-rest-framework.org/) |
| **Authentication** | JSON Web Tokens (`djangorestframework_simplejwt`) |
| **Image Processing** | Pillow |
| **Database** | SQLite (Default for development) |

---

## 📂 Project Structure

```text
GadgetNest/
├── backend/
│   ├── accounts/          # User authentication, profiles, serializers, & views
│   ├── config/            # Django project settings, ASGI/WSGI, root URLs
│   ├── media/products/    # Product images & media storage
│   ├── products/          # Products, brands, categories, orders, order items
│   ├── manage.py          # Django CLI
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── account/       # User profile page
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Checkout & shipping details page
│   │   ├── favorites/     # Saved items / Wishlist
│   │   ├── orders/        # Order history page
│   │   ├── products/      # Product list & [slug] product detail page
│   │   ├── shop/          # Filterable shop catalog
│   │   ├── login/         # User login page
│   │   └── register/      # User registration page
│   ├── components/        # Reusable UI components (Navbar, Footer, ProductCard)
│   ├── lib/               # Utility functions (media URL resolver, storage helpers)
│   ├── package.json       # Node dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
├── .gitignore             # Root git ignore rules
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup (Django REST Framework)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (for Django admin access)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the Django development server**:
   ```bash
   python manage.py runserver
   ```
   Backend will be running at: `http://127.0.0.1:8000/`  
   Admin dashboard at: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend Setup (Next.js)

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```
   Frontend will be running at: `http://localhost:3000/`

---

## 📡 API Overview

### Authentication (`/api/accounts/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/accounts/register/` | Register a new user account |
| `POST` | `/api/accounts/login/` | Log in and receive JWT access & refresh tokens |
| `GET` | `/api/accounts/me/` | Retrieve authenticated user profile |

### Products & Catalog (`/api/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products/` | List products (supports filtering & search) |
| `GET` | `/api/products/<slug>/` | Get detailed product information |
| `GET` | `/api/categories/` | List all active product categories |
| `GET` | `/api/brands/` | List all active product brands |

### Orders (`/api/orders/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders/` | Place a new customer order |
| `GET` | `/api/orders/<id>/` | Get order details by ID |
| `GET` | `/api/orders/shop/` | List all orders for the store |
| `POST` | `/api/orders/<id>/confirm/` | Confirm an order status |
| `POST` | `/api/orders/<id>/cancel/` | Cancel an order |

---

## 🤝 Contribution & License

This project is developed for educational and internship demonstration purposes. Feel free to fork and customize!
