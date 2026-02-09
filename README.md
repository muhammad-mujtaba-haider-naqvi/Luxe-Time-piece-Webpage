# E-commerce Assignment (Node.js + Express + EJS)

A simple, full-featured web shop built for a Web Development lab. It uses Express for routing, EJS for server-side views, sessions for cart and admin auth, and a lightweight JSON file (`products.json`) for data persistence. Product images are stored in `public/images`, with upload and management via Multer.

## Tech Stack
- Node.js + Express: HTTP server, routing, static assets
- EJS: Server-side templates for pages and partials
- express-session: Session-backed cart and admin login state
- Multer: Image upload handling to `public/images`
- Vanilla JS + CSS: Client-side interactions and styling

## Features
- Browse products with list and detail views
- Image gallery on product page (switch primary image client-side)
- Session-backed cart: add items and remove via AJAX
- Admin login (`admin` / `123`) to manage products
- Add/Edit/Delete products
- Upload multiple images per product
- Set/delete primary and secondary images via AJAX
- Graceful error pages and basic UI

## Project Structure
```
web-final-lab/
├─ app.js                 # Express app configuration
├─ package.json           # Dependencies and npm scripts
├─ products.json          # JSON data store for products
├─ middleware/
│  └─ auth.js             # Admin authorization helper
├─ public/
│  ├─ css/styles.css      # Global styles
│  ├─ images/             # Uploaded and sample images
│  └─ js/
│     ├─ admin.js         # Admin-side AJAX actions
│     ├─ cart.js          # Cart item removal
│     └─ gallery.js       # Product gallery switching
├─ routes/
│  ├─ index.js            # Shop & cart routes
│  └─ admin.js            # Admin routes and uploads
└─ views/                 # EJS views and partials
   ├─ home.ejs
   ├─ product-details.ejs
   ├─ cart.ejs
   ├─ login.ejs
   ├─ add-product.ejs
   ├─ edit-product.ejs
   ├─ error.ejs
   └─ partials/{header.ejs, footer.ejs}
```

## Routes Overview
- Shop
  - `GET /` → Home: list products
  - `GET /product/:id` → Product detail
  - `POST /cart/add` → Add to cart (body: `productId`, `quantity`)
  - `GET /cart` → View cart
  - `DELETE /cart/remove` → Remove item (JSON body: `{ id }`) — AJAX
- Admin
  - `GET /admin/login` → Login page
  - `POST /admin/login` → Login (credentials: `admin` / `123`)
  - `GET /admin/logout` → Logout
  - `GET /admin/add` → Add product form (admin only)
  - `POST /admin/add` → Create product + upload images (field name: `images`)
  - `GET /admin/edit/:id` → Edit product form
  - `POST /admin/edit/:id` → Update product + optional new images
  - `DELETE /admin/product/:id` → Delete product (AJAX)
  - `DELETE /admin/product/:id/image` → Delete product image (AJAX; body `{ filename }`)
  - `PUT /admin/product/:id/primary` → Set primary image (AJAX; body `{ filename }`)

## Data & Uploads
- Products are stored in `products.json` as an array of objects:
  ```json
  { "id": "101", "title": "...", "price": 650, "description": "...", "primaryImage": "images/...", "secondaryImages": ["images/..."] }
  ```
- Image uploads are saved to `public/images/` and referenced with paths like `images/<filename>`.
- Primary image is used on list/detail pages; secondary images are shown in the gallery and can be promoted to primary.

## Prerequisites
- Git
- Node.js (LTS recommended, e.g. v18+ or v20+)

## Getting Started (Clone & Run)
1. Clone the repository
   ```bash
   git clone https://github.com/local-path.git
   cd <your-repo>
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the server
   ```bash
   npm start
   ```
4. Open the app
   - Visit: http://localhost:3000

### Admin Access
- Username: `admin`
- Password: `123`
- After login, admin-only actions (add/edit/delete, image management) become available.

## Configuration Notes
- Port: Defined in `app.js` (`PORT = 3000`). Change as needed.
- Sessions: Update `secret` in `app.js` to a strong, unique value before production.
- Static files: Served from `public/`; ensure `public/images/` is writable for uploads.

## Development Tips
- Products are persisted to `products.json`. If you encounter malformed data, validate JSON format.
- When replacing images, the server tries to delete files from `public/images/` (best-effort).
- EJS views live in `views/`; partials for header/footer are in `views/partials/`.

## Scripts
- `npm start` — Runs the server (`node app.js`).

## License
Educational project — adapt freely to your needs.
