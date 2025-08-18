# Backend Code Context - Bolt Expo Django API

## 🏗️ Architecture Overview

This Django backend implements a RESTful API for an educational platform with the following core features:
- User authentication and authorization
- Class and student management
- Cheating detection system
- Evaluation and grading
- OCR document processing
- Report generation and export

## 📦 App Structure

### 1. `custom_auth` - Authentication System
**Purpose**: Custom user management with enhanced profile features

**Models**:
- `User`: Extended Django user model with gmail, profile picture, teacher flag

**Key Features**:
- Token-based authentication
- Profile management
- Username/email availability checking
- Password change functionality

**API Endpoints**:
```
POST /api/auth/register/     - User registration
POST /api/auth/login/        - User login
POST /api/auth/logout/       - User logout
GET  /api/auth/profile/      - Get/update profile
POST /api/auth/check-username/ - Check availability
POST /api/auth/change-password/ - Change password
```

### 2. `classes` - Class Management System
**Purpose**: Manage educational classes and student enrollment

**Models**:
- `ClassGroup`: Represents a class/course created by a teacher
- `Student`: Represents students enrolled in classes

**Key Features**:
- Class creation and management
- Student enrollment (single/bulk)
- Class statistics and analytics
- Student transfer between classes
- Dashboard statistics

**API Endpoints**:
```
GET/POST /api/classes/groups/           - List/create classes
GET/PUT/DELETE /api/classes/groups/{id}/ - Manage specific class
GET  /api/classes/groups/{id}/students/  - Get class students
POST /api/classes/groups/{id}/add_student/ - Add student
POST /api/classes/groups/{id}/add_students_bulk/ - Bulk add
GET  /api/classes/dashboard-stats/       - Dashboard data
```

### 3. `cheating_detection` - AI-Powered Cheating Detection
**Purpose**: Detect and analyze potential cheating behavior

**Models**:
- `CheatingDetection`: Stores detection requests and results

**Key Features**:
- Multi-input detection (text, image, video)
- Confidence scoring and risk levels
- Mock AI processing (ready for ML integration)
- Historical analysis and reporting
- Bulk detection processing

**Detection Levels**:
- `none`: No cheating detected
- `low`: Minor suspicious behavior
- `medium`: Moderate risk indicators
- `high`: Strong cheating indicators
- `critical`: Definitive cheating detected

**API Endpoints**:
```
GET/POST /api/cheating-detection/detections/ - List/create detections
GET  /api/cheating-detection/detections/stats/ - Statistics
GET  /api/cheating-detection/detections/history/ - History with filters
POST /api/cheating-detection/detect/     - Submit detection
GET  /api/cheating-detection/result/{id}/ - Get result
```

### 4. `evaluation` - Evaluation and OCR System
**Purpose**: Student evaluation, grading, and document processing

**Models**:
- `Evaluation`: Student assessments with scoring and feedback
- `OCRRequest`: Document text extraction requests

**Key Features**:
- Multiple evaluation types (assignment, exam, quiz, project)
- Auto-grading based on percentage scores
- Google Cloud Vision OCR integration
- Progress tracking and analytics
- Document scanning and text extraction

**Grading Scale**:
- A+: 97-100%, A: 93-96%, A-: 90-92%
- B+: 87-89%, B: 83-86%, B-: 80-82%
- C+: 77-79%, C: 73-76%, C-: 70-72%
- D+: 67-69%, D: 60-66%, F: <60%

**API Endpoints**:
```
GET/POST /api/evaluation/evaluations/    - List/create evaluations
GET  /api/evaluation/evaluations/stats/  - Evaluation statistics
POST /api/evaluation/ocr/               - Quick OCR processing
GET/POST /api/evaluation/ocr-requests/   - Manage OCR requests
GET  /api/evaluation/student-progress/{id}/ - Student progress
```

### 5. `report` - Report Generation System
**Purpose**: Generate comprehensive reports and analytics

**Models**:
- `Report`: Generated reports with PDF/Excel files
- `ReportTemplate`: Reusable report templates

**Report Types**:
- `student_progress`: Individual student performance
- `class_summary`: Class overview and statistics
- `evaluation_analysis`: Detailed evaluation analysis
- `cheating_report`: Cheating detection summary
- `comprehensive`: Combined analysis report

**Key Features**:
- Multiple report formats (PDF, Excel)
- Customizable date ranges
- Template-based generation
- Asynchronous processing
- File download and sharing

**API Endpoints**:
```
POST /api/reports/export/   - Generate report
GET  /api/reports/history/  - Report history
```

## 🔧 Technical Implementation

### Database Design
- **SQLite**: Default database for development
- **Foreign Keys**: Proper relationships between all models
- **Indexes**: Optimized queries with database indexes
- **Constraints**: Data integrity with unique constraints

### Authentication & Authorization
- **Token Authentication**: DRF token-based auth
- **Permission Classes**: Endpoint-level permissions
- **User Ownership**: Users can only access their own data
- **Role-Based Access**: Teacher vs student differentiation

### File Handling
- **Media Files**: Organized file storage structure
- **Image Processing**: Pillow for image handling
- **File Validation**: Size and type restrictions
- **Upload Security**: Secure file upload handling

### API Design
- **RESTful Design**: Standard REST conventions
- **ViewSets**: DRF ViewSets for CRUD operations
- **Serializers**: Comprehensive data validation
- **Error Handling**: Consistent error responses
- **Pagination**: Built-in pagination support

### External Integrations
- **Google Cloud Vision**: OCR text extraction
- **ReportLab**: PDF generation
- **OpenPyXL**: Excel file generation
- **CORS**: Frontend integration support

## 🔄 Data Flow

### 1. User Registration/Login Flow
```
Frontend → POST /api/auth/register/ → User Model → Token Generation → Response
Frontend → POST /api/auth/login/ → Authentication → Token → Response
```

### 2. Class Management Flow
```
Teacher → Create Class → ClassGroup Model → Add Students → Student Model
Teacher → View Dashboard → Aggregate Queries → Statistics Response
```

### 3. Cheating Detection Flow
```
Input Data → POST /api/cheating-detection/detect/ → CheatingDetection Model
→ Mock AI Processing → Result Storage → Notification
```

### 4. Evaluation Flow
```
Document Upload → OCR Processing → Text Extraction → Evaluation Creation
→ Auto-Grading → Result Storage → Progress Tracking
```

### 5. Report Generation Flow
```
Report Request → Data Compilation → PDF/Excel Generation → File Storage
→ Download Link → Frontend Display
```

## 🛡️ Security Considerations

### Authentication Security
- Token-based authentication
- Password hashing with Django's built-in system
- Session management
- CORS configuration for frontend integration

### Data Security
- User data isolation (users can only access their own data)
- Input validation and sanitization
- File upload restrictions
- SQL injection prevention through ORM

### File Security
- File type validation
- File size limits
- Secure file storage
- Media file access control

## 🚀 Performance Optimization

### Database Optimization
- Efficient querysets with select_related/prefetch_related
- Database indexes on frequently queried fields
- Pagination for large datasets
- Aggregate queries for statistics

### File Handling
- Async processing for heavy operations
- File compression for uploads
- Efficient file serving
- Media file caching

### API Optimization
- Serializer optimization
- ViewSet caching
- Response compression
- Efficient pagination

## 🧪 Testing Strategy

### Unit Tests
- Model validation tests
- Serializer tests
- View logic tests
- Authentication tests

### Integration Tests
- API endpoint tests
- File upload tests
- Authentication flow tests
- Cross-app integration tests

### Performance Tests
- Database query optimization
- File processing performance
- API response times
- Concurrent user handling

## 🔮 Future Enhancements

### Planned Features
- Real AI/ML integration for cheating detection
- Advanced analytics and insights
- Email notifications
- Bulk operations optimization
- Advanced report templates
- Real-time notifications
- Mobile app API optimization

### Scalability Considerations
- Database migration to PostgreSQL
- Redis for caching and sessions
- Celery for background tasks
- Docker containerization
- Load balancing preparation

## 🐛 Known Limitations

### Current Mock Implementations
- Cheating detection uses mock AI results
- OCR falls back to mock text when Google Vision unavailable
- PDF generation uses simple text files without ReportLab
- Excel generation requires openpyxl installation

### Development Constraints
- SQLite database (fine for development)
- Synchronous processing (should be async in production)
- Basic error handling (can be enhanced)
- Limited file format support

## 📝 Code Conventions

### Django Best Practices
- Models in `models.py` with proper Meta classes
- ViewSets for CRUD operations
- Serializers for data validation
- URL namespacing for organization

### API Design Patterns
- Consistent response formats
- Proper HTTP status codes
- Descriptive error messages
- RESTful endpoint naming

### Code Quality
- Type hints where applicable
- Docstrings for all classes and methods
- Consistent naming conventions
- Proper exception handling

This backend provides a solid foundation for the Bolt Expo educational platform with room for future enhancements and scaling.