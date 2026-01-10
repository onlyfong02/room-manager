# Room Management System

A comprehensive boarding house/rental room management system with multi-language support (English & Vietnamese).

## 🌟 Features

- **Multi-language Support**: English and Vietnamese with easy language switching
- **User Authentication**: JWT-based authentication with refresh tokens
- **Building Management**: Manage multiple buildings/properties
- **Room Management**: Track room status, pricing, and availability
- **Tenant Management**: Maintain tenant information and history
- **Contract Management**: Handle rental contracts with various payment cycles
- **Invoice Management**: Generate and track invoices automatically
- **Payment Tracking**: Record and monitor payments

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Internationalization**: nestjs-i18n
- **Logging**: Winston

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Internationalization**: react-i18next
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js >= 18
- MongoDB >= 5.0
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 🚀 Running with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Language Support

The application supports:
- **English (EN)**
- **Vietnamese (VI)**

Switch languages using the globe icon in the header. Language preference is saved to localStorage.

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/room-manager
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Documentation

API runs on `http://localhost:3000`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Buildings, Rooms, Tenants, Contracts, Invoices, Payments
Similar CRUD endpoints available for each module.

## 🏗️ Project Structure

```
room-manager/
├── backend/
│   ├── src/
│   │   ├── common/          # Shared utilities
│   │   ├── config/          # Configuration files
│   │   ├── i18n/            # Translation files
│   │   └── modules/         # Feature modules
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── locales/         # Translation files
│   ├── src/
│   │   ├── api/             # API clients
│   │   ├── components/      # Reusable components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   └── stores/          # State management
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the frontend library
- All open-source contributors
