# Agri Market Hub - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "farmer",
  "phone": "9876543210",
  "city": "Punjab",
  "state": "Punjab"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "rajesh@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 4. Get User Profile
**GET** `/auth/profile`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "phone": "9876543210",
    "address": "123 Farm Lane",
    "city": "Punjab",
    "state": "Punjab",
    "pin_code": "141001",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Update User Profile
**PUT** `/auth/profile`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "address": "123 Farm Lane",
  "city": "Punjab",
  "state": "Punjab",
  "pin_code": "141001"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

**Query Parameters:**
- `search` - Search by product name or description
- `category` - Filter by category (vegetables, fruits, grains, etc.)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example:**
```
GET /products?category=vegetables&search=tomato&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Fresh Tomatoes",
        "description": "Juicy red tomatoes",
        "category": "vegetables",
        "price": 45.00,
        "quantity": 100,
        "image_url": "https://...",
        "farmer_id": 1,
        "farmer_name": "Rajesh Kumar",
        "farmer_phone": "9876543210",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### 2. Get Product by ID
**GET** `/products/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "description": "Juicy red tomatoes",
    "category": "vegetables",
    "price": 45.00,
    "quantity": 100,
    "image_url": "https://...",
    "farmer_id": 1,
    "farmer_name": "Rajesh Kumar",
    "farmer_email": "rajesh@farmer.com",
    "farmer_phone": "9876543210",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Create Product (Farmer Only)
**POST** `/products`

**Headers:** Requires authentication + Farmer role

**Request Body:**
```json
{
  "name": "Fresh Tomatoes",
  "description": "Juicy red tomatoes from organic farms",
  "category": "vegetables",
  "price": 45.00,
  "quantity": 100,
  "image_url": "https://example.com/tomato.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "description": "Juicy red tomatoes from organic farms",
    "category": "vegetables",
    "price": 45.00,
    "quantity": 100,
    "image_url": "https://example.com/tomato.jpg",
    "farmer_id": 1
  }
}
```

### 4. Update Product (Farmer Only)
**PUT** `/products/:id`

**Headers:** Requires authentication + Farmer role

**Request Body:**
```json
{
  "name": "Fresh Tomatoes",
  "description": "Updated description",
  "category": "vegetables",
  "price": 50.00,
  "quantity": 150,
  "image_url": "https://example.com/tomato.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### 5. Delete Product (Farmer Only)
**DELETE** `/products/:id`

**Headers:** Requires authentication + Farmer role

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 6. Get Farmer's Products
**GET** `/products/farmer/my-products`

**Headers:** Requires authentication + Farmer role

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [ ... ],
    "pagination": { ... }
  }
}
```

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`

**Headers:** Requires authentication + Buyer role

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 5,
        "name": "Fresh Tomatoes",
        "price": 45.00,
        "image_url": "https://...",
        "farmer_name": "Rajesh Kumar"
      }
    ],
    "total": 225.00,
    "itemCount": 1
  }
}
```

### 2. Add to Cart
**POST** `/cart/add`

**Headers:** Requires authentication + Buyer role

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 5,
    "name": "Fresh Tomatoes",
    "price": 45.00,
    "image_url": "https://..."
  }
}
```

### 3. Update Cart Quantity
**PUT** `/cart/:cart_id`

**Headers:** Requires authentication + Buyer role

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": { ... }
}
```

### 4. Remove from Cart
**DELETE** `/cart/:cart_id`

**Headers:** Requires authentication + Buyer role

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### 5. Clear Cart
**DELETE** `/cart`

**Headers:** Requires authentication + Buyer role

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## Order Endpoints

### 1. Create Order (Buyer Only)
**POST** `/orders`

**Headers:** Requires authentication + Buyer role

**Request Body:**
```json
{
  "shipping_address": "123 Main Street, City, State, 123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": 1,
    "total": 225.00,
    "itemCount": 1,
    "orderStatus": "pending"
  }
}
```

### 2. Get User Orders (Buyer Only)
**GET** `/orders`

**Headers:** Requires authentication + Buyer role

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "total_amount": 225.00,
        "order_status": "pending",
        "shipping_address": "123 Main Street...",
        "order_date": "2024-01-15T10:30:00Z",
        "delivered_date": null
      }
    ],
    "pagination": { ... }
  }
}
```

### 3. Get Order Details (Buyer Only)
**GET** `/orders/:orderId`

**Headers:** Requires authentication + Buyer role

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "total_amount": 225.00,
      "order_status": "pending",
      "shipping_address": "123 Main Street...",
      "order_date": "2024-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 5,
          "price": 45.00,
          "name": "Fresh Tomatoes",
          "image_url": "https://...",
          "category": "vegetables"
        }
      ]
    }
  }
}
```

### 4. Cancel Order (Buyer Only)
**PUT** `/orders/:orderId/cancel`

**Headers:** Requires authentication + Buyer role

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### 5. Get Farmer's Orders
**GET** `/orders/farmer/orders/list`

**Headers:** Requires authentication + Farmer role

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "buyer_id": 2,
        "total_amount": 225.00,
        "order_status": "pending",
        "order_date": "2024-01-15T10:30:00Z",
        "buyer_name": "Amit Patel",
        "buyer_email": "amit@buyer.com",
        "buyer_phone": "9123456789"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only farmers can create products"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes Summary
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting
No rate limiting is currently implemented. Production deployment should include rate limiting.

---

## Pagination
All list endpoints support pagination with default values:
- Default page: 1
- Default limit: 10
- Maximum limit: 100

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Prices are in Indian Rupees (₹)
- Password must be at least 6 characters
- JWT tokens expire in 7 days
- Refresh tokens expire in 30 days
