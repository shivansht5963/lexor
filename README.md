# Project Bolt Expo Starter

## Overview
This is a cross-platform mobile and web application built with Expo, React Native, and TypeScript. It features authentication, class management, cheating detection, evaluation, PDF export, and more.

## Project Structure

- **app/**: Main application screens and layouts
  - **_layout.tsx**: Root layout
  - **+not-found.tsx**: Not found page
  - **cheating-detection.tsx**: Cheating detection screen
  - **class-groups.tsx**: Class groups screen
  - **evaluation-result.tsx**: Evaluation result screen
  - **export-pdf.tsx**: PDF export screen
  - **scan.tsx**: Scanning screen
  - **(tabs)/**: Tabbed navigation screens
    - **_layout.tsx**: Tabs layout
    - **classes.tsx**: Classes tab
    - **index.tsx**: Main tab
    - **profile.tsx**: Profile tab
    - **reports.tsx**: Reports tab
  - **auth/**: Authentication screens
    - **_layout.tsx**: Auth layout
    - **login.tsx**: Login screen
    - **signup.tsx**: Signup screen

- **assets/**: Static assets
  - **images/**: Image files (favicon, icon, etc.)

- **components/**: Reusable UI components
  - **TabBar.tsx**: Custom tab bar component

- **hooks/**: Custom React hooks
  - **useFrameworkReady.ts**: Hook for framework readiness

- **services/**: Business logic and API services
  - **authService.ts**: Authentication logic
  - **cheatingDetectionService.ts**: Cheating detection logic
  - **mockData.ts**: Mock data for testing
  - **ocrService.ts**: OCR logic
  - **pdfService.ts**: PDF export logic

- **types/**: TypeScript type definitions
  - **index.ts**: Shared types

- **utils/**: Utility functions and constants
  - **constants.ts**: Shared constants

- **Configuration Files**:
  - **package.json**: Project dependencies and scripts
  - **tsconfig.json**: TypeScript configuration
  - **app.json**: Expo app configuration
  - **expo-env.d.ts**: Expo environment types
  - **.gitignore, .npmrc, .prettierrc**: Project settings

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the app:**
   ```sh
   # Ensure the backend is running on http://localhost:8000
   # Then expose the API base URL to the app
   EXPO_PUBLIC_API_URL=http://localhost:8000/api npx expo start
   ```
   - Scan the QR code with Expo Go (Android/iOS) or open the web version at http://localhost:8081

## Scripts
- `dev`: Start Expo (may need manual `expo start` on Windows)
- `build:web`: Export for web
- `lint`: Lint the codebase

## Notes
- Update dependencies for best compatibility as suggested by Expo.
- The project uses TypeScript and Expo Router for navigation.

---

For more details, explore each folder and file as described above.
