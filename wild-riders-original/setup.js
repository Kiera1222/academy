const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const directories = [
  'js/lib',
  'assets/images'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Download Three.js
const threeJsUrl = 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js';
const threeJsPath = path.join(__dirname, 'js/lib/three.min.js');

console.log('Downloading Three.js...');
downloadFile(threeJsUrl, threeJsPath);

// Animal images to download
const animalImages = [
  { 
    name: 'wolf.png', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/wolf.png',
    fallbackColor: '#8a8a8a', 
    shape: 'wolf' 
  },
  { 
    name: 'tiger.png', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/tiger.png',
    fallbackColor: '#e67e22', 
    shape: 'tiger' 
  },
  { 
    name: 'antelope.png', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/antelope.png',
    fallbackColor: '#d35400', 
    shape: 'antelope' 
  },
  { 
    name: 'boar.png', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/boar.png',
    fallbackColor: '#7f8c8d', 
    shape: 'boar' 
  },
  { 
    name: 'giraffe.png', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/giraffe.png',
    fallbackColor: '#f1c40f', 
    shape: 'giraffe' 
  },
  { 
    name: 'savanna-bg.jpg', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/savanna-bg.jpg',
    fallbackColor: '#8bc34a', 
    shape: 'background' 
  },
  { 
    name: 'grass.jpg', 
    url: 'https://raw.githubusercontent.com/cursor-education/academy-assets/main/wild-riders/grass.jpg',
    fallbackColor: '#4caf50', 
    shape: 'texture' 
  }
];

// Download or create placeholder images
animalImages.forEach(img => {
  const imgPath = path.join(__dirname, `assets/images/${img.name}`);
  if (!fs.existsSync(imgPath)) {
    console.log(`Downloading image for ${img.name}...`);
    
    // Try to download the image first
    downloadFile(img.url, imgPath, (success) => {
      // If download fails, create a placeholder
      if (!success) {
        console.log(`Download failed, creating placeholder for ${img.name}...`);
        createPlaceholderImage(imgPath, img.fallbackColor, img.shape);
      }
    });
  }
});

// Function to download a file with callback
function downloadFile(url, destination, callback) {
  const file = fs.createWriteStream(destination);
  
  https.get(url, response => {
    // Check if the response is successful (200 OK)
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${url}: Status code ${response.statusCode}`);
      file.close();
      fs.unlink(destination, () => {}); // Delete the file
      if (callback) callback(false);
      return;
    }
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${destination}`);
      if (callback) callback(true);
    });
  }).on('error', err => {
    fs.unlink(destination, () => {});
    console.error(`Error downloading ${url}: ${err.message}`);
    if (callback) callback(false);
  });
}

// Function to create a simple placeholder image
function createPlaceholderImage(filePath, color, shape) {
  const extension = path.extname(filePath).toLowerCase();
  
  if (extension === '.svg') {
    // Create SVG image
    const svgContent = createSVGImage(color, shape);
    fs.writeFileSync(filePath, svgContent);
  } else {
    // For PNG, JPG, etc. create a simple SVG and convert it to data URL
    const svgContent = createSVGImage(color, shape);
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // For simplicity in this example, we'll just save the SVG with the original extension
    // In a real implementation, you would use a library like sharp to convert to PNG/JPG
    fs.writeFileSync(filePath, svgContent);
  }
  
  console.log(`Created placeholder: ${filePath}`);
}

// Function to create SVG content based on shape
function createSVGImage(color, shape) {
  let svgContent = '';
  
  switch (shape) {
    case 'wolf':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" opacity="0.2"/>
        <circle cx="30" cy="30" r="15" fill="${color}"/>
        <circle cx="70" cy="30" r="15" fill="${color}"/>
        <path d="M20,60 Q50,80 80,60" stroke="${color}" stroke-width="5" fill="none"/>
        <path d="M50,50 L60,70 L50,65 L40,70 L50,50" fill="${color}"/>
        <text x="50" y="20" font-family="Arial" font-size="10" text-anchor="middle" fill="${color}">Wolf</text>
      </svg>`;
      break;
    case 'tiger':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" opacity="0.2"/>
        <circle cx="30" cy="30" r="15" fill="${color}"/>
        <circle cx="70" cy="30" r="15" fill="${color}"/>
        <path d="M20,60 Q50,80 80,60" stroke="${color}" stroke-width="5" fill="none"/>
        <path d="M50,50 L60,70 L50,65 L40,70 L50,50" fill="${color}"/>
        <path d="M10,10 L20,20 M30,10 L40,20 M50,10 L60,20 M70,10 L80,20" stroke="${color}" stroke-width="2"/>
        <text x="50" y="20" font-family="Arial" font-size="10" text-anchor="middle" fill="${color}">Tiger</text>
      </svg>`;
      break;
    case 'antelope':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" opacity="0.2"/>
        <circle cx="30" cy="40" r="15" fill="${color}"/>
        <circle cx="70" cy="40" r="15" fill="${color}"/>
        <path d="M20,70 Q50,90 80,70" stroke="${color}" stroke-width="5" fill="none"/>
        <path d="M30,20 L40,5 L50,20" stroke="${color}" stroke-width="3" fill="none"/>
        <path d="M50,20 L60,5 L70,20" stroke="${color}" stroke-width="3" fill="none"/>
        <text x="50" y="30" font-family="Arial" font-size="10" text-anchor="middle" fill="${color}">Antelope</text>
      </svg>`;
      break;
    case 'boar':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" opacity="0.2"/>
        <ellipse cx="50" cy="50" rx="40" ry="25" fill="${color}"/>
        <circle cx="30" cy="40" r="8" fill="#fff"/>
        <circle cx="70" cy="40" r="8" fill="#fff"/>
        <circle cx="30" cy="40" r="4" fill="#000"/>
        <circle cx="70" cy="40" r="4" fill="#000"/>
        <path d="M50,50 L60,60 L50,55 L40,60 L50,50" fill="#fff"/>
        <path d="M20,40 L10,30 M80,40 L90,30" stroke="${color}" stroke-width="3"/>
        <text x="50" y="80" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">Boar</text>
      </svg>`;
      break;
    case 'giraffe':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" opacity="0.2"/>
        <path d="M50,80 L50,20 L45,10 L50,5 L55,10 L50,20" fill="${color}" stroke="#000" stroke-width="1"/>
        <circle cx="50" cy="5" r="3" fill="${color}"/>
        <rect x="40" y="80" width="20" height="15" fill="${color}"/>
        <circle cx="45" cy="8" r="1" fill="#000"/>
        <circle cx="55" cy="8" r="1" fill="#000"/>
        <path d="M45,15 Q50,18 55,15" stroke="#000" fill="none"/>
        <path d="M30,80 L40,80 M60,80 L70,80" stroke="${color}" stroke-width="3"/>
        <text x="50" y="95" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Giraffe</text>
      </svg>`;
      break;
    case 'background':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}"/>
        <path d="M0,70 Q20,60 40,70 Q60,80 80,70 Q100,60 100,70 L100,100 L0,100 Z" fill="#d35400"/>
        <circle cx="80" cy="20" r="10" fill="#f1c40f"/>
        <path d="M20,80 L25,70 L30,80 M40,80 L45,65 L50,80 M60,80 L65,70 L70,80 M80,80 L85,65 L90,80" stroke="#2ecc71" stroke-width="2"/>
        <text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">Savanna Background</text>
      </svg>`;
      break;
    case 'texture':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}"/>
        <path d="M10,10 L15,15 M30,20 L35,25 M50,30 L55,35 M70,40 L75,45 M90,50 L95,55" stroke="#8bc34a" stroke-width="1"/>
        <path d="M10,90 L15,85 M30,80 L35,75 M50,70 L55,65 M70,60 L75,55 M90,50 L95,45" stroke="#8bc34a" stroke-width="1"/>
        <text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">Grass Texture</text>
      </svg>`;
      break;
    default:
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}"/>
        <text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">Placeholder</text>
      </svg>`;
  }
  
  return svgContent;
}

console.log('Setup complete! Run "node server.js" to start the game server.'); 