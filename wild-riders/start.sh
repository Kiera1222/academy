#!/bin/bash

echo "Setting up Wild Riders game..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this game."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    exit 1
fi

# Run setup script
echo "Running setup script..."
node setup.js

# Download animal images
echo "Downloading animal images..."
node download-images.js

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the server
echo "Starting the game server..."
echo "Open your browser and go to http://localhost:3000"
node server.js 