# Future Storefront Features & Pages

The current storefront already includes the core shopping experience:

- ✅ Homepage
- ✅ Shop (Product Listing Page)
- ✅ Product Details Page
- ✅ Contact Page
- ✅ Cart
- ✅ Checkout
- ✅ Guest Checkout
- ✅ Customer Accounts
- ✅ Stripe & Cash on Delivery
- ✅ Regional Routing
- ✅ Promotional Pricing & Discounts

---

# Phase 1 — Essential Features

These should be prioritized after the core shopping flow.

## 1. Authentication

### Pages

```
/login
/register
/forgot-password
/reset-password
/verify-email
/logout
```

### Features

- Login
- Register
- Forgot Password
- Reset Password
- Email Verification (if applicable)
- Logout

---

## 2. Customer Dashboard

```
/account
```

Dashboard Cards

- Total Orders
- Pending Orders
- Completed Orders
- Saved Addresses
- Wishlist Count
- Recent Orders

---

## 3. Customer Profile

```
/account/profile
```

Features

- Edit Name
- Edit Phone Number
- Edit Email
- Upload Avatar (Optional)
- Delete Account (Optional)

---

## 4. Security

```
/account/security
```

Features

- Change Password
- Update Credentials
- Security Settings

---

## 5. Address Management

```
/account/addresses
```

Features

- View Addresses
- Add Address
- Edit Address
- Delete Address
- Set Default Shipping Address
- Set Default Billing Address

---

## 6. Order History

```
/account/orders
```

Display

- Order ID
- Order Date
- Order Status
- Payment Status
- Order Total

---

## 7. Order Details

```
/account/orders/[orderId]
```

Display

- Ordered Products
- Quantity
- Price Breakdown
- Shipping Address
- Billing Address
- Payment Method
- Shipping Method
- Tracking Number
- Order Timeline
- Invoice

---

## 8. Wishlist

```
/wishlist
```

Features

- Add Product
- Remove Product
- Move to Cart
- Clear Wishlist

---

## 9. Search

```
/search
```

Features

- Product Search
- Live Search Suggestions
- Search History
- Recent Searches
- Empty Search State

---

## 10. Legal Pages

```
/about
/privacy-policy
/terms-and-conditions
/shipping-policy
/return-policy
/refund-policy
/cookie-policy
```

---

# Phase 2 — High Value Features

## 11. Category Pages

Examples

```
/category/football
/category/shoes
/category/accessories
```

---

## 12. Brand Pages

Examples

```
/brand/nike
/brand/adidas
```

---

## 13. Collections

Examples

```
/collections/new-arrivals
/collections/summer-sale
/collections/best-sellers
```

---

## 14. Product Reviews

Features

- Product Rating
- Customer Reviews
- Review Images
- Write Review
- Edit Review
- Delete Review
- Helpful Votes

---

## 15. Notifications

```
/notifications
```

Examples

- Order Confirmed
- Order Shipped
- Payment Successful
- Refund Processed
- Promotional Offers

---

## 16. Coupons

Features

- Apply Coupon
- Remove Coupon
- Coupon Validation
- Discount Summary

---

## 17. Recently Viewed Products

Features

- Recently Viewed List
- Continue Shopping

---

## 18. Order Tracking

```
/track-order
```

Support

- Guest Order Tracking
- Registered User Tracking
- Tracking Number Lookup

---

# Phase 3 — Nice to Have

## 19. Compare Products

```
/compare
```

Features

- Compare Specifications
- Compare Pricing
- Compare Variants

---

## 20. Product Recommendations

Examples

- Related Products
- Similar Products
- Frequently Bought Together
- Recommended For You

---

## 21. Returns & Refunds

```
/returns
```

or

```
/account/returns
```

Features

- Request Return
- Return Status
- Refund Status

---

## 22. Help Center

Pages

```
/help
/faq
/support
```

Features

- Frequently Asked Questions
- Customer Support
- Contact Support

---

## 23. Stock Alerts

Features

- Notify When Back In Stock
- Email Notification

---

## 24. Guest Order Lookup

```
/guest-order
```

Search by

- Order Number
- Email Address

---

## 25. Size Guide

Useful for apparel and sportswear.

---

## 26. Social Login

Examples

- Google
- Apple
- Facebook

---

# User Experience Improvements

## Shopping Experience

- Recently Viewed Products
- Save Cart
- Guest Cart Persistence
- Login Persistence
- Breadcrumb Navigation
- Product Sharing
- Copy Product Link
- Infinite Scroll or Pagination
- Skeleton Loading States

---

## Mobile Experience

- Sticky Add to Cart Button
- Bottom Navigation
- Swipeable Product Gallery
- Pull to Refresh (Optional)

---

## Checkout Improvements

- Shipping Method Selection
- Billing Same as Shipping Toggle
- Gift Notes
- Order Notes
- Promo Code Support
- Tax Summary
- Estimated Delivery Date

---

# Recommended Customer Account Structure

```
/account
├── dashboard
├── profile
├── security
├── addresses
├── orders
│   └── [orderId]
├── wishlist
├── notifications
├── preferences
└── logout
```

---

# Suggested Development Roadmap

## Phase 1 (Essential)

- Authentication
- Customer Dashboard
- Profile
- Security
- Address Management
- Order History
- Order Details
- Wishlist
- Search
- Legal Pages

---

## Phase 2 (High Value)

- Category Pages
- Brand Pages
- Collections
- Product Reviews
- Notifications
- Coupons
- Recently Viewed
- Order Tracking

---

## Phase 3 (Polish)

- Compare Products
- Product Recommendations
- Returns & Refunds
- Help Center
- Stock Alerts
- Guest Order Lookup
- Size Guide
- Social Login
