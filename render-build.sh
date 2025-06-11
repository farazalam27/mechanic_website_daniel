#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Build backend
npm run build

# Install and build frontend
cd client
npm install
npm run build