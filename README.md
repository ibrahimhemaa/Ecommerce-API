# Ecommerce System

A backend API for an online store, built with Node.js and Express. It handles the usual store stuff: categories, brands, products, reviews, users and auth. I've also added a shopping cart, orders, wishlist, discount coupons and Stripe payments so it can actually take money. There's a Swagger page too, so you can poke at every endpoint without leaving the browser.

## What's inside

- **Categories** and **sub-categories** (nested under a category)
- **Brands**
- **Products** with multiple images and Q&A-style reviews
- **Users** with realistic roles (`user` / `admin`)
- **Auth** — sign up, log in, and a "forgot password" flow that emails a reset code
- **Cart** — add / update / remove items, apply a coupon, clear it
- **Orders** — cash on delivery, or via card
- **Wishlist**
- **Coupons** — admin can create discounts and set when they expire
- **Stripe payments** — checkout session + webhook to confirm the payment
- **Swagger docs** at `/api/docs`

## Tech stack

- Node.js + Express 5
- MongoDB with Mongoose
- JSON Web Tokens for auth
- Multer + Sharp for image uploads and resizing
- Nodemailer for sending the password reset emails
- express-validator for request validation
- Stripe SDK for payments

## Before you run it

You'll need Node.js installed, plus a MongoDB database (either running locally on your machine or a free Atlas cluster).

Create a `config.env` file in the project root. It's already in `.gitignore`, so it won't get committed. Fill it in with your own values:

```env
PORT=5000
uriDB=mongodb://127.0.0.1:27017/ecommerce
BASE_URL=http://localhost:5000
JWT_SECRET_KEY=some-long-random-string
JET_EXPIRED_TIME=1d

# only needed if you use the forgot-password email flow
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
SMTP_EMAIL=you@gmail.com

# only needed for card payments
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
```

`JWT_SECRET_KEY` matters — don't leave an obvious value in there. And don't put a real email password in `SMTP_PASS`; use an app password from your provider.

## Running it

```bash
npm install
npm run start:dev      # dev mode, restarts on changes
npm run start:prod     # production mode
```

Once it's up:
- API lives at `http://localhost:5000`
- Swagger docs at `http://localhost:5000/api/docs`

## The API, in one place

Everything is prefixed with `/api`.

| Area | Route | Notes |
|---|---|---|
| Auth | `POST /api/auth/signup`, `POST /api/auth/login` | also forgot/verify/reset password |
| Categories | `/api/categories` | admin can create/update/delete |
| Sub-categories | `/api/categories/:categoryID/subcategories` or `/api/subcategories` | |
| Brands | `/api/brands` | |
| Products | `/api/products` | product reviews nested under `/api/products/:productId/reviews` |
| Reviews | `/api/reviews` | |
| Users | `/api/users` | plus `/getMe`, `/updateUserData`, `/updateUserPassword`, `/deleteUser` |
| Cart | `/api/cart` | user only |
| Coupons | `/api/coupons` | admin only |
| Orders | `/api/orders` | |
| Wishlist | `/api/wishlist` | user only |
| Payments | `/api/payments` | checkout session + webhook |

Most endpoints that change data (and a few that read) need a logged-in user. You send the token like this:

```
Authorization: Bearer <your-token>
```

### A quick auth example

```bash
# sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"someones","email":"me@example.com","password":"secret123"}'

# log in to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"secret123"}'
```

Grab the token from the login response and stick it in the header for the rest.

## Roles

- **user** — can shop, manage their own cart/wishlist/orders, review products
- **admin** — manages categories, brands, products, users, coupons, and can mark orders as paid / delivered

### Making yourself an admin

There's no seed script, so a fresh signup always gets the `user` role. To get an admin account, register normally, then flip the role in the database:

```javascript
// in mongosh
use ecommerce
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Or, if you're using MongoDB Compass, open the `users` collection, find your user, and change `role` to `admin`.

## Testing it by hand

No Stripe, no credit card needed — the cash-on-delivery path covers most of the flow.

1. Start the server: `npm run start:dev`
2. `POST /api/auth/signup` — create a user (and make them admin as above if you want write access).
3. `POST /api/auth/login` — copy the `token` from the response.
4. Add the header `Authorization: Bearer <token>` on every request after that.
5. As admin, create a category, brand, and product (`POST /api/categories`, `/api/brands`, `/api/products`).
6. As a user: `POST /api/cart` with a product id, then `POST /api/orders` to place a **cash** order. That's the full happy path without ever touching a payment gateway.

## Handy notes

- Image uploads (products, categories, users, brands) are handled with Multer and resized with Sharp.
- Products track `sold` and `quantity`, and both are updated automatically when an order goes through.
- Users are soft-deleted (marked inactive) rather than removed from the database.
- The Stripe webhook needs you to point Stripe at `/api/payments/webhook` with your webhook signing secret in `config.env`.

