#!/bin/bash

# Infisical Client Launcher
PROJECT_DIR="/Users/justinchang/dev/infisical-client"
URL="http://localhost:8394"

echo "🔐 Starting Infisical Client..."

cd "$PROJECT_DIR" || exit 1

# Check if server is already running
if curl -s "$URL" > /dev/null 2>&1; then
    echo "✓ Server already running at $URL"
    echo "📂 Opening in browser..."
    open "$URL"
    exit 0
fi

# Check if vite is installed
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "⚠️  Dependencies not found. Installing..."
    yarn install
fi

# Start the dev server in the background
echo "🚀 Starting dev server..."
yarn dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to be ready (max 30 seconds)
echo "⏳ Waiting for server to start..."
for i in {1..30}; do
    if curl -s "$URL" > /dev/null 2>&1; then
        echo "✓ Server ready at $URL"
        echo "📂 Opening in browser..."
        sleep 0.5
        open "$URL"
        echo ""
        echo "💡 Server is running in the background (PID: $DEV_PID)"
        echo "💡 To stop: kill $DEV_PID or run: pkill -f 'vite'"
        exit 0
    fi
    sleep 1
done

echo "❌ Server failed to start within 30 seconds"
echo "💡 Check logs: cd $PROJECT_DIR && yarn dev"
exit 1

