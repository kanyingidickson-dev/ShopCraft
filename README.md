# ShopCraft

A modern, scalable e-commerce platform built with Node.js, TypeScript, React, and Prisma.

🛒 ShopCraft – E-commerce Web App  
🔗 [Live Demo](https://kanyingidickson-dev.github.io/ShopCraft/)

## Demo Mode (Frontend-only)

This project supports a frontend-only demo mode powered by Mock Service Worker (MSW).
When no `VITE_API_URL` is provided, the frontend intercepts requests to `/api/v1/*` in the browser
and serves seeded mock data.

This allows the UI to run and be deployed as a static site (e.g. GitHub Pages) with zero backend,
database, or environment variables.

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with PostgreSQL
- RESTful API architecture

### Frontend
- React with TypeScript
- Vite
- TailwindCSS

## Project Structure

```
shopcraft/
├── server/           # Backend API
│   ├── src/
│   │   ├── config/   # Database and configuration
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/       # Database schema and migrations
└── client/           # Frontend application
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone git@github.com:kanyingidickson-dev/ShopCraft.git
cd shopcraft
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up the database
```bash
cd ../server
npx prisma migrate dev
npx prisma generate
```

### Running Locally

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

### Running the frontend-only demo

Run the frontend without `VITE_API_URL` set. The app will start MSW automatically and mock the
API in the browser.

The API will be available at `http://localhost:5000`
The frontend will be available at `http://localhost:5173`

### GitHub Pages (static)

The frontend is configured to work under the repository subpath.
Ensure `client/public/mockServiceWorker.js` is committed (required for MSW in production demos).

## API Endpoints

### Products
- `GET /api/v1/products` - List products (supports pagination/search)
- `POST /api/v1/products` - Create a new product (admin)
- `GET /api/v1/products/:id` - Get product by ID

### Categories
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create a new category (admin)

### Orders
- `POST /api/v1/orders` - Create a new order (authenticated)
- `GET /api/v1/orders/me` - Get orders for the authenticated user
- `GET /api/v1/orders` - List orders (admin, paginated)

### OpenAPI
- `GET /api/v1/openapi.json` - OpenAPI specification (stub)

### Health Check
- `GET /health` - API health status

## Architecture

The backend follows a layered architecture:
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints
- **Models**: Database schema definitions (Prisma)
- **Services**: Business logic layer
- **Middleware**: Request processing and validation

## Database Schema

Core entities:
- **User**: Customer and admin accounts
- **Product**: Product catalog with pricing and inventory
- **Category**: Product categorization
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders

## Development

Build the server:
```bash
cd server
npm run build
```

Run in production mode:
```bash
npm start
```

