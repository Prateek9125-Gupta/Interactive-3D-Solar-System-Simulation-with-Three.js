const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true
});

const setRendererSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
};
setRendererSize();

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020c1b');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 50);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 200;
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = 0;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.enableTouch = true; 


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x88ccff, 1);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Tooltip div
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px 10px';
tooltip.style.borderRadius = '5px';
tooltip.style.pointerEvents = 'none';
tooltip.style.fontSize = '14px';
tooltip.style.display = 'none';
tooltip.style.zIndex = '999';
document.body.appendChild(tooltip);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const planetIndex = planets.indexOf(intersected);
        tooltip.innerText = planetData[planetIndex].name;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.display = 'block';
    } else {
        tooltip.style.display = 'none';
    }
});

// Star texture 
function createStarTexture() {
    const size = 64;
    const starCanvas = document.createElement('canvas');
    starCanvas.width = size;
    starCanvas.height = size;
    const ctx = starCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.2, '#ffffff');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(starCanvas);
}

const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
    );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    map: createStarTexture(),
    transparent: true,
    alphaTest: 0.05,
    depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
const sunTexture = new THREE.TextureLoader().load(
    './textures/planets/sun.jpg',
    undefined, 
    undefined, 
    (err) => {
        console.error('Error loading sun texture:', err);
        sun.material = new THREE.MeshBasicMaterial({ 
            color: 0xFDB813,
            emissive: 0xffaa00,
            emissiveIntensity: 1
        });
    }
);

const sunMaterial = new THREE.MeshStandardMaterial({ 
    map: sunTexture,
    color: 0xffffff,
    emissive: 0xffaa00,
    emissiveIntensity: 1,
    roughness: 1,
    metalness: 0
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet Data
const planetData = [
    { 
        name: 'Mercury', 
        radius: 0.8, 
        orbit: 10, 
        speed: 0.006, 
        color: 0xaaaaaa,
        texture: './textures/planets/mercury.jpg'
    },
    { 
        name: 'Venus', 
        radius: 1.2, 
        orbit: 14, 
        speed: 0.004, 
        color: 0xffcc99,
        texture: './textures/planets/venus.jpg'
    },
    { 
        name: 'Earth', 
        radius: 1.3, 
        orbit: 18, 
        speed: 0.0035, 
        color: 0x3399ff,
        texture: './textures/planets/earth_atmos_2048.jpg'
    },
    {
        name: 'Mars', 
        radius: 1.1, 
        orbit: 22, 
        speed: 0.003, 
        color: 0xff3300,
        texture: './textures/planets/mars.jpg',
    },
    { 
        name: 'Jupiter', 
        radius: 2.5, 
        orbit: 28, 
        speed: 0.0023, 
        color: 0xff9966,
        texture: './textures/planets/jupiter.jpg'
    },
    { 
        name: 'Saturn', 
        radius: 2.2, 
        orbit: 34, 
        speed: 0.002, 
        color: 0xffcc66,
        texture: './textures/planets/saturn.jpg',
    },
    { 
        name: 'Uranus', 
        radius: 1.8, 
        orbit: 40, 
        speed: 0.0018, 
        color: 0x66ccff,
        texture: './textures/planets/uranus.jpg',
    },
    { 
        name: 'Neptune', 
        radius: 1.7, 
        orbit: 46, 
        speed: 0.0015, 
        color: 0x3366ff,
        texture: './textures/planets/neptune.jpg',
    }
];

const planets = [];
const planetAngles = [];
const orbits = [];

const textureLoader = new THREE.TextureLoader();


planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: data.color 
    });
    
    textureLoader.load(data.texture, 
        (texture) => {
            material.map = texture;
            material.needsUpdate = true;
        },
        undefined,
        (err) => {
            console.error(`Error loading ${data.name} texture:`, err);
        }
    );
    
    const planet = new THREE.Mesh(geometry, material);
    
    const angle = Math.random() * Math.PI * 2;
    planet.position.x = Math.cos(angle) * data.orbit;
    planet.position.z = Math.sin(angle) * data.orbit;
    
    scene.add(planet);
    planets.push(planet);
    planetAngles.push(angle);

    // Orbit path
    const orbitGeometry = new THREE.RingGeometry(data.orbit - 0.1, data.orbit + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -Math.PI / 2;
    scene.add(orbit);
    orbits.push(orbit);

    // Saturn's rings
    if(data.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(data.radius + 0.5, data.radius + 2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffe0aa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2.5;
        planet.add(ring);
    }
});

// Animation Loops
const clock = new THREE.Clock();
let isPaused = false;
let lastTime = 0;

function animate(time) {
    requestAnimationFrame(animate);

    if (window.innerWidth <= 768 && time - lastTime < 16) return;
    lastTime = time;
    
    const delta = clock.getDelta();

    if(!isPaused) {
        // Rotate planets
        planetData.forEach((data, i) => {
            planetAngles[i] += data.speed;
            planets[i].position.x = Math.cos(planetAngles[i]) * data.orbit;
            planets[i].position.z = Math.sin(planetAngles[i]) * data.orbit;
            planets[i].rotation.y += 0.01;
        });

        // Rotate sun
        sun.rotation.y += 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// UI CONTROLS
const speedControls = document.getElementById('speedControls');
const slidersContainer = document.createElement('div');
slidersContainer.className = 'planet-sliders';

planetData.forEach((data, i) => {
    const label = document.createElement('label');
    label.innerHTML = `${data.name}: <input type="range" min="0.0001" max="0.02" step="0.0001" value="${data.speed}">`;
    label.querySelector('input').addEventListener('input', (e) => {
        planetData[i].speed = parseFloat(e.target.value);
    });
    slidersContainer.appendChild(label);
});

speedControls.appendChild(slidersContainer);

const pauseBtn = document.createElement('button');
pauseBtn.textContent = '⏸ Pause';
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸ Pause';
});

const toggleBtn = document.createElement('button');
toggleBtn.textContent = '🌙 Dark Mode';
let isDark = true;
toggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    scene.background = new THREE.Color(isDark ? '#020c1b' : '#add8e6');
    toggleBtn.textContent = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
});

const orbitToggleBtn = document.createElement('button');
orbitToggleBtn.textContent = 'Hide Orbits';
let orbitsVisible = true;
orbitToggleBtn.addEventListener('click', () => {
    orbitsVisible = !orbitsVisible;
    orbitToggleBtn.textContent = orbitsVisible ? 'Hide Orbits' : 'Show Orbits';
    orbits.forEach(orbit => orbit.visible = orbitsVisible);
});

const resetViewBtn = document.createElement('button');
resetViewBtn.textContent = '🔁 Reset View';
resetViewBtn.addEventListener('click', () => {
    controls.reset();
    camera.position.set(0, 30, 50);
    controls.target.set(0, 0, 0);
});

[pauseBtn, toggleBtn, orbitToggleBtn, resetViewBtn].forEach(btn => {
    speedControls.appendChild(btn);
});

// Instructions
const instructions = document.createElement('div');
instructions.className = 'instructions';
instructions.innerHTML = '<h3>Controls:</h3>' + 
                        '<p>• Touch + drag: Rotate view</p>' +
                        '<p>• Two fingers: Pan/zoom view</p>' +
                        '<p>• Scroll: Zoom in/out</p>';
speedControls.appendChild(instructions);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setRendererSize();
    
    // Adjust controls for different screen sizes
    if (window.innerWidth <= 768) {
        speedControls.style.maxHeight = '50vh';
    } else {
        speedControls.style.position = 'fixed';
        speedControls.style.top = '10px';
        speedControls.style.right = '10px';
        speedControls.style.bottom = 'auto';
        speedControls.style.left = 'auto';
        speedControls.style.width = 'auto';
        speedControls.style.maxWidth = '90%';
        speedControls.style.maxHeight = '100vh';
        speedControls.style.borderRadius = '8px';
        speedControls.style.transform = 'translateZ(0)';
    }
});

// Prevent touch events from propagating to controls when interacting with 3D scene
renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.target === renderer.domElement) {
        e.stopPropagation();
    }
}, { passive: false });

if (window.innerWidth <= 768) {
    speedControls.style.fontSize = '12px';
    speedControls.style.position = 'fixed';
    speedControls.style.bottom = '0';
    speedControls.style.left = '0';
    speedControls.style.right = '0';
    speedControls.style.top = 'auto';
    speedControls.style.width = '100%';
    speedControls.style.maxWidth = '100%';
    speedControls.style.maxHeight = '25vh';
    speedControls.style.borderRadius = '8px 8px 0 0';
    speedControls.style.transform = 'none';
    speedControls.style.padding = '10px 15px';
    speedControls.style.border = '2px solid #00ffff';
    speedControls.style.borderBottom = 'none';
    speedControls.style.opacity='0.6';
}