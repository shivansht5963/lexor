# Bolt Expo Backend - Django REST API

A comprehensive Django REST API backend for the Bolt Expo educational platform, featuring authentication, class management, cheating detection, evaluation system, and report generation.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- pip (Python package manager)
- Git

### 1. Clone and Setup
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Create migrations
python manage.py makemigrations custom_auth
python manage.py makemigrations classes
python manage.py makemigrations cheating_detection
python manage.py makemigrations evaluation
python manage.py makemigrations report

# Apply migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
```

### 3. Create Media Directories
```bash
# Create media directories for file uploads
mkdir -p media/profile_pics
mkdir -p media/cheating_detection
mkdir -p media/evaluations/documents
mkdir -p media/ocr/input
mkdir -p media/reports/pdf
mkdir -p media/reports/excel
```

### 4. Run Development Server
```bash
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000/`
Admin interface at: `http://127.0.0.1:8000/admin/`

## 📋 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/
```

### Authentication
All API endpoints (except registration and login) require authentication using Token-based authentication.

Include the token in your request headers:
```
Authorization: Token your_token_here
```

### API Endpoints

#### 🔐 Authentication (`/api/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login
- `POST /logout/` - User logout
- `GET /profile/` - Get user profile
- `PUT /profile/` - Update user profile
- `POST /check-username/` - Check username availability
- `POST /check-email/` - Check email availability
- `POST /change-password/` - Change password

#### 🎓 Classes Management (`/api/classes/`)
- `GET /groups/` - List class groups
- `POST /groups/` - Create class group
- `GET /groups/{id}/` - Get class group details
- `PUT /groups/{id}/` - Update class group
- `DELETE /groups/{id}/` - Delete class group
- `GET /groups/{id}/students/` - Get students in class
- `POST /groups/{id}/add_student/` - Add single student
- `POST /groups/{id}/add_students_bulk/` - Bulk add students
- `GET /groups/{id}/stats/` - Class statistics
- `GET /students/` - List all students
- `POST /students/` - Create student
- `GET /dashboard-stats/` - Dashboard statistics
- `GET /search-students/` - Search students
- `POST /transfer-student/` - Transfer student between classes

#### 🔍 Cheating Detection (`/api/cheating-detection/`)
- `GET /detections/` - List detections
- `POST /detections/` - Create detection
- `GET /detections/stats/` - Detection statistics
- `GET /detections/history/` - Detection history with filters
- `POST /detect/` - Submit detection data
- `GET /result/{id}/` - Get detection result
- `GET /class-summary/{id}/` - Class cheating summary
- `POST /bulk-detect/` - Bulk detection submission

#### 📝 Evaluation & OCR (`/api/evaluation/`)
- `POST /ocr/` - Quick OCR processing
- `GET /evaluations/` - List evaluations
- `POST /evaluations/` - Create evaluation
- `GET /evaluations/stats/` - Evaluation statistics
- `GET /evaluations/by_class/` - Filter evaluations by class
- `GET /evaluations/by_student/` - Filter evaluations by student
- `POST /evaluations/{id}/auto_grade/` - Auto-calculate grade
- `GET /ocr-requests/` - List OCR requests
- `POST /ocr-requests/` - Create OCR request
- `POST /evaluate/` - Create student evaluation
- `GET /student-progress/{id}/` - Student progress report
- `GET /class-summary/{id}/` - Class evaluation summary

#### 📊 Reports (`/api/reports/`)
- `POST /export/` - Generate report
- `GET /history/` - Report generation history

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "gmail": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### 3. Create a Class (use token from login)
```bash
curl -X POST http://127.0.0.1:8000/api/classes/groups/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -d '{
    "name": "Mathematics 101",
    "description": "Basic Mathematics Course",
    "subject": "Mathematics"
  }'
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory for sensitive settings:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional - SQLite is default)
DATABASE_URL=sqlite:///db.sqlite3

# Google Cloud Vision API (optional)
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json

# Email Settings (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8081
```

### Optional Features

#### Enable Google Cloud Vision OCR
1. Set up Google Cloud Project
2. Enable Vision API
3. Download service account credentials
4. Uncomment `google-cloud-vision` in requirements.txt
5. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

#### Enable PDF Generation
1. Uncomment `reportlab` in requirements.txt
2. Install: `pip install reportlab`

#### Enable Excel Export
1. Uncomment `openpyxl` in requirements.txt
2. Install: `pip install openpyxl`

## 🏗️ Project Structure

```
backend/
├── bolt_backend/          # Django project settings
│   ├── settings.py        # Main configuration
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI configuration
├── custom_auth/          # Authentication app
│   ├── models.py         # User model
│   ├── views.py          # Auth views
│   ├── serializers.py    # Auth serializers
│   └── urls.py           # Auth URLs
├── classes/              # Class management app
│   ├── models.py         # ClassGroup, Student models
│   ├── views.py          # Class management views
│   ├── serializers.py    # Class serializers
│   └── urls.py           # Class URLs
├── cheating_detection/   # Cheating detection app
│   ├── models.py         # CheatingDetection model
│   ├── views.py          # Detection views
│   ├── serializers.py    # Detection serializers
│   └── urls.py           # Detection URLs
├── evaluation/           # Evaluation and OCR app
│   ├── models.py         # Evaluation, OCRRequest models
│   ├── views.py          # Evaluation views
│   ├── serializers.py    # Evaluation serializers
│   └── urls.py           # Evaluation URLs
├── report/               # Report generation app
│   ├── models.py         # Report, ReportTemplate models
│   ├── views.py          # Report views
│   ├── serializers.py    # Report serializers
│   └── urls.py           # Report URLs
├── media/                # File uploads directory
├── requirements.txt      # Python dependencies
├── manage.py            # Django management script
└── db.sqlite3           # SQLite database (auto-generated)
```

## 🚨 Troubleshooting

### Common Issues

#### Migration Errors
```bash
# Reset migrations if needed
python manage.py migrate --fake-initial

# Or delete migration files and recreate
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate
```

#### CORS Errors
- Ensure your frontend URL is in `CORS_ALLOWED_ORIGINS` in settings.py
- Install django-cors-headers: `pip install django-cors-headers`

#### Token Authentication Issues
- Make sure you include the token in request headers
- Format: `Authorization: Token your_token_here`
- Get token from login response

#### File Upload Issues
- Ensure media directories exist
- Check file permissions
- Verify `MEDIA_ROOT` and `MEDIA_URL` settings

### Development Tips

#### View API in Browser
- Install Django REST Framework browsable API
- Visit endpoints directly in browser when authenticated
- Use Django admin at `/admin/` to manage data

#### Database Management
```bash
# View database schema
python manage.py dbshell

# Create database backup
python manage.py dumpdata > backup.json

# Load database backup
python manage.py loaddata backup.json
```

#### Testing
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test custom_auth
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Django and DRF documentation
3. Check the CODECONTEXT.md file for architecture details

## 📄 License

This project is part of the Bolt Expo educational platform.