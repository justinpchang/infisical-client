# Infisical Secrets Browser

A local React + TypeScript application for browsing your Infisical secrets in a tree view.

## Features

- 🔐 Secure authentication using Universal Auth
- 📂 Recursive tree view of all folders and secrets
- 🔑 Display all secret values (no hiding/masking)
- 🎨 Clean, modern UI with folder expansion/collapse
- ⚡ Fast loading with Rsbuild

## Prerequisites

- Node.js 18+ and yarn
- Infisical account with Universal Auth credentials

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env` file in the root directory with your Infisical credentials:

```
INFISICAL_UNIVERSAL_AUTH_CLIENT_ID=your-client-id
INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET=your-client-secret
INFISICAL_PROJECT_ID=your-project-id
INFISICAL_ENV_SLUG=dev
```

## Usage

### Development

Start the development server:

```bash
yarn dev
```

The application will open at `http://localhost:5173`.

### Type Check

Check for TypeScript errors:

```bash
yarn type-check
```

### Build

Create a production build:

```bash
yarn build
```

### Preview

Preview the production build:

```bash
yarn preview
```

## How It Works

1. **Authentication**: The app authenticates with Infisical using Universal Auth (client ID + secret)
2. **Fetch Secrets**: It fetches all secrets recursively using the `/api/v3/secrets/raw` endpoint
3. **Build Tree**: Secrets are organized into a hierarchical tree structure based on their paths
4. **Display**: The tree view shows folders (collapsible) and secrets (with their values)

## Security Note

This application is designed for **local use only**. It displays all secret values in plain text without any masking. Do not deploy this application to any public server or expose it to the internet.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Zod** - Runtime type validation for API responses
