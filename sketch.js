// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();

  const earthTexture = loader.load("earth.jpg");
  const moonTexture = loader.load("moon.jpg");

  // Material can be characterised by texture
  // Setup a material
  const earthMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: earthTexture,
  });

  // defining group - thinking of it as wrapping dom elemenets in a div
  const moonGroup = new THREE.Group();
  // Moon material
  const moonMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: moonTexture,
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  scene.add(earthMesh);

  //Set up Moon mesh
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5, 1, 0);
  moonMesh.scale.setScalar(0.2);
  moonGroup.add(moonMesh);
  scene.add(moonGroup);

  const light = new THREE.PointLight("white", 3);
  scene.add(light);
  light.position.set(0, 2, 0);

  //Helper to visualize light position
  scene.add(new THREE.PointLightHelper(light, 0.1));

  //Helper - scene grid visualizer
  // scene.add(new THREE.GridHelper(5, 20));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    // Update & render your scene here
    render({ time }) {
      // note that time is a property from canvas sketch
      earthMesh.rotation.y = time * 0.5;
      moonMesh.rotation.y = time * 0.1;
      moonGroup.rotation.y = time * 0.5;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
