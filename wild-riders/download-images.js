const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'assets/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

// Real animal images from public sources
const animalImages = [
  {
    name: 'wolf.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Kolm%C3%A5rden_Wolf.jpg'
  },
  {
    name: 'tiger.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Royal_Bengal_Tiger_at_Kanha_National_Park.jpg'
  },
  {
    name: 'antelope.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Impala_at_kruger_national_park.jpg'
  },
  {
    name: 'boar.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Wild_Boar_-_Sus_scrofa.jpg'
  },
  {
    name: 'giraffe.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Giraffe_Mikumi_National_Park.jpg'
  },
  {
    name: 'savanna-bg.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Namibian_Savanna.jpg'
  },
  {
    name: 'grass.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Green_Grass.JPG'
  }
];

// Download all images
console.log('Downloading animal images...');
let downloadCount = 0;
const totalImages = animalImages.length;

animalImages.forEach(img => {
  const imgPath = path.join(imagesDir, img.name);
  
  // Skip if file already exists
  if (fs.existsSync(imgPath)) {
    console.log(`Image already exists: ${img.name}`);
    downloadCount++;
    if (downloadCount === totalImages) {
      console.log('All images are ready!');
    }
    return;
  }
  
  console.log(`Downloading ${img.name} from ${img.url}...`);
  
  const file = fs.createWriteStream(imgPath);
  
  https.get(img.url, response => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${img.url}: Status code ${response.statusCode}`);
      file.close();
      fs.unlink(imgPath, () => {});
      return;
    }
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${img.name}`);
      downloadCount++;
      if (downloadCount === totalImages) {
        console.log('All images downloaded successfully!');
      }
    });
  }).on('error', err => {
    fs.unlink(imgPath, () => {});
    console.error(`Error downloading ${img.url}: ${err.message}`);
  });
});

console.log('Download process started. This may take a few moments...'); 