# ShopCraft

A modern, scalable e-commerce platform built with Node.js, TypeScript, React, and Prisma.

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite (development)
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

The API will be available at `http://localhost:5000`
The frontend will be available at `http://localhost:5173`

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/user/:userId` - Get orders for a user

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

