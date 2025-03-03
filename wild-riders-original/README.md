# Wild Riders - Multiplayer Animal Riding Game

A first-person multiplayer game where players can ride different animals across a vast savanna landscape.

## Features

- Choose from 5 different animals to ride: Great White Wolf, Tiger, Large Antelope, Wild Boar, and Giraffe
- First-person perspective riding experience
- Keyboard controls for movement (WASD or Arrow Keys)
- Multiplayer functionality to see other players
- Vast terrain with grasslands, rivers, beaches, and ocean

## Setup and Installation

1. Make sure you have Node.js installed on your computer
   - Check by running `node --version` in your terminal
   - If not installed, download it from [nodejs.org](https://nodejs.org/)

2. Navigate to the wild-riders directory in your terminal:
   ```
   cd path/to/wild-riders
   ```

3. Run the setup script to download necessary libraries and create placeholder images:
   ```
   node setup.js
   ```

4. Install dependencies:
   ```
   npm install
   ```

## How to Run

### Method 1: Using the Node.js Server (Recommended)
1. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

### Method 2: Direct File Opening
1. Open `index.html` in a web browser that supports WebGL (Chrome, Firefox, Safari, Edge)

## Game Controls
- W or Up Arrow: Move forward
- S or Down Arrow: Move backward
- A or Left Arrow: Turn left
- D or Right Arrow: Turn right
- ESC: Pause game

## Development

To run the server with automatic restart on file changes:
```
npm run dev
```

## Technical Details

This game uses:
- Three.js for 3D rendering
- Basic HTML/CSS/JavaScript for the UI
- Simple placeholder models for animals and riders

## Future Improvements

- Add more detailed animal models
- Implement actual multiplayer functionality with WebSockets
- Add collision detection
- Add more interactive elements in the environment
- Improve terrain with height variations 