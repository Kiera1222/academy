// Game Variables
let selectedAnimal = null;
let playerName = '';
let gameActive = false;
let players = {};
let scene, camera, renderer;
let playerModel, terrain;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let playerVelocity = { x: 0, y: 0, z: 0 };
let clock = new THREE.Clock();
let walkingSpeed = 0;
let animationTime = 0;
let otherPlayers = []; // Array to store other players
let rearViewActive = false; // Track if rear view is active

// Animal characteristics
const animals = {
    wolf: { 
        speed: 12, 
        turnSpeed: 2.5, 
        height: 1.2, 
        width: 1.0,
        length: 2.0,
        color: 0x8a8a8a,
        features: {
            ears: true,
            tail: true,
            longNeck: false,
            horns: false,
            stripes: false,
            tusks: false,
            spots: false
        }
    },
    tiger: { 
        speed: 14, 
        turnSpeed: 2.0, 
        height: 1.3, 
        width: 1.2,
        length: 2.2,
        color: 0xe67e22,
        features: {
            ears: true,
            tail: true,
            longNeck: false,
            horns: false,
            stripes: true,
            tusks: false,
            spots: false
        }
    },
    antelope: { 
        speed: 16, 
        turnSpeed: 1.8, 
        height: 1.5, 
        width: 0.9,
        length: 2.0,
        color: 0xd2b48c,
        features: {
            ears: true,
            tail: true,
            longNeck: false,
            horns: true,
            stripes: false,
            tusks: false,
            spots: false
        }
    },
    boar: { 
        speed: 10, 
        turnSpeed: 1.5, 
        height: 1.0, 
        width: 1.1,
        length: 1.8,
        color: 0x7f8c8d,
        features: {
            ears: true,
            tail: true,
            longNeck: false,
            horns: false,
            stripes: false,
            tusks: true,
            spots: false
        }
    },
    giraffe: { 
        speed: 8, 
        turnSpeed: 1.2, 
        height: 4.0, 
        width: 1.0,
        length: 2.5,
        color: 0xf1c40f,
        features: {
            ears: true,
            tail: true,
            longNeck: true,
            horns: true,
            stripes: false,
            tusks: false,
            spots: true
        }
    }
};

// DOM Elements
let selectionScreen, gameScreen, gameOverScreen, animalCards, playerNameInput, startGameButton, backToSelectionButton, playAgainButton, gameCanvas, playersList;

// Initialize the game
function init() {
    console.log('Initializing game...');
    
    // Get DOM elements
    selectionScreen = document.getElementById('selection-screen');
    gameScreen = document.getElementById('game-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    animalCards = document.querySelectorAll('.animal-card');
    playerNameInput = document.getElementById('player-name');
    startGameButton = document.getElementById('start-game');
    backToSelectionButton = document.getElementById('back-to-selection');
    playAgainButton = document.getElementById('play-again');
    gameCanvas = document.getElementById('game-canvas');
    playersList = document.getElementById('players');
    
    console.log('DOM elements initialized:', {
        selectionScreen: !!selectionScreen,
        gameScreen: !!gameScreen,
        gameOverScreen: !!gameOverScreen,
        animalCards: animalCards.length,
        playerNameInput: !!playerNameInput,
        startGameButton: !!startGameButton,
        backToSelectionButton: !!backToSelectionButton,
        playAgainButton: !!playAgainButton,
        gameCanvas: !!gameCanvas,
        playersList: !!playersList
    });
    
    // Add event listeners for animal selection
    animalCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            animalCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            // Set selected animal
            selectedAnimal = card.getAttribute('data-animal');
            console.log('Animal selected:', selectedAnimal);
        });
    });

    // Add event listener for start game button
    if (startGameButton) {
        startGameButton.addEventListener('click', startGame);
        console.log('Start game button listener added');
    } else {
        console.error('Start game button not found!');
    }

    // Add event listener for back to selection button
    if (backToSelectionButton) {
        backToSelectionButton.addEventListener('click', backToSelection);
        console.log('Back to selection button event listener added');
    } else {
        console.error('Back to selection button not found!');
    }

    // Add event listener for play again button
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            gameOverScreen.classList.remove('active');
            selectionScreen.classList.add('active');
            console.log('Play again clicked, returning to selection screen');
        });
    }

    // Add listeners for keyboard controls
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    console.log('Keyboard event listeners added');
    
    console.log('Game initialization complete');
}

// Load 3D models
function loadModels() {
    console.log('Loading 3D models...');
    
    // Create a loading manager to track progress
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item, loaded, total) {
        console.log(`Loading model: ${loaded}/${total} - ${item}`);
    };
    
    loadingManager.onError = function(url) {
        console.error('Error loading model:', url);
    };
    
    // Create loaders for different formats
    const gltfLoader = new THREE.GLTFLoader(loadingManager);
    let objLoader;
    
    // Check if OBJLoader is available and create it if needed
    if (typeof THREE.OBJLoader !== 'undefined') {
        objLoader = new THREE.OBJLoader(loadingManager);
        console.log('OBJLoader available');
    } else {
        console.log('OBJLoader not available, will try to load only GLB/GLTF models');
    }
    
    // Model paths with fallbacks
    const modelPaths = {
        wolf: [
            'assets/models/wolf.glb',
            'assets/models/wolf/wolf.obj',
            'assets/models/wolf/wolf.gltf'
        ],
        tiger: [
            'assets/models/tiger.glb',
            'assets/models/tiger/tiger.obj',
            'assets/models/tiger/tiger.gltf'
        ],
        antelope: [
            'assets/models/antelope.glb',
            'assets/models/antelope/antelope.obj',
            'assets/models/antelope/antelope.gltf'
        ],
        boar: [
            'assets/models/boar.glb',
            'assets/models/boar/boar.obj',
            'assets/models/boar/boar.gltf'
        ],
        giraffe: [
            'assets/models/giraffe.glb',
            'assets/models/giraffe/giraffe.obj',
            'assets/models/giraffe/giraffe.gltf'
        ],
        human: [
            'assets/models/human.glb',
            'assets/models/human/human.obj',
            'assets/models/human/human.gltf'
        ]
    };
    
    // Object to store loaded models
    const models = {};
    
    // Function to load a model with fallbacks
    function loadModel(name, paths) {
        return new Promise((resolve, reject) => {
            // Try to load the first path
            tryLoadModel(name, paths, 0, resolve, reject);
        });
    }
    
    // Helper function to try loading a model with fallbacks
    function tryLoadModel(name, paths, index, resolve, reject) {
        if (index >= paths.length) {
            console.error(`Failed to load model ${name} after trying all paths`);
            reject(new Error(`Failed to load model ${name}`));
            return;
        }
        
        const path = paths[index];
        console.log(`Trying to load ${name} from ${path}`);
        
        // Determine which loader to use based on file extension
        const extension = path.split('.').pop().toLowerCase();
        
        if (extension === 'glb' || extension === 'gltf') {
            gltfLoader.load(
                path,
                function(gltf) {
                    models[name] = gltf.scene;
                    console.log(`Model loaded: ${name} from ${path}`);
                    
                    // Apply textures if available
                    applyTextures(name, models[name]);
                    
                    resolve(gltf);
                },
                function(xhr) {
                    console.log(`${name} model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                function(error) {
                    console.warn(`Error loading ${name} model from ${path}:`, error);
                    // Try next path
                    tryLoadModel(name, paths, index + 1, resolve, reject);
                }
            );
        } else if (extension === 'obj' && objLoader) {
            objLoader.load(
                path,
                function(obj) {
                    models[name] = obj;
                    console.log(`Model loaded: ${name} from ${path}`);
                    
                    // Apply textures if available
                    applyTextures(name, models[name]);
                    
                    resolve(obj);
                },
                function(xhr) {
                    console.log(`${name} model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                function(error) {
                    console.warn(`Error loading ${name} model from ${path}:`, error);
                    // Try next path
                    tryLoadModel(name, paths, index + 1, resolve, reject);
                }
            );
        } else {
            console.warn(`Unsupported file format for ${path}`);
            // Try next path
            tryLoadModel(name, paths, index + 1, resolve, reject);
        }
    }
    
    // Function to apply textures to models
    function applyTextures(name, model) {
        // Check if we have textures for this model
        const texturePaths = {
            wolf: 'assets/models/textures/wolf_fur',
            tiger: 'assets/models/textures/tiger_fur',
            giraffe: 'assets/models/textures/giraffe_skin'
        };
        
        if (texturePaths[name]) {
            console.log(`Applying textures for ${name}`);
            
            const textureLoader = new THREE.TextureLoader();
            
            // Try to load diffuse/albedo texture
            try {
                const diffusePath = `${texturePaths[name]}/diffuse.jpg`;
                textureLoader.load(
                    diffusePath,
                    function(texture) {
                        console.log(`Loaded diffuse texture for ${name}`);
                        // Apply texture to all meshes in the model
                        model.traverse(function(child) {
                            if (child.isMesh) {
                                child.material.map = texture;
                                child.material.needsUpdate = true;
                            }
                        });
                    },
                    undefined,
                    function(err) {
                        console.warn(`Error loading diffuse texture for ${name}:`, err);
                    }
                );
            } catch (e) {
                console.warn(`Failed to apply diffuse texture for ${name}:`, e);
            }
            
            // Try to load normal map
            try {
                const normalPath = `${texturePaths[name]}/normal.jpg`;
                textureLoader.load(
                    normalPath,
                    function(texture) {
                        console.log(`Loaded normal map for ${name}`);
                        // Apply normal map to all meshes in the model
                        model.traverse(function(child) {
                            if (child.isMesh) {
                                child.material.normalMap = texture;
                                child.material.needsUpdate = true;
                            }
                        });
                    },
                    undefined,
                    function(err) {
                        console.warn(`Error loading normal map for ${name}:`, err);
                    }
                );
            } catch (e) {
                console.warn(`Failed to apply normal map for ${name}:`, e);
            }
        }
    }
    
    // Load all models
    const promises = [];
    for (const [name, paths] of Object.entries(modelPaths)) {
        promises.push(loadModel(name, paths));
    }
    
    // Return a promise that resolves when all models are loaded
    return Promise.all(promises.map(p => p.catch(e => {
        console.error('Model loading error:', e);
        return null; // Return null for failed models so Promise.all doesn't reject
    }))).then(results => {
        console.log('All models loaded successfully');
        return models;
    }).catch(error => {
        console.error('Failed to load models:', error);
        // Return an empty object if loading fails
        return {};
    });
}

// Create player model
function createPlayerModel(animalType, isPlayer = false) {
    console.log(`Creating ${isPlayer ? 'player' : 'AI'} model for animal type: ${animalType}`);
    
    if (!animalType || !animals[animalType]) {
        console.error(`Invalid animal type: ${animalType}`);
        return null;
    }
    
    try {
        // Create a group to hold the animal model
        const modelGroup = new THREE.Group();
        
        // Create animal body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 1.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: animals[animalType].color,
            shininess: 30
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 0.9; // Raise body above ground
        modelGroup.add(body);
        
        // Create head
        const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: animals[animalType].color,
            shininess: 30
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0.3, 0.9); // Position head at front of body
        head.castShadow = true;
        head.receiveShadow = true;
        body.add(head);
        
        // Add animal features based on type
        addAnimalFeatures(animalType, body, head);
        
        // Create legs
        const legGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: animals[animalType].color,
            shininess: 30
        });
        
        // Create and position legs
        const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontLeftLeg.position.set(0.4, -0.7, 0.5);
        frontLeftLeg.castShadow = true;
        frontLeftLeg.receiveShadow = true;
        frontLeftLeg.name = 'frontLeftLeg';
        body.add(frontLeftLeg);
        
        const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontRightLeg.position.set(-0.4, -0.7, 0.5);
        frontRightLeg.castShadow = true;
        frontRightLeg.receiveShadow = true;
        frontRightLeg.name = 'frontRightLeg';
        body.add(frontRightLeg);
        
        const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        backLeftLeg.position.set(0.4, -0.7, -0.5);
        backLeftLeg.castShadow = true;
        backLeftLeg.receiveShadow = true;
        backLeftLeg.name = 'backLeftLeg';
        body.add(backLeftLeg);
        
        const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        backRightLeg.position.set(-0.4, -0.7, -0.5);
        backRightLeg.castShadow = true;
        backRightLeg.receiveShadow = true;
        backRightLeg.name = 'backRightLeg';
        body.add(backRightLeg);
        
        // Store original leg positions for animation
        modelGroup.userData = {
            legPositions: {
                frontLeftLeg: { x: frontLeftLeg.position.x, y: frontLeftLeg.position.y, z: frontLeftLeg.position.z },
                frontRightLeg: { x: frontRightLeg.position.x, y: frontRightLeg.position.y, z: frontRightLeg.position.z },
                backLeftLeg: { x: backLeftLeg.position.x, y: backLeftLeg.position.y, z: backLeftLeg.position.z },
                backRightLeg: { x: backRightLeg.position.x, y: backRightLeg.position.y, z: backRightLeg.position.z }
            },
            animalType: animalType,
            isPlayer: isPlayer
        };
        
        // Scale the model based on animal size
        const animalData = animals[animalType];
        modelGroup.scale.set(
            animalData.width, 
            animalData.height, 
            animalData.length
        );
        
        return modelGroup;
    } catch (error) {
        console.error(`Error creating ${animalType} model:`, error);
        return null;
    }
}

// Helper function to get animal color
function getAnimalColor(animalType) {
    // Animal colors
    const animalColors = {
        wolf: 0x8a8a8a,  // 灰色
        tiger: 0xe67e22,  // 橙色
        antelope: 0xd2b48c,  // 棕褐色
        boar: 0x7f8c8d,  // 深灰色
        giraffe: 0xf1c40f  // 黃色
    };
    
    return animalColors[animalType] || 0x8bc34a;
}

// Add animal-specific features
function addAnimalFeatures(animalType, body, head) {
    if (!body || !head) return;
    
    try {
        // Add features based on animal type
        switch (animalType) {
            case 'elephant':
                // Add trunk
                const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.05, 0.8, 8);
                const trunkMaterial = new THREE.MeshPhongMaterial({ 
                    color: animals[animalType].color,
                    shininess: 30
                });
                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                trunk.position.set(0, -0.2, 0.5);
                trunk.rotation.x = Math.PI / 2;
                head.add(trunk);
                
                // Add tusks
                const tuskGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.5, 8);
                const tuskMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xFFFFF0,
                    shininess: 50
                });
                
                const leftTusk = new THREE.Mesh(tuskGeometry, tuskMaterial);
                leftTusk.position.set(0.2, -0.1, 0.4);
                leftTusk.rotation.set(Math.PI / 4, 0, Math.PI / 8);
                head.add(leftTusk);
                
                const rightTusk = new THREE.Mesh(tuskGeometry, tuskMaterial);
                rightTusk.position.set(-0.2, -0.1, 0.4);
                rightTusk.rotation.set(Math.PI / 4, 0, -Math.PI / 8);
                head.add(rightTusk);
                break;
                
            case 'giraffe':
                // Extend the neck
                body.scale.set(0.8, 1.5, 0.8);
                head.position.y = 1.0;
                
                // Add spots
                const spotsMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
                for (let i = 0; i < 12; i++) {
                    const spotSize = 0.1;
                    const spotGeometry = new THREE.BoxGeometry(spotSize, spotSize, spotSize);
                    const spot = new THREE.Mesh(spotGeometry, spotsMaterial);
                    
                    // Random position on the body
                    spot.position.set(
                        (Math.random() - 0.5) * 0.8,
                        (Math.random() - 0.5) * 1.2,
                        (Math.random() - 0.5) * 1.2
                    );
                    body.add(spot);
                }
                break;
                
            case 'lion':
                // Add mane
                const maneGeometry = new THREE.SphereGeometry(0.5, 8, 8);
                const maneMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xC19A6B,
                    shininess: 20
                });
                const mane = new THREE.Mesh(maneGeometry, maneMaterial);
                mane.position.set(0, 0.2, 0);
                mane.scale.set(1.2, 1.2, 1.2);
                head.add(mane);
                break;
                
            case 'tiger':
                // Add stripes
                const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
                for (let i = 0; i < 6; i++) {
                    const stripeGeometry = new THREE.BoxGeometry(1.1, 0.1, 1.6);
                    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
                    stripe.position.y = -0.3 + i * 0.2;
                    body.add(stripe);
                }
                break;
                
            case 'zebra':
                // Add stripes
                const zebraStripeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
                for (let i = 0; i < 8; i++) {
                    const stripeGeometry = new THREE.BoxGeometry(1.1, 0.1, 1.6);
                    const stripe = new THREE.Mesh(stripeGeometry, zebraStripeMaterial);
                    stripe.position.y = -0.3 + i * 0.15;
                    body.add(stripe);
                }
                break;
                
            default:
                // Add generic features for other animals
                // Add ears
                const earGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
                const earMaterial = new THREE.MeshPhongMaterial({ 
                    color: animals[animalType].color,
                    shininess: 30
                });
                
                const leftEar = new THREE.Mesh(earGeometry, earMaterial);
                leftEar.position.set(0.4, 0.4, 0);
                head.add(leftEar);
                
                const rightEar = new THREE.Mesh(earGeometry, earMaterial);
                rightEar.position.set(-0.4, 0.4, 0);
                head.add(rightEar);
                break;
        }
        
        // Add eyes to all animals
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.25, 0.1, 0.4);
        head.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.25, 0.1, 0.4);
        head.add(rightEye);
        
        // Add pupils
        const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, 0.05);
        leftEye.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0, 0, 0.05);
        rightEye.add(rightPupil);
        
        // Add tail
        const tailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 0.8, 8);
        const tailMaterial = new THREE.MeshPhongMaterial({ 
            color: animals[animalType].color,
            shininess: 30
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(0, 0.3, -0.8);
        tail.rotation.x = Math.PI / 3;
        body.add(tail);
        
        // Store tail for animation
        // modelGroup.userData.tail = tail;
        
    } catch (error) {
        console.error(`Error adding features for ${animalType}:`, error);
    }
}

// Initialize Three.js scene
function initThreeJS() {
    console.log('Initializing Three.js...');
    
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, -10);
        camera.lookAt(0, 0, 0);
        
        // Get the canvas element
        const gameCanvas = document.getElementById('game-canvas');
        if (!gameCanvas) {
            console.error('Game canvas element not found!');
            return false;
        }
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            canvas: gameCanvas
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
        // Log renderer info
        console.log('Renderer info:', {
            domElement: !!renderer.domElement,
            size: {
                width: renderer.domElement.width,
                height: renderer.domElement.height
            },
            canvas: !!document.getElementById('game-canvas')
        });
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        scene.add(directionalLight);
        
        // Add window resize handler
        window.addEventListener('resize', onWindowResize);
        
        console.log('Three.js initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Three.js:', error);
        return false;
    }
}

// Start the game
function startGame() {
    console.log('Starting game...');
    playerName = playerNameInput.value.trim();
    console.log('Player name:', playerName);
    console.log('Selected animal:', selectedAnimal);
    

    // Validate inputs
    if (!selectedAnimal) {
        console.error('No animal selected!');
        alert('Please select an animal to ride!');
        return;
    }
    
    if (!animals[selectedAnimal]) {
        console.error(`Selected animal "${selectedAnimal}" not found in animals object!`);
        console.log('Available animals:', Object.keys(animals));
        alert('Invalid animal selected. Please try again.');
        return;
    }
    
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    
    // Debug DOM elements
    console.log('Selection screen exists:', !!selectionScreen);
    console.log('Game screen exists:', !!gameScreen);
    
    // Hide selection screen and show game screen
    selectionScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // Make sure game canvas is visible
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
        gameCanvas.style.display = 'block';
        gameCanvas.style.width = '100%';
        gameCanvas.style.height = '100%';
        console.log('Game canvas styles set:', {
            display: gameCanvas.style.display,
            width: gameCanvas.style.width,
            height: gameCanvas.style.height
        });
    }
    
    // Initialize 3D scene immediately
    console.log('Initializing Three.js...');
    
    // Initialize Three.js
    if (!initThreeJS()) {
        console.error('Failed to initialize Three.js');
        alert('Failed to start the game. Please try again.');
        selectionScreen.classList.add('active');
        gameScreen.classList.remove('active');
        return;
    }
    
    // Create player model
    playerModel = createPlayerModel(selectedAnimal, true);
    
    // Add player model to scene
    if (playerModel) {
        scene.add(playerModel);
        console.log('Player model added to scene');
        
        // Position player model
        playerModel.position.set(0, 0, 0);
        camera.position.set(0, 5, -10);
        camera.lookAt(playerModel.position);
    } else {
        console.error('Failed to create player model');
        alert('Failed to create player model. Please try again.');
        selectionScreen.classList.add('active');
        gameScreen.classList.remove('active');
        return;
    }
    
    // Create terrain
    createTerrain();
    
    // Add terrain to scene
    if (terrain) {
        scene.add(terrain);
        console.log('Terrain added to scene');
    } else {
        console.error('Failed to create terrain');
    }
    
    // Initialize simulated players
    initSimulatedPlayers();
    console.log('Simulated players initialized');
    
    // Start game loop
    gameActive = true;
    console.log('Game active set to:', gameActive);
    clock = new THREE.Clock();
    animate();
    console.log('Game loop started');
    
    // Force a resize to ensure everything is sized correctly
    onWindowResize();
}

// Create terrain
function createTerrain() {
    // Create a large plane for the ground
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    groundGeometry.rotateX(-Math.PI / 2); // Rotate to be horizontal
    
    // Create texture for the ground
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8BC34A, // Green color as fallback
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Try to load texture if available
    try {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('assets/images/grass.jpg', 
            function(texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(100, 100);
                groundMaterial.map = texture;
                groundMaterial.needsUpdate = true;
            },
            undefined,
            function(err) {
                console.log('Error loading texture:', err);
            }
        );
    } catch (e) {
        console.log('Texture loading not supported or error occurred:', e);
    }
    
    terrain = new THREE.Mesh(groundGeometry, groundMaterial);
    terrain.receiveShadow = true;
    scene.add(terrain);
    
    // Add some trees and rocks (simplified for now)
    for (let i = 0; i < 100; i++) {
        const treeGeometry = new THREE.CylinderGeometry(0, 4, 10, 4);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        
        // Random position within a 500x500 area
        tree.position.x = Math.random() * 1000 - 500;
        tree.position.z = Math.random() * 1000 - 500;
        tree.position.y = 5; // Half height of the tree
        
        tree.castShadow = true;
        tree.receiveShadow = true;
        scene.add(tree);
    }
    
    // Add a river
    const riverGeometry = new THREE.PlaneGeometry(20, 1000, 10, 10);
    riverGeometry.rotateX(-Math.PI / 2);
    
    const riverMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4169E1,
        transparent: true,
        opacity: 0.8
    });
    
    const river = new THREE.Mesh(riverGeometry, riverMaterial);
    river.position.y = 0.1; // Slightly above ground to avoid z-fighting
    scene.add(river);
    
    // Add beach and ocean at the edge
    const beachGeometry = new THREE.PlaneGeometry(2000, 100, 10, 10);
    beachGeometry.rotateX(-Math.PI / 2);
    
    const beachMaterial = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.position.z = 950;
    beach.position.y = 0.05;
    scene.add(beach);
    
    const oceanGeometry = new THREE.PlaneGeometry(2000, 1000, 10, 10);
    oceanGeometry.rotateX(-Math.PI / 2);
    
    const oceanMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0000CD,
        transparent: true,
        opacity: 0.8
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.position.z = 1500;
    ocean.position.y = 0;
    scene.add(ocean);
}

// Initialize simulated players (no Socket.io)
function initSimulatedPlayers() {
    console.log('Initializing simulated players');
    
    // Clear existing players
    otherPlayers = [];
    
    // Create 5 simulated players with different animals
    const animalTypes = Object.keys(animals);
    const playerNames = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'];
    
    for (let i = 0; i < 5; i++) {
        // Choose a random animal type different from the player's
        let animalType;
        do {
            animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        } while (animalType === selectedAnimal);
        
        // Create player model
        const model = createPlayerModel(animalType);
        
        // Position the player randomly on the terrain
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        model.position.set(x, 0, z);
        
        // Random rotation
        model.rotation.y = Math.random() * Math.PI * 2;
        
        // Add to scene
        scene.add(model);
        
        // Add to players array
        otherPlayers.push({
            name: playerNames[i],
            model: model,
            animalType: animalType,
            speed: 0,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize(),
            nextDirectionChange: Math.random() * 5 + 3,
            nextSpeedChange: Math.random() * 3 + 1
        });
    }
    
    console.log('Simulated players initialized:', otherPlayers.length);
}

// Create model for other players
function createOtherPlayerModel(animalType, position) {
    // Create a model for another player
    const model = createPlayerModel(animalType);
    
    // Set the position
    model.position.copy(position);
    
    // Store the model in the player object
    return model;
}

// Update the players list in the UI
function updatePlayersList() {
    // Clear the list
    playersList.innerHTML = '';
    
    // Add each player to the list
    Object.keys(players).forEach(name => {
        const playerItem = document.createElement('li');
        playerItem.textContent = `${name} (${players[name].animal})`;
        playersList.appendChild(playerItem);
    });
}

// Handle keydown events
function onKeyDown(event) {
    console.log('Key down event:', event.code, 'Game active:', gameActive);
    
    if (!gameActive) {
        console.log('Game not active, ignoring key press');
        return;
    }
    
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            console.log('Move forward set to true');
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            console.log('Move backward set to true');
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            console.log('Move left set to true');
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            console.log('Move right set to true');
            break;
        case 'KeyR':
            // Toggle rear view camera
            rearViewActive = !rearViewActive;
            console.log('Rear view toggled:', rearViewActive);
            break;
        case 'KeyB':
            // Back to selection screen shortcut
            console.log('B key pressed, going back to selection screen');
            backToSelection();
            break;
        case 'Escape':
            // Toggle pause
            gameActive = !gameActive;
            console.log('Game active toggled to:', gameActive);
            if (gameActive) {
                animate();
            }
            break;
    }
}

// Handle keyup events
function onKeyUp(event) {
    console.log('Key up event:', event.code, 'Game active:', gameActive);
    
    if (!gameActive) return;
    
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

// Animation loop
function animate() {
    if (!gameActive) {
        console.log('Game not active, animation loop stopped');
        return;
    }
    
    // Request next frame
    requestAnimationFrame(animate);
    
    try {
        // Calculate delta time
        const delta = clock.getDelta();
        
        // Update animation time
        animationTime += delta;
        
        // Debug info
        if (animationTime < 10) { // Show debug for first 10 seconds
            console.log('Animation frame:', {
                time: animationTime.toFixed(2),
                scene: !!scene,
                camera: !!camera,
                renderer: !!renderer,
                playerModel: !!playerModel,
                terrain: !!terrain,
                gameActive: gameActive,
                selectedAnimal: selectedAnimal,
                playerPosition: playerModel ? JSON.stringify(playerModel.position) : 'N/A',
                cameraPosition: camera ? JSON.stringify(camera.position) : 'N/A'
            });
        }
        
        // Update player movement
        updatePlayerMovement(delta);
        
        // Update simulated players
        updateSimulatedPlayers(delta);
        
        // Animate models
        animateModels();
        
        // Render scene
        if (scene && camera && renderer) {
            renderer.render(scene, camera);
        } else {
            console.error('Cannot render: scene, camera, or renderer is not initialized');
            console.log({
                scene: !!scene,
                camera: !!camera,
                renderer: !!renderer
            });
        }
    } catch (error) {
        console.error('Error in animation loop:', error);
        gameActive = false;
        alert('An error occurred in the game. Please refresh the page and try again.');
    }
}

// Update player movement
function updatePlayerMovement(delta) {
    console.log('Updating player movement, playerModel exists:', !!playerModel);
    
    if (!playerModel) {
        console.error('Player model is not defined!');
        return;
    }
    
    // Get animal characteristics with fallbacks for safety
    const animalType = selectedAnimal || 'wolf'; // Default to wolf if no animal selected
    if (!animals[animalType]) {
        console.error('Invalid animal type:', animalType);
        return;
    }
    
    const speed = animals[animalType].speed;
    const turnSpeed = animals[animalType].turnSpeed;
    
    console.log('Movement state:', { 
        moveForward, 
        moveBackward, 
        moveLeft, 
        moveRight,
        selectedAnimal,
        speed,
        turnSpeed,
        playerPosition: playerModel.position
    });
    
    // Rotate the player model
    if (moveLeft) {
        playerModel.rotation.y += turnSpeed * delta;
        console.log('Rotating left, new rotation:', playerModel.rotation.y);
    }
    if (moveRight) {
        playerModel.rotation.y -= turnSpeed * delta;
        console.log('Rotating right, new rotation:', playerModel.rotation.y);
    }
    
    // Calculate forward/backward direction
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerModel.rotation.y);
    
    // Move the player model
    if (moveForward) {
        playerModel.position.x += direction.x * speed * delta;
        playerModel.position.z += direction.z * speed * delta;
        walkingSpeed = Math.min(walkingSpeed + delta * 2, 1.0); // Gradual acceleration
        console.log('Moving forward, new position:', playerModel.position);
    }
    else if (moveBackward) {
        playerModel.position.x -= direction.x * speed * delta * 0.5; // Slower backward movement
        playerModel.position.z -= direction.z * speed * delta * 0.5;
        walkingSpeed = Math.min(walkingSpeed + delta * 2, 0.7); // Gradual acceleration for backward
        console.log('Moving backward, new position:', playerModel.position);
    }
    else {
        // Gradual deceleration
        walkingSpeed = Math.max(walkingSpeed - delta * 3, 0);
    }
    
    // Update camera position
    const animalHeight = animals[selectedAnimal].height;
    
    // Determine camera position based on view mode
    let cameraOffset;
    if (rearViewActive) {
        // Rear view camera (in front of the player looking back)
        cameraOffset = new THREE.Vector3(0, animalHeight * 1.5, 8);
    } else {
        // Normal camera (behind the player)
        cameraOffset = new THREE.Vector3(0, animalHeight * 1.5, -8);
    }
    
    // Apply player rotation to camera offset
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerModel.rotation.y);
    
    // Smooth camera following
    const cameraLerpFactor = 5.0 * delta; // Adjust this for smoother camera movement
    camera.position.x += (playerModel.position.x + cameraOffset.x - camera.position.x) * cameraLerpFactor;
    camera.position.y += (playerModel.position.y + cameraOffset.y - camera.position.y) * cameraLerpFactor;
    camera.position.z += (playerModel.position.z + cameraOffset.z - camera.position.z) * cameraLerpFactor;
    
    // Look at a point based on view mode
    if (rearViewActive) {
        // In rear view, look back at the player
        const lookBehindPoint = new THREE.Vector3(
            playerModel.position.x,
            playerModel.position.y + animalHeight * 0.8,
            playerModel.position.z
        );
        camera.lookAt(lookBehindPoint);
    } else {
        // Normal view, look ahead of the player
        const lookAtPoint = new THREE.Vector3(
            playerModel.position.x,
            playerModel.position.y + animalHeight * 0.8,
            playerModel.position.z
        );
        camera.lookAt(lookAtPoint);
    }
    
    // Update player position in the players object
    if (players[playerName]) {
        players[playerName].position = {
            x: playerModel.position.x,
            y: playerModel.position.y,
            z: playerModel.position.z
        };
        players[playerName].rotation = playerModel.rotation.y;
    }
    
    // Check for boundaries
    if (Math.abs(playerModel.position.x) > 1000 || Math.abs(playerModel.position.z) > 1000) {
        // Player has gone too far, show game over
        gameActive = false;
        gameScreen.classList.remove('active');
        gameOverScreen.classList.add('active');
    }
}

// Update simulated players
function updateSimulatedPlayers(delta) {
    // Update simulated players
    Object.keys(players).forEach(name => {
        if (name !== playerName) {
            const player = players[name];
            const now = Date.now();
            
            // Only update every 100ms to reduce jitter
            if (now - player.lastUpdate > 100) {
                player.lastUpdate = now;
                
                // Random movement
                if (Math.random() < 0.02) {
                    // Change direction
                    player.rotation = Math.random() * Math.PI * 2;
                }
                
                if (Math.random() < 0.01) {
                    // Toggle walking
                    player.walkingSpeed = player.walkingSpeed > 0 ? 0 : animals[player.type].speed * 0.5;
                }
                
                // Move player
                if (player.walkingSpeed > 0) {
                    const moveX = Math.sin(player.rotation) * player.walkingSpeed * delta;
                    const moveZ = Math.cos(player.rotation) * player.walkingSpeed * delta;
                    
                    player.position.x += moveX;
                    player.position.z += moveZ;
                    
                    // Keep within bounds
                    const maxDistance = 150;
                    if (player.position.length() > maxDistance) {
                        // If too far, turn back toward center
                        player.direction.set(
                            -player.model.position.x,
                            0,
                            -player.model.position.z
                        ).normalize();
                        
                        player.model.rotation.y = Math.atan2(player.direction.x, player.direction.z);
                    }
                }
                
                // Update model position and rotation
                if (player.model) {
                    player.model.position.copy(player.position);
                    player.model.rotation.y = player.rotation;
                }
            }
        }
    });
}

// Animate models
function animateModels() {
    // Animate player model
    if (playerModel && playerModel.children && playerModel.children.length > 0) {
        animateLegs(playerModel, walkingSpeed);
    }
    
    // Animate simulated players
    otherPlayers.forEach(player => {
        if (player.model && player.model.children && player.model.children.length > 0) {
            animateLegs(player.model, player.speed);
        }
    });
}

// Animate animal legs
function animateLegs(model, speed) {
    if (!model || !model.children || model.children.length === 0) {
        return;
    }
    
    try {
        const body = model.children[0];
        if (!body) return;
        
        // Find legs by name
        const frontLeftLeg = body.getObjectByName('frontLeftLeg');
        const frontRightLeg = body.getObjectByName('frontRightLeg');
        const backLeftLeg = body.getObjectByName('backLeftLeg');
        const backRightLeg = body.getObjectByName('backRightLeg');
        
        if (!frontLeftLeg || !frontRightLeg || !backLeftLeg || !backRightLeg) {
            console.warn('Could not find all legs for animation');
            return;
        }
        
        // Get original positions
        const legPositions = model.userData.legPositions;
        if (!legPositions) {
            console.warn('Leg positions not found in model userData');
            return;
        }
        
        // Only animate if moving
        if (speed > 0.1) {
            // Calculate leg swing based on time
            const swingAmount = Math.sin(animationTime * 10 * (speed / 5)) * 0.2;
            
            // Animate front left and back right legs together
            frontLeftLeg.rotation.x = swingAmount;
            backRightLeg.rotation.x = -swingAmount;
            
            // Animate front right and back left legs together (opposite phase)
            frontRightLeg.rotation.x = -swingAmount;
            backLeftLeg.rotation.x = swingAmount;
        } else {
            // Reset leg rotations when not moving
            frontLeftLeg.rotation.x = 0;
            frontRightLeg.rotation.x = 0;
            backLeftLeg.rotation.x = 0;
            backRightLeg.rotation.x = 0;
        }
    } catch (error) {
        console.error('Error animating legs:', error);
    }
}

// Handle window resize
function onWindowResize() {
    console.log('Window resize event triggered');
    
    if (!camera || !renderer) {
        console.error('Cannot resize: camera or renderer is not initialized');
        return;
    }
    
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Make sure the game canvas is properly sized
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
        gameCanvas.style.width = '100%';
        gameCanvas.style.height = '100%';
        
        const rendererDom = renderer.domElement;
        // Check if the renderer's DOM element is already the game canvas
        if (rendererDom !== gameCanvas) {
            // If the renderer is not attached to the game canvas, attach it
            while (gameCanvas.firstChild) {
                gameCanvas.removeChild(gameCanvas.firstChild);
            }
            gameCanvas.appendChild(rendererDom);
            console.log('Reattached renderer to game canvas during resize');
        }
    }
}

// Initialize simulated players
function initSimulatedPlayers() {
    console.log('Initializing simulated players...');
    
    // Clear existing players
    otherPlayers = [];
    
    // Create 5 simulated players with different animals
    const animalTypes = Object.keys(animals);
    const playerNames = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'];
    
    for (let i = 0; i < 5; i++) {
        // Choose a random animal type different from the player's
        let animalType;
        do {
            animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        } while (animalType === selectedAnimal);
        
        // Create player model
        const model = createPlayerModel(animalType);
        
        // Position the player randomly on the terrain
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        model.position.set(x, 0, z);
        
        // Random rotation
        model.rotation.y = Math.random() * Math.PI * 2;
        
        // Add to scene
        scene.add(model);
        
        // Add to players array
        otherPlayers.push({
            name: playerNames[i],
            model: model,
            animalType: animalType,
            speed: 0,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize(),
            nextDirectionChange: Math.random() * 5 + 3,
            nextSpeedChange: Math.random() * 3 + 1
        });
    }
    
    console.log('Simulated players initialized:', otherPlayers.length);
}

// Update simulated players
function updateSimulatedPlayers(delta) {
    for (let i = 0; i < otherPlayers.length; i++) {
        const player = otherPlayers[i];
        
        // Update timers
        player.nextDirectionChange -= delta;
        player.nextSpeedChange -= delta;
        
        // Change direction randomly
        if (player.nextDirectionChange <= 0) {
            // New random direction
            player.direction.set(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize();
            
            // Set new timer
            player.nextDirectionChange = Math.random() * 5 + 3;
            
            // Update model rotation to face direction
            player.model.rotation.y = Math.atan2(player.direction.x, player.direction.z);
        }
        
        // Change speed randomly
        if (player.nextSpeedChange <= 0) {
            // New random speed
            player.speed = Math.random() * animals[player.animalType].speed;
            
            // Sometimes stop completely
            if (Math.random() < 0.3) {
                player.speed = 0;
            }
            
            // Set new timer
            player.nextSpeedChange = Math.random() * 3 + 1;
        }
        
        // Move player
        if (player.speed > 0) {
            const moveDistance = player.speed * delta;
            player.model.position.add(player.direction.clone().multiplyScalar(moveDistance));
            
            // Keep within bounds
            const maxDistance = 150;
            if (player.model.position.length() > maxDistance) {
                // If too far, turn back toward center
                player.direction.set(
                    -player.model.position.x,
                    0,
                    -player.model.position.z
                ).normalize();
                
                player.model.rotation.y = Math.atan2(player.direction.x, player.direction.z);
            }
        }
    }
}

// Go back to selection screen
function backToSelection() {
    console.log('Going back to selection screen...');
    
    try {
        // Stop game loop
        gameActive = false;
        
        // Reset game state
        if (scene) {
            // Remove all objects from scene
            while(scene.children.length > 0) { 
                scene.remove(scene.children[0]); 
            }
        }
        
        // Reset player model and terrain
        playerModel = null;
        terrain = null;
        
        // Reset movement flags
        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;
        rearViewActive = false;
        
        // Reset other players
        otherPlayers = [];
        
        // Hide game screen and show selection screen
        if (gameScreen) gameScreen.classList.remove('active');
        if (selectionScreen) selectionScreen.classList.add('active');
        
        // Reset camera position
        if (camera) {
            camera.position.set(0, 5, -10);
            camera.lookAt(0, 0, 0);
        }
        
        // Reset clock
        clock = new THREE.Clock();
        
        // Reset animation time
        animationTime = 0;
        
        // Reset walking speed
        walkingSpeed = 0;
        
        console.log('Successfully returned to selection screen');
    } catch (error) {
        console.error('Error returning to selection screen:', error);
        // Force return to selection screen even if there's an error
        if (gameScreen) gameScreen.classList.remove('active');
        if (selectionScreen) selectionScreen.classList.add('active');
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    // Check if all required elements are available
    if (!selectionScreen) {
        console.error('Selection screen element not found!');
    }
    if (!gameScreen) {
        console.error('Game screen element not found!');
    }
    if (!gameCanvas) {
        console.error('Game canvas element not found!');
    }
    
    // Initialize the game
    init();
    
    // Additional check to ensure Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE is not defined! Three.js library might not be loaded correctly.');
        alert('Error: Three.js library not loaded. Please check your internet connection and refresh the page.');
    } else {
        console.log('Three.js library loaded successfully');
    }
}); 