# TRADEY Frontend

React 19 + Vite + TypeScript + Tailwind CSS 4

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Add your Firebase credentials and backend API URL
```

3. Run development server:
```bash
npm run dev
```

Frontend will start on http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t tradey-frontend .
docker run -p 3000:3000 tradey-frontend
```

## Project Structure

```
src/
├── components/      # React components
│   ├── auth/       # Login, Signup
│   ├── chat/       # Chat components
│   ├── layout/     # Header, Footer
│   ├── post/       # Post/Product cards
│   └── ui/         # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API service layer
├── store/          # Zustand stores
├── firebase/       # Firebase config
└── types/          # TypeScript types
```

## Key Technologies

- **React 19** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Zod** - Validation
- **Firebase** - Authentication

## Environment Variables

See `.env.example` for all required variables.

## Development Notes

- All API calls go through `src/services/api.ts`
- Firebase is only used for Authentication
- All data operations use backend REST API

