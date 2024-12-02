#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Install backend dependencies
echo "Installing backend dependencies..."
cd /workspaces/newsletter/site
npm install -D nodemon
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd /workspaces/newsletter/site/site-frontend
npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom
npm install

# Install TypeScript globally
echo "Installing TypeScript globally..."
npm install -g typescript

# Verify installation
echo "Verifying TypeScript installation..."
tsc --version
