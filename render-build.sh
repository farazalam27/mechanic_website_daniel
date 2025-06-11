#!/usr/bin/env bash
# exit on error
set -o errexit

# Install all dependencies (including client via postinstall)
npm install

# Build everything
npm run build:full