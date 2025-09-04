# KMRL Document Intelligence System

A comprehensive document management and intelligence system for Kochi Metro Rail Limited (KMRL), featuring AI-powered document processing, compliance tracking, and advanced analytics.

## 🚀 Features

### Core Functionality
- **Document Upload & Processing**: Secure file upload with automatic categorization
- **AI-Powered Analysis**: Intelligent document summarization and content understanding
- **Advanced Search**: Full-text search with relevance scoring and highlighting
- **Compliance Management**: Regulatory compliance tracking and deadline management
- **Real-time Analytics**: Comprehensive dashboards and performance metrics
- **Multi-language Support**: English and Malayalam language processing

### Technical Features
- **Modern Tech Stack**: React + TypeScript frontend, Node.js + Express backend
- **Database**: SQLite with full-text search capabilities
- **Authentication**: JWT-based secure authentication
- **File Storage**: Secure file upload and storage system
- **RESTful API**: Well-documented API endpoints
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Architecture

```
KMRL Document Intelligence System
├── Frontend (React + TypeScript + Vite)
│   ├── Dashboard - Real-time insights and statistics
│   ├── Document Upload - File upload with AI processing
│   ├── Document Library - Search, filter, and manage documents
│   ├── Compliance Tracker - Regulatory compliance management
│   ├── Advanced Search - AI-powered content search
│   └── Analytics - Performance metrics and reporting
│
└── Backend (Node.js + Express + TypeScript)
    ├── Authentication - JWT-based user management
    ├── Document Management - CRUD operations for documents
    ├── File Upload - Secure file handling and processing
    ├── Search Engine - Full-text search with AI features
    ├── Analytics Engine - Real-time metrics and reporting
    ├── Compliance API - Regulatory tracking and alerts
    └── Dashboard API - Real-time data aggregation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **ESLint** - Code linting and formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend code
- **SQLite3** - Lightweight database
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kmrl-document-intelligence
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start both servers:**
   ```bash
   # Option 1: Use the provided script (Windows)
   ./start.bat

   # Option 2: Manual startup
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

5. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001
   - **API Health Check**: http://localhost:3001/api/health

## 📊 API Documentation

### Authentication Endpoints
```bash
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/verify
```

### Document Management
```bash
GET    /api/documents          # List documents with filtering
GET    /api/documents/:id      # Get document by ID
POST   /api/documents          # Create new document
PUT    /api/documents/:id      # Update document
DELETE /api/documents/:id      # Delete document
GET    /api/documents/stats/overview  # Document statistics
```

### File Upload
```bash
POST /api/upload/single         # Upload single file
POST /api/upload/multiple       # Upload multiple files
GET  /api/upload/stats          # Upload statistics
```

### Search & Analytics
```bash
GET /api/search                 # Advanced search
GET /api/search/suggestions     # Search suggestions
GET /api/analytics/dashboard    # Dashboard analytics
GET /api/analytics/processing   # Processing metrics
GET /api/analytics/system-health # System health
```

### Compliance Management
```bash
GET    /api/compliance              # List compliance items
GET    /api/compliance/:id          # Get compliance item
POST   /api/compliance              # Create compliance item
PUT    /api/compliance/:id          # Update compliance item
DELETE /api/compliance/:id          # Delete compliance item
GET    /api/compliance/stats/overview # Compliance statistics
```

### Dashboard
```bash
GET /api/dashboard/overview     # Dashboard overview
GET /api/dashboard/quick-actions # Quick actions data
GET /api/dashboard/activity     # Activity feed
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_PATH=./database.sqlite
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:5173
```

### Database

The application uses SQLite3 for data storage. The database is automatically created and seeded with sample data on first run.

**Sample Data Includes:**
- User accounts (admin, safety_officer, engineer, procurement)
- Sample documents across different departments
- Compliance items with various statuses
- Analytics data for demonstration

## 🧪 Testing

### API Testing
Run the included test script:
```bash
node test-api.js
```

### Manual Testing
Use tools like Postman or Insomnia to test API endpoints:
- Import the API collection from `backend/README.md`
- Test authentication, document management, and analytics endpoints

## 📱 Usage Guide

### User Authentication
1. Use default credentials or register new account
2. Login to access the dashboard
3. JWT tokens are automatically managed

### Document Management
1. **Upload**: Use the Document Upload page to add files
2. **Processing**: Files are automatically categorized and summarized
3. **Search**: Use advanced search to find documents
4. **Manage**: View, edit, and organize documents in the library

### Compliance Tracking
1. **Monitor**: View compliance items and deadlines
2. **Track**: Update progress and status
3. **Alerts**: Receive notifications for urgent items

### Analytics & Reporting
1. **Dashboard**: Real-time insights and KPIs
2. **Reports**: Department-wise and system-wide analytics
3. **Performance**: Monitor AI processing and system health

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Cross-origin resource sharing controls
- **Helmet Security**: Security headers and protections
- **File Upload Validation**: Secure file type and size validation
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment

### Development
```bash
# Frontend
npm run dev

# Backend
cd backend && npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Build and start backend
cd backend
npm run build
npm run start
```

### Docker (Future Enhancement)
```dockerfile
# Multi-stage build for frontend and backend
FROM node:18-alpine AS builder
# Build steps...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Test API endpoints thoroughly
- Maintain consistent code style

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation in `backend/README.md`
- Review the frontend component documentation
- Test with the provided sample data
- Check the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if port 3001 is available
- Verify all dependencies are installed
- Check `.env` file configuration

**Frontend not connecting to backend:**
- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API endpoints are accessible

**Database issues:**
- Delete `database.sqlite` and restart to reseed
- Check file permissions for database directory

**File upload issues:**
- Verify upload directory exists and has write permissions
- Check file size limits (50MB default)
- Ensure supported file types are used

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=kmrl:*
```

## 📈 Future Enhancements

- [ ] **AI Integration**: Real AI/ML models for document analysis
- [ ] **Multi-language**: Enhanced Malayalam language support
- [ ] **Real-time Notifications**: WebSocket-based notifications
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Mobile App**: React Native mobile application
- [ ] **Cloud Storage**: Integration with cloud storage providers
- [ ] **Audit Trail**: Complete audit logging system
- [ ] **Role-based Access**: Granular permission system

## 👥 Team

**KMRL Document Intelligence Team**
- Project Lead: [Your Name]
- Frontend Developer: [Team Member]
- Backend Developer: [Team Member]
- AI/ML Engineer: [Team Member]

## 🙏 Acknowledgments

- Kochi Metro Rail Limited for the project requirements
- Open source community for the amazing tools and libraries
- Contributors and testers for their valuable feedback

---

**Happy Document Processing! 🚇📄**
