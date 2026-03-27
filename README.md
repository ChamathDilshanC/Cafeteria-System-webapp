# Cafeteria Management System - Web Application

A modern, responsive web application for managing cafeteria operations including food pre-ordering, order management, kitchen operations, and payment processing.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide Vue Next
- **State Management**: Vue Composition API + Local Storage
- **HTTP Client**: Fetch API

## Features

### Customer Features

- **User Authentication**: Secure login and registration
- **Browse Menu**: View available food items with images, descriptions, and prices
- **Shopping Cart**: Add/remove items, adjust quantities
- **Place Orders**: Submit orders with preferred pickup time
- **Order Tracking**: View order status (pending, preparing, ready, completed)

### Staff/Admin Features

- **Payment Management**: View and process all orders, mark orders as paid
- **Kitchen Operations**: View pending orders, mark items as preparing/ready
- **Admin Panel**:
  - Manage menu items (add, edit, delete)
  - Upload menu item images
  - View all users and orders
  - Comprehensive system management

### User Roles

- **CUSTOMER**: Access to menu browsing and personal orders
- **STAFF**: Access to payments and kitchen operations
- **ADMIN**: Full system access including admin panel

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend services running (API Gateway on port 8080)
  - Config Server, Service Registry, API Gateway
  - User Service, Menu Service, Order Service, Kitchen Service

## Installation

1. Clone the repository or navigate to the webapp directory:

   ```bash
   cd webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application connects to the backend API Gateway. The base URL is configured in `src/api/index.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

Update this URL if your API Gateway runs on a different host/port.

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
webapp/
├── css/
│   └── styles.css          # Global styles and Tailwind imports
├── js/
│   ├── api.js              # Legacy API client (deprecated)
│   └── app.js              # Legacy app logic (deprecated)
├── src/
│   ├── api/
│   │   └── index.js        # API client for backend services
│   ├── components/
│   │   ├── AdminSection.vue    # Admin panel for menu/user management
│   │   ├── AuthView.vue        # Login and registration forms
│   │   ├── Cart.vue            # Shopping cart component
│   │   ├── KitchenSection.vue  # Kitchen operations dashboard
│   │   ├── MenuSection.vue     # Menu browsing and item selection
│   │   ├── OrderSection.vue    # Customer order history
│   │   └── PaymentSection.vue  # Staff payment processing
│   ├── stores/
│   │   └── cartStore.js        # Shopping cart state management
│   ├── utils/
│   │   └── currency.js         # Currency formatting utilities
│   ├── App.vue                 # Root component
│   └── main.js                 # Application entry point
├── index.html                  # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

The webapp integrates with the following backend services through the API Gateway:

| Endpoint          | Service         | Description                     |
| ----------------- | --------------- | ------------------------------- |
| `/api/users/**`   | user-service    | Authentication, user management |
| `/api/menu/**`    | menu-service    | Menu items, categories          |
| `/api/orders/**`  | order-service   | Order placement and tracking    |
| `/api/kitchen/**` | kitchen-service | Kitchen operations              |

### Authentication

- JWT tokens are stored in `localStorage` as `auth_token`
- User data is cached in `localStorage` as `auth_user`
- Token is automatically included in API requests via Authorization header

## Development Notes

### State Management

- Cart state is managed via `src/stores/cartStore.js`
- User authentication state is managed in `App.vue`
- Uses Vue 3 reactive refs for component-local state

### Styling

- Tailwind CSS utility classes for all styling
- Custom gradient backgrounds and shadow effects
- Responsive design with mobile-first approach
- Consistent color scheme: Indigo primary, Slate neutral

### Icons

Uses Lucide Vue Next icon library:

- UtensilsCrossed - App logo
- LayoutGrid - Menu navigation
- Receipt - Orders navigation
- BanknoteIcon - Payments navigation
- ChefHat - Kitchen navigation
- Settings - Admin panel navigation

## Deployment

### Using PM2 (Production)

The project includes PM2 configuration in the root `ecosystem.config.js`:

```bash
# Build first
npm run build

# Start with PM2 (from project root)
pm2 start ecosystem.config.js
```

### Docker Deployment

Can be containerized using a multi-stage Dockerfile:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Google Cloud Platform

For GCP deployment:

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to GCP App Engine, Cloud Run, or Cloud Storage + CDN
3. Update API_BASE_URL to point to your production API Gateway

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 14+

## Common Issues

### CORS Errors

Ensure the API Gateway has CORS configured to allow requests from the webapp origin.

### 401 Unauthorized

Check that the JWT token is valid and not expired. Logout and login again.

### Menu Images Not Loading

Verify that Google Cloud Storage bucket has public read access for menu item images.

## Contributing

This is an academic project for ITS 2130. For questions or issues, contact the development team.

## License

Academic project - All rights reserved.
