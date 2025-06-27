// script.js - Only Three.js STL viewer for Glasses.STL

document.addEventListener('DOMContentLoaded', function() {
    const canvasContainer = document.getElementById('threejs-canvas');
    if (!canvasContainer) return;

    // Set fixed size for the viewer
    const width = 350;
    const height = 600;
    canvasContainer.style.width = width + 'px';
    canvasContainer.style.height = height + 'px';

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);

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
        model.scale.set(0.1, 0.1, 0.1); // Adjust as needed
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