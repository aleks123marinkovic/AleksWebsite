// Landing overlay logic
// This must be outside the Three.js DOMContentLoaded handler!
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('landing-overlay');
  const learnMoreBox = document.getElementById('learn-more-box');
  if (overlay && learnMoreBox) {
    learnMoreBox.addEventListener('click', function() {
      overlay.setAttribute('style', 'display: none !important;');
    });
  }
});

// script.js - Only Three.js STL viewer for Glasses.STL

document.addEventListener('DOMContentLoaded', function() {
    const canvasContainer = document.getElementById('threejs-canvas');
    if (!canvasContainer) return;

    // Set fixed size for the viewer
    const width = 600;
    const height = 600;
    canvasContainer.style.width = width + 'px';
    canvasContainer.style.height = height + 'px';

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5); // Fixed camera position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    let model = null;

    // Load STL file
    const loader = new THREE.STLLoader();
    loader.load('assets/Glasses.STL', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x2194ce });
        model = new THREE.Mesh(geometry, material);
        model.scale.set(1, 1, 1); // Adjust as needed
        model.position.set(0, 0, 0);
        scene.add(model);
        console.log('STL loaded!', geometry);
    }, undefined, function(error) {
        console.error('Error loading STL:', error);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (model) model.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
});

// CAD Projects - Three rotating STL viewers in main site
function createSTLViewer(canvasId, stlPath, ScaleXYZ, rotateAxis, rotateX) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x222222, 1);
  renderer.setSize(canvas.width, canvas.height, false);

  const scene = new THREE.Scene();
  const distance = 70;
  const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(distance, distance, distance); // Isometric view
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  let model = null;
  const loader = new THREE.STLLoader();
  loader.load(stlPath, function (geometry) {
    geometry.center(); // Center the geometry for correct rotation
    const material = new THREE.MeshPhongMaterial({ color: 0x2194ce });
    model = new THREE.Mesh(geometry, material);
    model.scale.set(ScaleXYZ, ScaleXYZ, ScaleXYZ);
    model.position.set(0, 0, 0);
    if(rotateX){
      model.rotation.x = 3 * (Math.PI / 2);
    }
    scene.add(model);
  });
  

  function animate(axis) {
    requestAnimationFrame(() => animate(axis));
    if (model && axis) model.rotation[axis] += 0.01;
    renderer.render(scene, camera);
  }
  animate(rotateAxis);
}

// Only run STL viewers if the canvases exist (main site)
if (document.getElementById('cad-canvas-1')) {
  createSTLViewer('cad-canvas-1', 'assets/AssemblyBigWeapon.STL', .25, 'z', true);
  createSTLViewer('cad-canvas-2', 'assets/VisionCorrectorMountSiemens32ChannelFinal.STL', 0.5, 'y', false);
  createSTLViewer('cad-canvas-3', 'assets/HANDASSEMBLY.STL',.2, 'y', false);
} 