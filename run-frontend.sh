#!/bin/bash

echo "Starting Daniel's Mechanic Shop Frontend (Mock Data Mode)"
echo "========================================================"
echo "This script runs the frontend with mock data, no backend required."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if node_modules exists in client directory
if [ ! -d "client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client && npm install
    cd ..
else
    echo "Frontend dependencies already installed."
fi

# Run the frontend
echo ""
echo "Starting frontend server..."
echo "The application will open in your default browser."
echo ""
npm run frontend:only