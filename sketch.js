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
  pixelsPerInch: 300,
  dimensions: "A4",
  units: "in",
};

// Load Shaders

const fragmentShader = require("./shader/fragment.glsl");
const vertexShader = require("./shader/vertex.glsl");

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
  //camera.position.set(3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  const geometry = new THREE.PlaneBufferGeometry(4, 4, 150, 150);

  const loader = new THREE.TextureLoader();
  const metalTexture = loader.load("city_scape.jpg");

  // Material can be characterised by texture
  // Setup a material
  const metalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      metalTexture: { value: metalTexture },
    },
    side: THREE.DoubleSide,
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
  });

  const metalMesh = new THREE.Mesh(geometry, metalMaterial);

  scene.add(metalMesh);

  const light = new THREE.PointLight("white", 3);
  scene.add(light);
  light.position.set(0, 2, 0);

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
      time += 0.25;
      metalMaterial.uniforms.time.value = time;

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
