# Nexus App 2

A modern full-stack application built with React Router (frontend) and NestJS (backend), featuring authentication, user management, and real-time capabilities.

## 🚀 Features

### Frontend (React Router)

- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🐳 Docker support

### Backend (NestJS)

- 🔐 JWT Authentication
- 👥 User Management
- 🗄️ Prisma ORM with database migrations
- 🔄 Redis integration for caching/sessions
- 🏥 Health check endpoints
- 🧪 Comprehensive testing (unit & e2e)

## 📁 Project Structure

```
nexus-app/
├── client/                 # React Router frontend
│   ├── app/               # Application code
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend containerization
└── server/                # NestJS backend
    ├── src/
    │   ├── api/           # API modules (health, users)
    │   ├── auth/          # Authentication module
    │   ├── prisma/        # Database ORM
    │   └── services/      # Business logic services
    ├── prisma/            # Database schema & migrations
    └── generated/         # Prisma generated files
```

## 🛠️ Tech Stack

### Frontend

- **React Router** - Modern routing with SSR
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework

### Backend

- **NestJS** - Progressive Node.js framework
- **Prisma** - Type-safe database ORM
- **JWT** - Authentication
- **Redis** - Caching and session management
- **Jest** - Testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker (optional, for containerization)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nexus-app-2
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd client
   pnpm install

   # Install backend dependencies
   cd ../server
   pnpm install
   ```

3. **Set up the database**
   ```bash
   cd server
   # Run database migrations
   pnpm prisma migrate dev
   # Generate Prisma client
   pnpm prisma generate
   ```

### Development

1. **Start the backend server**

   ```bash
   cd server
   pnpm start:dev
   ```

   The API will be available at `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd client
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

## 🧪 Testing

### Backend Tests

```bash
cd server

# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🏗️ Building for Production

### Frontend

```bash
cd client
pnpm build
```

### Backend

```bash
cd server
pnpm build
```

## 🐳 Docker Deployment

### Frontend

```bash
cd client
docker build -t nexus-app-frontend .
docker run -p 3000:3000 nexus-app-frontend
```

### Backend

```bash
cd server
docker build -t nexus-app-backend .
docker run -p 3000:3000 nexus-app-backend
```

## 📚 API Documentation

### Health Check

- `GET /health` - Application health status

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🔧 Configuration

### Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**Server (.env)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexus_app"
JWT_SECRET="your-jwt-secret"
REDIS_URL="redis://localhost:6379"
PORT=3000
```

**Client (.env)**

```env
VITE_API_URL="http://localhost:3000"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Frontend Issues**: Check [React Router docs](https://reactrouter.com/)
- **Backend Issues**: Check [NestJS docs](https://docs.nestjs.com/)
- **Database Issues**: Check [Prisma docs](https://www.prisma.io/docs/)

---

Built with ❤️ using React Router and NestJS.
