# Code Context for Project Bolt Expo Starter

## app/
- _layout.tsx: Root layout for the app
- +not-found.tsx: Handles 404 routes
- cheating-detection.tsx: Cheating detection screen logic
- class-groups.tsx: Class group management
- evaluation-result.tsx: Displays evaluation results
- export-pdf.tsx: PDF export functionality
- scan.tsx: Scanning feature
- (tabs)/: Tab navigation screens
  - _layout.tsx: Layout for tabs
  - classes.tsx: Classes tab logic
  - index.tsx: Main tab
  - profile.tsx: User profile tab
  - reports.tsx: Reports tab
- auth/: Authentication screens
  - _layout.tsx: Auth layout
  - login.tsx: Login logic
  - signup.tsx: Signup logic

## assets/
- images/: Contains favicon.png, icon.png

## components/
- TabBar.tsx: Custom tab bar component

## hooks/
- useFrameworkReady.ts: Custom hook for framework readiness

## services/
- authService.ts: Handles authentication
- cheatingDetectionService.ts: Cheating detection logic
- mockData.ts: Mock data for development/testing
- ocrService.ts: OCR logic
- pdfService.ts: PDF export logic

## types/
- index.ts: Shared TypeScript types

## utils/
- constants.ts: Shared constants

## Configuration
- package.json: Dependencies and scripts
- tsconfig.json: TypeScript config
- app.json: Expo app config
- expo-env.d.ts: Expo environment types
- .gitignore, .npmrc, .prettierrc: Project settings

---
This file provides a quick reference to the codebase structure and the purpose of each major file/folder.
