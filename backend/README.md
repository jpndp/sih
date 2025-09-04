# KMRL Document Intelligence Backend

A comprehensive backend API for the KMRL Document Intelligence System built with Node.js, Express, and TypeScript.

## Features

- **Document Management**: Full CRUD operations for documents
- **File Upload**: Secure file upload with processing simulation
- **Advanced Search**: AI-powered content search with highlighting
- **Analytics**: Comprehensive analytics and reporting
- **Compliance Tracking**: Regulatory compliance management
- **Authentication**: JWT-based authentication system
- **Dashboard**: Real-time dashboard data and statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Documents
- `GET /api/documents` - Get all documents (with filtering/pagination)
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/stats/overview` - Document statistics

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/stats` - Upload statistics

### Search
- `GET /api/search` - Advanced document search
- `GET /api/search/suggestions` - Search suggestions
- `GET /api/search/analytics/overview` - Search analytics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/processing` - Processing performance
- `GET /api/analytics/system-health` - System health metrics
- `GET /api/analytics/user-activity` - User activity analytics
- `GET /api/analytics/compliance` - Compliance analytics

### Compliance
- `GET /api/compliance` - Get all compliance items
- `GET /api/compliance/:id` - Get compliance item by ID
- `POST /api/compliance` - Create compliance item
- `PUT /api/compliance/:id` - Update compliance item
- `DELETE /api/compliance/:id` - Delete compliance item
- `GET /api/compliance/stats/overview` - Compliance statistics
- `GET /api/compliance/deadlines/upcoming` - Upcoming deadlines
- `GET /api/compliance/deadlines/overdue` - Overdue items

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview data
- `GET /api/dashboard/quick-actions` - Quick actions data
- `GET /api/dashboard/activity` - Activity feed

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   DATABASE_PATH=./database.sqlite
   UPLOAD_PATH=./uploads
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

### Database

The application uses SQLite3 for data storage. The database is automatically created and seeded with sample data when the server starts.

### File Upload

- Supported formats: PDF, Word (.doc/.docx), Excel (.xls/.xlsx), Images (.jpg/.jpeg/.png)
- Maximum file size: 50MB
- Files are stored in the `./uploads` directory

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

### Project Structure

```
backend/
├── src/
│   ├── database/
│   │   └── init.ts          # Database initialization and helpers
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── documents.ts     # Document management routes
│   │   ├── upload.ts        # File upload routes
│   │   ├── search.ts        # Search functionality routes
│   │   ├── analytics.ts     # Analytics routes
│   │   ├── compliance.ts    # Compliance tracking routes
│   │   └── dashboard.ts     # Dashboard data routes
│   └── server.ts            # Main server file
├── uploads/                 # File upload directory
├── package.json
├── tsconfig.json
└── .env                     # Environment variables
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Sample Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Optional error details"
}
```

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl commands
- The frontend application

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start the production server:
   ```bash
   npm run start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
