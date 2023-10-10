import {
    SphereGeometry,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    ShaderMaterial,
    TextureLoader,
    AdditiveBlending,
    BackSide,
    MeshBasicMaterial,
    Vector3,
    CanvasTexture,
    ShapeGeometry,
    DoubleSide,
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import globeVertexShader from './shaders/globe/vertex.glsl';
import globeFragmentShader from './shaders/globe/fragment.glsl';

import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl';
import * as GeoJSON from './geo.json';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Globe
const globe = new Mesh(new SphereGeometry(2.5, 90, 90), new ShaderMaterial({
    vertexShader: globeVertexShader,
    fragmentShader: globeFragmentShader,
    uniforms: {
        globeTexture: {
            value: new TextureLoader().load('./src/earth_big.jpg')
        }
    }
}));

scene.add(globe);

//Atmosphere
const atmosphere = new Mesh(new SphereGeometry(2.5, 50, 50), new ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: AdditiveBlending,
    side: BackSide
}));
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere);

// Light
// const hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 1.);
// scene.add(hemisphereLight);

// const ambientLight = new AmbientLight(0xbbbbbb, 0.3);
// ambientLight.position.set(-10, 10, -10).normalize();
// scene.add(ambientLight);

// const dirLight = new DirectionalLight(0xffffff, 0.8);
// dirLight.position.set(-800, 2000, 400);
// scene.add(dirLight);

// const dirLight2 = new DirectionalLight(0x7982f6, 1);
// dirLight2.position.set(-200, 500, 200);
// scene.add(dirLight2);

// const dirLight3 = new DirectionalLight(0x8566cc, 0.8);
// dirLight3.position.set(-200, 500, 200);
// scene.add(dirLight3);

// scene.fog = new Fog(0x535ef3, 400, 2000);

let renderer: WebGLRenderer;
let controls: OrbitControls

GeoJSON.features.forEach((feature) => {
    const lon: number = feature.geometry.coordinates[0];
    const lat: number = feature.geometry.coordinates[1];

    const position = latLonToVector3(lat, lon, 2.5);

    const markerGeometry = new SphereGeometry(0.1);
    const markerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    const marker = new Mesh(markerGeometry, markerMaterial);

    marker.position.copy(position);
    marker.scale.set(0.15, 0.15, 0.15)

    globe.add(marker);
});

const animate = () => {
    requestAnimationFrame(animate);
    // globe.rotation.x += 0.001;
    scene.rotation.y += 0.00025;

    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

export const createScene = (el: HTMLCanvasElement) => {
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 3.0;
    // controls.maxDistance = 8;
    controls.enablePan = false;
    resize();
    animate();
};

function latLonToVector3(lat: number, lon: number, radius: number) {
    const phi = (lat * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;

    const x = -radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    return new Vector3(x, y, z);
}