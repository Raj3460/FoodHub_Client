Here's a professional `README.md` file for your FoodHub project. You can customize the links and credentials as needed.

---

```markdown
# 🍱 FoodHub – Food Ordering Platform

FoodHub is a full‑stack food ordering web application where customers can browse meals from various restaurants, place orders, track delivery status, and leave reviews. Restaurant providers can manage their menus and fulfill orders, while admins oversee the entire platform.

🔗 **Live Frontend:** [https://food-hub-client-nu.vercel.app](https://food-hub-client-nu.vercel.app)  
🔗 **Live Backend API:** [https://foodhub-server-ld0k.onrender.com](https://foodhub-server-ld0k.onrender.com)

---

## 📌 Features

### 👤 Customer
- Register / Login (email/password or Google OAuth)
- Browse meals with search, filters (category, price, rating) and sorting
- Add/remove items from cart, adjust quantities
- Place orders (Cash on Delivery) with delivery address
- View order history and track order status
- Leave reviews for delivered orders
- Manage profile (name, email, phone)

### 🏪 Provider (Restaurant)
- Register as provider, create and update restaurant profile
- Add, edit, delete menu items (meals)
- View incoming orders and update order status (placed → preparing → ready → delivered)

### 👑 Admin
- View all users, providers, orders
- Approve/reject provider registrations
- Manage food categories (create, edit, delete)
- Dashboard with statistics (total users, providers, orders, revenue)

### 🧩 General
- Fully responsive UI (mobile, tablet, desktop)
- Dark / light theme toggle
- Role‑based access control (RBAC)
- Input validation, loading skeletons, toast notifications

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router, Server & Client Components)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components
- **Zustand** (state management for cart)
- **BetterAuth** (authentication client)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (hosted on Neon)
- **BetterAuth** (authentication server)

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (PostgreSQL)

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL (local or remote)

### 1. Clone repositories
```bash
# Frontend
git clone https://github.com/your-username/foodhub-client.git
cd foodhub-client

# Backend
git clone https://github.com/your-username/foodhub-server.git
cd foodhub-server
```

### 2. Install dependencies
```bash
# Frontend
npm install

# Backend
npm install
```

### 3. Environment variables

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Backend (`.env`):**
```env
PORT=5000
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
APP_USER="email@gmail.com"
APP_PASS="app-password"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database migration & seed
```bash
# Backend
npx prisma generate
npx prisma db push
npx prisma db seed   # if you have a seed script
```

### 5. Run development servers
```bash
# Backend
npm run dev

# Frontend (in another terminal)
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## 🌍 Production Deployment

The project is deployed on **Vercel** (frontend) and **Render** (backend) with **Neon** as the database.

**Important environment variables (Vercel):**
- `NEXT_PUBLIC_API_URL=https://foodhub-server-ld0k.onrender.com/api/auth`
- `NEXT_PUBLIC_BASE_URL=https://food-hub-client-nu.vercel.app`

**Render:**
- `DATABASE_URL` (Neon pooled connection)
- `DIRECT_URL` (Neon direct connection)
- `NEXT_PUBLIC_BASE_URL=https://food-hub-client-nu.vercel.app`
- `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.

---

## 👥 Admin Credentials (for testing / review)

Use the following admin account to access the admin dashboard:

| Field        | Value                         |
|--------------|-------------------------------|
| **Email**    | `admin@foodhub.com`           |
| **Password** | `Admin@123` (or your seeded password) |

*These credentials are pre‑seeded in the production database.*

---

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)

### Meals Listing with filters
![Meals](./screenshots/meals.png)

### Cart & Checkout
![Cart](./screenshots/cart.png)

### Admin Dashboard
![Admin](./screenshots/admin.png)

*Add actual screenshots to the `/screenshots` folder.*

---

## 🎥 Demo Video

Watch the full walkthrough of FoodHub:  
[📺 Demo Video](https://drive.google.com/file/d/your-video-id/view)  
(Replace with your video link – Google Drive / Loom)

---

## 📄 License

This project is created for educational/assignment purposes.  
All rights reserved.

---

## ✨ Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [BetterAuth](https://better-auth.com) for authentication
- [Neon](https://neon.tech) for free PostgreSQL hosting
- [Vercel](https://vercel.com) & [Render](https://render.com) for effortless deployment

---

## 👨‍💻 Author

Raj Kumar Sarkar  
[GitHub](https://github.com/Raj3460)  
[LinkedIn](https://linkedin.com/in/your-profile)
```

---

Replace the placeholder links (Live URLs, GitHub repos, video link, screenshots) with your actual ones. Add your own screenshots to a `screenshots` folder.  
This README is detailed, professional, and covers all mandatory sections for your assignment submission.