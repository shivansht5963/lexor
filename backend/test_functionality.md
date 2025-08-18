# 🧪 Django Backend Functionality Testing Guide

## Quick Functionality Tests

### 1. Admin Panel Test ✅
- Go to: http://127.0.0.1:8000/admin/
- Login with superuser credentials
- Check all apps are visible: Users, Class Groups, Students, etc.

### 2. API Endpoints Test 🔌

#### Test Authentication
```bash
# Test registration endpoint
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "gmail": "test@example.com", 
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "is_teacher": true
  }'

# Test login endpoint  
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

#### Test Classes API (replace YOUR_TOKEN with actual token from login)
```bash
# Create a class
curl -X POST http://127.0.0.1:8000/api/classes/groups/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "name": "Mathematics 101",
    "description": "Basic Math Course",
    "subject": "Mathematics"
  }'

# List classes
curl -X GET http://127.0.0.1:8000/api/classes/groups/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### 3. Using VS Code REST Client 🚀

Open `api_tests.http` in VS Code and run tests:

1. Install "REST Client" extension in VS Code
2. Open `api_tests.http` file
3. Click "Send Request" above each test
4. Update @token variable with actual token from login

### 4. Browser API Testing 🌐

Visit these URLs in your browser:
- http://127.0.0.1:8000/api/ (API root)
- http://127.0.0.1:8000/api/auth/register/ (Registration form)
- http://127.0.0.1:8000/api/classes/groups/ (After login)

## Expected Results ✅

### Registration Success Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "gmail": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "is_teacher": true
  },
  "token": "your_auth_token_here"
}
```

### Login Success Response:
```json
{
  "message": "Login successful", 
  "user": {
    "id": 1,
    "username": "testuser",
    "gmail": "test@example.com"
  },
  "token": "your_auth_token_here"
}
```

### Class Creation Success:
```json
{
  "id": 1,
  "name": "Mathematics 101",
  "description": "Basic Math Course", 
  "subject": "Mathematics",
  "is_active": true,
  "created_by": {
    "username": "testuser"
  },
  "student_count": 0
}
```

## Common Issues & Solutions 🔧

### Issue: CORS Error
**Solution**: Check CORS settings in settings.py

### Issue: Token Authentication Failed  
**Solution**: Include token in headers: `Authorization: Token your_token`

### Issue: 404 Not Found
**Solution**: Check URL patterns and make sure server is running

### Issue: Permission Denied
**Solution**: Make sure user is authenticated and has proper permissions

## Testing Checklist ✅

- [ ] Server starts without errors
- [ ] Admin panel accessible and shows all apps
- [ ] User registration works
- [ ] User login returns token
- [ ] Class creation works with authentication
- [ ] API endpoints return proper JSON responses
- [ ] File upload endpoints accept files
- [ ] OCR mock functionality works
- [ ] Cheating detection mock works
- [ ] Report generation starts (mock)

## Advanced Testing 🚀

### Test File Upload (OCR)
```bash
# Test OCR with image file
curl -X POST http://127.0.0.1:8000/api/evaluation/ocr/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -F "image=@test_image.jpg"
```

### Test Dashboard Stats
```bash
curl -X GET http://127.0.0.1:8000/api/classes/dashboard-stats/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Test Cheating Detection
```bash
curl -X POST http://127.0.0.1:8000/api/cheating-detection/detect/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "input_data": "Student behavior data for analysis"
  }'
```

Happy Testing! 🎉