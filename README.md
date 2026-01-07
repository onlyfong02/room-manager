# Room Manager - Hệ thống quản lý phòng trọ

Hệ thống quản lý phòng trọ toàn diện cho chủ nhà trọ tại Việt Nam, hỗ trợ quản lý khu trọ, phòng, người thuê, hợp đồng, hóa đơn và thanh toán.

## 🚀 Công nghệ sử dụng

### Backend
- **NestJS** - Framework Node.js
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Winston** - Logging
- **Class Validator** - Validation

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Routing

### DevOps
- **Docker & Docker Compose** - Containerization
- **PM2** - Process management
- **Nginx** - Reverse proxy

## 📋 Yêu cầu hệ thống

- Node.js >= 20.x
- MongoDB >= 7.x
- Docker & Docker Compose (optional)

## 🛠️ Cài đặt và chạy

### Phương pháp 1: Chạy với Docker (Khuyến nghị)

1. **Clone repository**
```bash
git clone <repository-url>
cd room-manager
```

2. **Tạo file environment**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. **Chỉnh sửa file .env** (nếu cần)
```bash
# backend/.env
JWT_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-here
```

4. **Chạy với Docker Compose**
```bash
docker-compose up -d
```

5. **Truy cập ứng dụng**
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- MongoDB: localhost:27017

### Phương pháp 2: Chạy local (Development)

#### Backend

1. **Di chuyển vào thư mục backend**
```bash
cd backend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo file .env**
```bash
cp .env.example .env
```

4. **Chỉnh sửa .env với MongoDB local**
```env
MONGODB_URI=mongodb://localhost:27017/room-manager
```

5. **Chạy development server**
```bash
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:3000

#### Frontend

1. **Di chuyển vào thư mục frontend**
```bash
cd frontend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo file .env**
```bash
cp .env.example .env
```

4. **Chạy development server**
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 📚 Cấu trúc dự án

```
room-manager/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── common/         # Common utilities
│   │   ├── config/         # Configuration files
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── buildings/  # Building management
│   │   │   ├── rooms/      # Room management
│   │   │   ├── tenants/    # Tenant management
│   │   │   ├── contracts/  # Contract management
│   │   │   ├── invoices/   # Invoice management
│   │   │   └── payments/   # Payment management
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # State management
│   │   ├── lib/           # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── docker-compose.yml     # Docker orchestration
```

## 🔑 Tính năng chính

### ✅ Đã triển khai
- [x] Đăng ký / Đăng nhập với JWT
- [x] Quản lý người dùng (OWNER, STAFF)
- [x] Quản lý khu trọ
- [x] Quản lý phòng (trạng thái, giá, tiện ích)
- [x] Quản lý người thuê (thông tin, CCCD, liên hệ khẩn cấp)
- [x] Quản lý hợp đồng (dài hạn, theo ngày, theo tháng)
- [x] Quản lý hóa đơn (tự động tính tiền điện nước)
- [x] Quản lý thanh toán (nhiều phương thức)
- [x] Dashboard với thống kê
- [x] Responsive design

### 🚧 Sẽ phát triển
- [ ] Tự động tạo hóa đơn hàng tháng
- [ ] Xuất hóa đơn PDF
- [ ] Báo cáo doanh thu
- [ ] Báo cáo công nợ
- [ ] Thông báo qua email/SMS
- [ ] Upload hình ảnh phòng
- [ ] Quản lý bảo trì
- [ ] Multi-tenant SaaS

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token

### Buildings
- `GET /api/buildings` - Danh sách khu trọ
- `POST /api/buildings` - Tạo khu trọ
- `GET /api/buildings/:id` - Chi tiết khu trọ
- `PUT /api/buildings/:id` - Cập nhật khu trọ
- `DELETE /api/buildings/:id` - Xóa khu trọ

### Rooms
- `GET /api/rooms` - Danh sách phòng
- `POST /api/rooms` - Tạo phòng
- `GET /api/rooms/:id` - Chi tiết phòng
- `PUT /api/rooms/:id` - Cập nhật phòng
- `PUT /api/rooms/:id/indexes` - Cập nhật chỉ số điện nước
- `DELETE /api/rooms/:id` - Xóa phòng

### Tenants
- `GET /api/tenants` - Danh sách người thuê
- `POST /api/tenants` - Tạo người thuê
- `GET /api/tenants/:id` - Chi tiết người thuê
- `PUT /api/tenants/:id` - Cập nhật người thuê
- `DELETE /api/tenants/:id` - Xóa người thuê

### Contracts
- `GET /api/contracts` - Danh sách hợp đồng
- `POST /api/contracts` - Tạo hợp đồng
- `GET /api/contracts/:id` - Chi tiết hợp đồng
- `PUT /api/contracts/:id` - Cập nhật hợp đồng
- `DELETE /api/contracts/:id` - Xóa hợp đồng

### Invoices
- `GET /api/invoices` - Danh sách hóa đơn
- `POST /api/invoices` - Tạo hóa đơn
- `GET /api/invoices/:id` - Chi tiết hóa đơn
- `PUT /api/invoices/:id` - Cập nhật hóa đơn
- `DELETE /api/invoices/:id` - Xóa hóa đơn

### Payments
- `GET /api/payments` - Danh sách thanh toán
- `POST /api/payments` - Ghi nhận thanh toán
- `GET /api/payments/:id` - Chi tiết thanh toán
- `DELETE /api/payments/:id` - Xóa thanh toán

## 🧪 Testing

### Backend
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend
```bash
cd frontend

# Run tests
npm run test
```

## 📦 Production Deployment

### Với PM2

1. **Build backend**
```bash
cd backend
npm run build
```

2. **Chạy với PM2**
```bash
pm2 start ecosystem.config.json
pm2 save
pm2 startup
```

### Với Docker

```bash
# Build và chạy
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

## 🔧 Troubleshooting

### MongoDB connection failed
- Kiểm tra MongoDB đã chạy: `mongosh`
- Kiểm tra MONGODB_URI trong .env

### Port already in use
- Backend (3000): `lsof -ti:3000 | xargs kill -9`
- Frontend (5173): `lsof -ti:5173 | xargs kill -9`

### Docker issues
```bash
# Rebuild containers
docker-compose up -d --build --force-recreate

# Clean up
docker system prune -a
```

## 📝 License

MIT

## 👥 Contributors

- Development Team

## 📧 Contact

For support, email: support@roommanager.com
