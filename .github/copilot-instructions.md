# Copilot Instructions for Project Bolt Expo Starter

## Big Picture Architecture
- **Expo + React Native + TypeScript**: The app is built for mobile and web using Expo Router for navigation and modular screen/component structure.
- **Major Components**:
  - `app/`: Main screens, layouts, and navigation (including tabs and auth flows)
  - `components/`: Reusable UI elements (e.g., `TabBar.tsx`)
  - `services/`: Business logic and API abstraction (e.g., authentication, cheating detection, PDF export)
  - `hooks/`: Custom React hooks for app state and readiness
  - `types/`: Shared TypeScript types
  - `utils/`: Constants and utility functions

## Data Flow & Service Boundaries
- **Screen logic** is separated from business logic (services) and UI (components).
- **Services** handle API calls, data processing, and mock data for development.
- **Navigation** is managed via Expo Router, with layouts and tabs defined in `app/`.
- **Assets** (images/icons) are stored in `assets/images/`.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Start development server:** `npx expo start` (use this instead of npm script on Windows)
- **Build for web:** `npm run build:web`
- **Lint:** `npm run lint`
- **Update dependencies:** Follow Expo CLI suggestions after starting the app for best compatibility.

## Project-Specific Conventions
- **File Naming:** Screens and layouts use `.tsx` in `app/`, with folders for tabs and auth flows.
- **Service Pattern:** All business logic is abstracted in `services/` (e.g., `authService.ts`, `ocrService.ts`).
- **Type Safety:** Shared types in `types/index.ts`.
- **Custom Hooks:** Place reusable logic in `hooks/`.
- **Expo Router:** Use file-based routing and layouts for navigation.
- **No explicit test setup** detected; add tests in a `__tests__/` or similar folder if needed.

## Integration Points & External Dependencies
- **Expo SDK**: Core platform for mobile/web
- **React Navigation**: Tab and stack navigation
- **Third-party services**: e.g., OCR, PDF export, cheating detection
- **Font/Icon libraries**: e.g., `@expo-google-fonts/inter`, `@expo/vector-icons`, `lucide-react-native`

## Examples
- To add a new screen: create a `.tsx` file in `app/` or a subfolder, and update navigation/layout as needed.
- To add a new service: create a file in `services/` and import it in relevant screens/components.
- To use a shared type: import from `types/index.ts`.

## Key Files
- `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/auth/_layout.tsx`: Navigation structure
- `services/authService.ts`, `services/ocrService.ts`, etc.: Business logic
- `components/TabBar.tsx`: Custom UI
- `README.md`, `CODECONTEXT.md`: Project and codebase overview

---
For more details, see the README and explore the folder structure. Update this file as new conventions or workflows emerge.
