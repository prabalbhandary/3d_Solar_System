import * as THREE from 'https://cdn.skypack.dev/three@0.129.0'
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;

let mercury_orbit_radius = 50
let venus_orbit_radius = 60
let earth_orbit_radius = 70
let mars_orbit_radius = 80
let jupiter_orbit_radius = 100
let saturn_orbit_radius = 120
let uranus_orbit_radius = 140
let neptune_orbit_radius = 160

let mercury_revolution_speed = 2
let venus_revolution_speed = 1.5
let earth_revolution_speed = 1
let mars_revolution_speed = 0.8
let jupiter_revolution_speed = 0.7
let saturn_revolution_speed = 0.6
let uranus_revolution_speed = 0.5
let neptune_revolution_speed = 0.4

function createMatrixArray(){
    const skyboxImagePaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
    const materialArray = skyboxImagePaths.map((image) => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    })
    return materialArray;
}

function setSkyBox(){
    const materialArray = createMatrixArray();
    let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

function createRing(outerRadius){
    let innerRadius = outerRadius - 0.1;
    let thetaSegments = 64;
    let geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    const material = new THREE.MeshBasicMaterial({color: 'grey', side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType){
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture = loader.load(texture);
    const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({map: planetTexture}) : new THREE.MeshBasicMaterial({map: planetTexture});
    const planet = new THREE.Mesh(geometry, material);
    return planet
}

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    setSkyBox();
    planet_earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard');
    planet_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic');
    planet_mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard');
    planet_venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard');
    planet_mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard');
    planet_jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard');
    planet_saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard');
    planet_uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard');
    planet_neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard');
    scene.add(planet_earth);
    scene.add(planet_sun);
    scene.add(planet_mercury);
    scene.add(planet_venus);
    scene.add(planet_mars);
    scene.add(planet_jupiter);
    scene.add(planet_saturn);
    scene.add(planet_uranus);
    scene.add(planet_neptune);
    const sunLight = new THREE.PointLight(0xffffff, 1, 0);
    sunLight.position.copy(planet_sun.position);
    scene.add(sunLight);
    createRing(mercury_orbit_radius)
    createRing(venus_orbit_radius)
    createRing(earth_orbit_radius)
    createRing(mars_orbit_radius)
    createRing(jupiter_orbit_radius)
    createRing(saturn_orbit_radius)
    createRing(uranus_orbit_radius)
    createRing(neptune_orbit_radius)
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minimumDistance = 12;
    controls.maximumDistance = 1000;
    camera.position.z = 100
    planet_earth.position.x = planet_sun.position.x + earth_orbit_radius;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function planetRevolver(time, speed, planet, orbitRadius, planetName){
    let orbitSpeedMultiplier = 0.001;
    const planetAngle = time * orbitSpeedMultiplier * speed;
    planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
    planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
}

function animate(time){
    const rotationSpeed = 0.005;
    planet_earth.rotation.y += rotationSpeed;
    planet_sun.rotation.y += rotationSpeed;
    planet_mercury.rotation.y += rotationSpeed;
    planet_venus.rotation.y += rotationSpeed;
    planet_mars.rotation.y += rotationSpeed;
    planet_jupiter.rotation.y += rotationSpeed;
    planet_saturn.rotation.y += rotationSpeed;
    planet_uranus.rotation.y += rotationSpeed;
    planet_neptune.rotation.y += rotationSpeed;
    // Revolution
    planetRevolver(time, mercury_revolution_speed, planet_mercury, mercury_orbit_radius, 'mercury')
    planetRevolver(time, venus_revolution_speed, planet_venus, venus_orbit_radius, 'venus')
    planetRevolver(time, earth_revolution_speed, planet_earth, earth_orbit_radius, 'earth')
    planetRevolver(time, mars_revolution_speed, planet_mars, mars_orbit_radius, 'mars')
    planetRevolver(time, jupiter_revolution_speed, planet_jupiter, jupiter_orbit_radius, 'jupiter')
    planetRevolver(time, saturn_revolution_speed, planet_saturn, saturn_orbit_radius, 'saturn')
    planetRevolver(time, uranus_revolution_speed, planet_uranus, uranus_orbit_radius, 'uranus')
    planetRevolver(time, neptune_revolution_speed, planet_neptune, neptune_orbit_radius, 'neptune')
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const backgroundAudio = document.getElementById('background-audio');
backgroundAudio.loop = true;

document.addEventListener('DOMContentLoaded', () => {
    backgroundAudio.play().catch(error => {
        const promptToPlay = document.createElement('div');
        promptToPlay.innerText = "Click anywhere to start the music!";
        promptToPlay.style.position = "absolute";
        promptToPlay.style.top = "50%";
        promptToPlay.style.left = "50%";
        promptToPlay.style.transform = "translate(-50%, -50%)";
        promptToPlay.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        promptToPlay.style.padding = "20px";
        promptToPlay.style.borderRadius = "10px";
        promptToPlay.style.textAlign = "center";
        document.body.appendChild(promptToPlay);

        document.body.addEventListener('click', () => {
            backgroundAudio.play().catch(error => {});
            promptToPlay.remove();
        });
    });
});


window.addEventListener('resize', onWindowResize, false);

init();

animate(0);