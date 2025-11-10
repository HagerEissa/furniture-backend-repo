# Furniro Backend

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Built With](#built-with)
- [Environment Variables](#environment-variables)
- [Test](#test)

---

## Overview

The **Furniro Backend** is a RESTful API built with **Node.js**, **Express**, and **MongoDB**.  
It powers the **Furniro Furniture E-commerce Platform**, handling authentication, payments, orders, reviews, and complete admin control.

---

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |

---

### OAuth Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/auth/google` | Login via Google |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/facebook` | Login via Facebook |
| GET | `/auth/facebook/callback` | Facebook OAuth callback |

---

### Product Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/product` | Get all products |
| GET | `/api/product/:id` | Get single product |
| POST | `/api/product` | Create product *(Admin only)* |
| PUT | `/api/product/:id` | Update product *(Admin only)* |
| DELETE | `/api/product/:id` | Delete product *(Admin only)* |

---

### Review Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/product/:productId/review` | Add review *(User only)* |
| GET | `/api/product/:productId/review` | Get all reviews for a product |
| PUT | `/api/product/:productId/review` | Update review *(User only)* |
| DELETE | `/api/product/:productId/review` | Delete review *(User/Admin)* |

---

### Category Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/category` | Get all categories |
| POST | `/api/category` | Add category *(Admin only)* |
| PUT | `/api/category/:id` | Update category *(Admin only)* |
| DELETE | `/api/category/:id` | Delete category *(Admin only)* |

---

### Contact Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/contact` | Send message *(User only)* |
| GET | `/api/contact` | Get all messages *(Admin only)* |
| DELETE | `/api/contact/:messageId` | Delete message *(Admin only)* |

---

### Cart Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/cart/:userId` | Get user’s cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/:userId/:productId` | Update product quantity |
| DELETE | `/api/cart/:userId/:productId` | Remove product from cart |
| DELETE | `/api/cart/clear/:userId` | Clear entire cart |

---

### Favourite Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/favourite/:userId` | Get user favourites |
| POST | `/api/favourite/add` | Add to favourites |
| DELETE | `/api/favourite/:userId/:productId` | Remove from favourites |
| DELETE | `/api/favourite/clear/:userId` | Clear favourites |

---

### User Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| PUT | `/api/user/profile` | Update user profile & image |
| GET | `/api/user` | Get all users *(Admin only)* |
| PUT | `/api/user/:id/role` | Update role *(Admin only)* |
| DELETE | `/api/user/:id` | Delete user *(Admin only)* |

---

### Payment Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/payment/create-checkout-session` | Create Stripe checkout session |
| POST | `/api/payment` | Stripe webhook listener |

---

### Order Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/order` | Create new order |
| GET | `/api/order` | Get logged-in user's orders |
| GET | `/api/order/all` | Get all orders *(Admin only)* |
| PUT | `/api/order/:id/status` | Update order status *(Admin only)* |

---

## Features

- JWT Authentication & Role-Based Access Control  
- Full CRUD on Products, Categories, Users, and Orders  
- Reviews & Ratings System  
- Wishlist & Cart Functionality  
- Secure Stripe Payment Integration  
- Contact Form Handling  
- Profile Update with Image Upload  
- OAuth Login via Google & Facebook  
- RESTful Architecture with Clean Code Structure  

---

## Built With

- **Node.js** – Server runtime  
- **Express.js** – Web framework  
- **MongoDB** – Database  
- **Mongoose** – ODM  
- **JWT** – Authentication  
- **Bcrypt.js** – Password hashing  
- **Stripe** – Payment Gateway  
- **Cloudinary** – Image Hosting  
- **Multer** – File Upload  
- **Passport.js** – OAuth  
- **Dotenv** – Environment Configuration  

---

## Environment Variables

Create a `.env` file with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

---

## Test

You can test the backend manually using **Postman**
or by running it together with the **frontend**.

**To start the servers:**
- Run the frontend with:  
  ```bash
  ng serve -o
- Run the Backend with:  
  ```bash
  npm run dev
