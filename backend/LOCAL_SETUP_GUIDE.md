# 🚀 Local Development Setup Guide

## Step-by-Step Instructions for Running Bolt Expo Backend Locally

### 📋 Prerequisites

Before you start, make sure you have:
- **Python 3.8+** installed on your system
- **pip** (Python package manager) 
- **VS Code** (recommended IDE)
- **Git** (for version control)

### 🔧 VS Code Setup

#### 1. Install VS Code Extensions
Open VS Code and install these essential extensions:
- **Python** (by Microsoft)
- **Django** (by Baptiste Darthenay)
- **REST Client** (for API testing)
- **SQLite Viewer** (for database inspection)

#### 2. Open the Project
```bash
# Open the entire project in VS Code
code /path/to/your/project

# Or navigate to the backend folder specifically
cd /path/to/your/project/backend
code .
```

### 🐍 Python Environment Setup

#### 1. Create Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate

# On Windows (PowerShell):
venv\Scripts\Activate.ps1

# On macOS/Linux:
source venv/bin/activate
```

**Note**: Your terminal prompt should now show `(venv)` indicating the virtual environment is active.

#### 2. Install Dependencies
```bash
# Install all required packages
pip install -r requirements.txt

# If you want optional features, uncomment lines in requirements.txt and run:
# pip install -r requirements.txt
```

### 🗄️ Database Setup

#### 1. Create Migrations
```bash
# Create migrations for each app
python manage.py makemigrations custom_auth
python manage.py makemigrations classes
python manage.py makemigrations cheating_detection
python manage.py makemigrations evaluation
python manage.py makemigrations report

# Apply all migrations
python manage.py migrate
```

#### 2. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin account:
- Username: `admin` (or your preference)
- Email: your email
- Password: create a secure password

#### 3. Create Media Directories
```bash
# Create directories for file uploads
mkdir media
mkdir media\profile_pics
mkdir media\cheating_detection
mkdir media\evaluations
mkdir media\evaluations\documents
mkdir media\ocr
mkdir media\ocr\input
mkdir media\reports
mkdir media\reports\pdf
mkdir media\reports\excel

# On macOS/Linux, use forward slashes:
# mkdir -p media/{profile_pics,cheating_detection,evaluations/documents,ocr/input,reports/{pdf,excel}}
```

### 🚀 Running the Server

#### 1. Start Development Server
```bash
python manage.py runserver
```

You should see output like:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
December 20, 2024 - 10:30:00
Django version 5.2.5, using settings 'bolt_backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

#### 2. Access Your API
- **API Base URL**: http://127.0.0.1:8000/api/
- **Admin Panel**: http://127.0.0.1:8000/admin/
- **API Documentation**: http://127.0.0.1:8000/api/ (browsable API)

### 🧪 Testing Your Setup

#### 1. Test Admin Panel
1. Go to http://127.0.0.1:8000/admin/
2. Login with your superuser credentials
3. You should see all your apps (Custom auth, Classes, etc.)

#### 2. Test API Endpoints

Create a file called `test_api.http` in your backend folder and use VS Code's REST Client:

```http
### Test Server Health
GET http://127.0.0.1:8000/api/auth/register/
Content-Type: application/json

### Register New User
POST http://127.0.0.1:8000/api/auth/register/
Content-Type: application/json

{
    "username": "testuser",
    "gmail": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
}

### Login User
POST http://127.0.0.1:8000/api/auth/login/
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpass123"
}

### Get Profile (replace TOKEN with actual token from login)
GET http://127.0.0.1:8000/api/auth/profile/
Authorization: Token YOUR_TOKEN_HERE

### Create Class Group (replace TOKEN)
POST http://127.0.0.1:8000/api/classes/groups/
Content-Type: application/json
Authorization: Token YOUR_TOKEN_HERE

{
    "name": "Mathematics 101",
    "description": "Basic Mathematics Course",
    "subject": "Mathematics"
}

### List Class Groups (replace TOKEN)
GET http://127.0.0.1:8000/api/classes/groups/
Authorization: Token YOUR_TOKEN_HERE
```

#### 3. Test with curl (Alternative)
```bash
# Register user
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","gmail":"test@example.com","password":"testpass123","password_confirm":"testpass123","first_name":"Test","last_name":"User"}'

# Login user
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### 🔍 VS Code Development Tips

#### 1. Python Interpreter Setup
1. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
2. Type "Python: Select Interpreter"
3. Choose the interpreter from your virtual environment: `./venv/Scripts/python.exe` (Windows) or `./venv/bin/python` (Mac/Linux)

#### 2. Django Commands in VS Code
You can run Django commands directly in VS Code terminal:
- Open terminal: `Ctrl+`` (backtick)
- Make sure your virtual environment is activated
- Run any Django command: `python manage.py <command>`

#### 3. Debugging Setup
Create `.vscode/launch.json` in your project root:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Django",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/backend/manage.py",
            "args": [
                "runserver",
                "127.0.0.1:8000"
            ],
            "django": true,
            "justMyCode": true
        }
    ]
}
```

#### 4. Database Inspection
Use SQLite Viewer extension:
1. Open `db.sqlite3` file in VS Code
2. Click "Open anyway" when warned
3. Explore your database tables and data

### 🛠️ Common Development Tasks

#### Managing Dependencies
```bash
# Add new package
pip install package_name

# Update requirements.txt
pip freeze > requirements.txt

# Install from updated requirements
pip install -r requirements.txt
```

#### Database Operations
```bash
# Create new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (careful!)
python manage.py flush

# Load sample data
python manage.py loaddata fixture_file.json
```

#### Server Management
```bash
# Run on different port
python manage.py runserver 8001

# Run on all interfaces (accessible from network)
python manage.py runserver 0.0.0.0:8000

# Collect static files (for production)
python manage.py collectstatic
```

### 🚨 Troubleshooting

#### Virtual Environment Issues
```bash
# If activation doesn't work on Windows PowerShell:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating again:
venv\Scripts\Activate.ps1
```

#### Migration Issues
```bash
# If migrations fail, try:
python manage.py migrate --fake-initial

# Or reset migrations:
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate
```

#### Port Already in Use
```bash
# If port 8000 is busy, use different port:
python manage.py runserver 8001

# Or find and kill the process using port 8000:
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

#### Module Import Errors
```bash
# Make sure virtual environment is activated
# Reinstall packages if needed:
pip install -r requirements.txt

# Check Python path:
python -c "import sys; print(sys.path)"
```

### 📱 Frontend Integration

When your React Native frontend is ready:

#### 1. Update CORS Settings
In `backend/bolt_backend/settings.py`, update:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # React web
    "http://127.0.0.1:3000",      # React web alternative
    "http://localhost:8081",      # Expo web
    "http://127.0.0.1:8081",      # Expo web alternative
    "http://192.168.1.100:8081",  # Your local IP for mobile testing
]
```

#### 2. Find Your Local IP
```bash
# Windows:
ipconfig

# Mac/Linux:
ifconfig
# Look for your local network IP (usually 192.168.x.x)
```

#### 3. Test Mobile Connection
Update your React Native app to use:
```javascript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:8000/api/';
// Example: 'http://192.168.1.100:8000/api/'
```

### 🎉 You're Ready!

Your Django backend is now running locally! You can:
- ✅ Access the API at http://127.0.0.1:8000/api/
- ✅ Manage data via admin panel at http://127.0.0.1:8000/admin/
- ✅ Test endpoints with REST Client or curl
- ✅ Debug with VS Code
- ✅ Connect your React Native frontend

### 📚 Next Steps

1. **Explore the API**: Use the browsable API interface
2. **Read the Documentation**: Check README.md and CODECONTEXT.md
3. **Customize**: Modify models, views, and serializers as needed
4. **Integrate**: Connect your React Native frontend
5. **Deploy**: When ready, deploy to production

Happy coding! 🚀