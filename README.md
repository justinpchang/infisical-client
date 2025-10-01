# Infisical Secrets Browser

A local React + TypeScript application for browsing your Infisical secrets in a tree view with search functionality.

## Features

- 🔐 Secure authentication using Universal Auth
- 📂 Recursive tree view of all folders and secrets
- 🔍 Fuzzy search across secret keys and values
- 🎨 Compact, streamlined UI for browsing many secrets
- 🔗 Direct links to open folders in Infisical UI
- ⚡ Expand/collapse all children recursively
- 🚀 One-command npx launcher

## Quick Start

Run anywhere without installation:

```bash
npx @justinchang/infisical-client
```

On first run, you'll be prompted to enter your Infisical credentials:
- `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID`
- `INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET`
- `INFISICAL_PROJECT_ID`
- `INFISICAL_ENV_SLUG` (e.g., dev, prod)

The credentials will be saved to a `.env` file in the package directory for future use.

## Manual Installation

If you prefer to clone and run locally:

```bash
git clone https://github.com/justinchang/infisical-client.git
cd infisical-client
yarn install
yarn start
```

Or run the dev server directly:

```bash
yarn dev
```

The application will open at `http://localhost:8394`.

## Getting Infisical Credentials

1. Go to your Infisical project settings
2. Navigate to **Access Control** → **Machine Identities**
3. Create a new Universal Auth identity
4. Copy the Client ID and Client Secret
5. Note your Project ID (from the URL: `/project/{PROJECT_ID}/...`)
6. Choose your environment slug (dev, staging, prod, etc.)

## Usage

### Search
Type in the search box to filter secrets by key or value. Search highlights matching text and auto-expands folders containing matches.

### Folder Controls
- Click folder name to expand/collapse
- `[+]` button: Expand all children recursively
- `[-]` button: Collapse all children recursively
- `↗` link: Open folder in Infisical web UI

### Keyboard Shortcuts
- `Ctrl+C`: Stop the server

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Zod** - Runtime type validation for API responses
- **Fuse.js** - Fuzzy search

## Security Note

This application is designed for **local use only**. It displays all secret values in plain text without any masking. Do not deploy this application to any public server or expose it to the internet.

## Configuration

The application uses a `.env` file with the following variables:

```
INFISICAL_UNIVERSAL_AUTH_CLIENT_ID=your-client-id
INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET=your-client-secret
INFISICAL_PROJECT_ID=your-project-id
INFISICAL_ENV_SLUG=dev
```

## Development

```bash
# Install dependencies
yarn install

# Run type checking
yarn type-check

# Start dev server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Publishing

To publish to npm:

```bash
npm version patch  # or minor, major
npm publish --access public
```

## License

MIT

## Author

Justin Chang
