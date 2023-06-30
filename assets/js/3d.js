import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
let earth,
    cloud,
    earthGroup,
    stars,
    sprit,
    solarGroup,
    sun,
    planetGroup,
    camera,
    materials = [];

const canvas = document.getElementById('canvas');
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const k = width / height;
const scene = new THREE.Scene();
let camera1 = new THREE.PerspectiveCamera(75, k, 0.1, 1000);
const s = 310;
const camera2 = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1500);
camera = camera1;
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
canvas.appendChild(renderer.domElement);
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath('/assets/images/texture/');

const clock = new THREE.Clock();

const initLight = () => {
    const point = new THREE.PointLight(0xffffff);
    const ambient = new THREE.AmbientLight(0x444444, 15);
    scene.add(ambient);
    point.position.set(10, 10, 10);
    scene.add(point);
};

export const onWindowResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
};

const getSolarData = () => {
    let K = 5;
    return {
        sun: {
            name: 'Sun',
            R: 10 * K,
            URL: 'Sun.jpg'
        },

        planet: [
            {
                name: 'Mercury',
                R: 2.5 * K,
                URL: 'Mercury.jpg',
                revolutionR: 20 * K
            },
            {
                name: 'Venus',
                R: 3 * K,
                URL: 'Venus.jpg',
                revolutionR: 30 * K
            },
            {
                name: 'Earth',
                R: 3.2 * K,
                URL: 'Earth.jpg',
                revolutionR: 40 * K
            },
            {
                name: 'Mars',
                R: 2.5 * K,
                URL: 'Mars.jpg',
                revolutionR: 50 * K
            },
            {
                name: 'Jupiter',
                R: 5 * K,
                URL: 'Jupiter.jpg',
                revolutionR: 60 * K
            },
            {
                name: 'Saturn',
                sphere: {
                    R: 3.5 * K,
                    URL: 'Saturn.jpg'
                },
                ring: {
                    r: 4 * K,
                    R: 6 * K,
                    URL: 'Saturn_c.jpg'
                },
                revolutionR: 70 * K
            },
            {
                name: 'Uranus',
                sphere: {
                    R: 3.5 * K,
                    URL: 'Uranus.jpg'
                },
                ring: {
                    r: 4 * K,
                    R: 6 * K,
                    URL: 'Uranus_c.jpg'
                },
                revolutionR: 80 * K
            },
            {
                name: 'Neptune',
                R: 4 * K,
                URL: 'Neptune.jpg',
                revolutionR: 100 * K
            }
        ]
    };
};
const createMesh = (geometry, URL) => {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(URL),
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};
const createSphereMesh = (R, URL) => {
    const geometry = new THREE.SphereGeometry(R, 100, 100);
    return createMesh(geometry, URL);
};
// 行星环
const createRingPlanetMesh = (sphere_R, sphere_URL, ring_r, ring_R, ring_URL) => {
    const group = new THREE.Group();
    const sphere = createSphereMesh(sphere_R, sphere_URL);

    const geometry = new THREE.CylinderGeometry(ring_r, ring_R, 0, 100, 100, true);

    const ring = createMesh(geometry, ring_URL);
    group.add(sphere, ring);
    return group;
};
// 轨道
const circle = r => {
    const arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI, true);
    const points = arc.getPoints(5000);
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    const line = new THREE.LineLoop(geometry, material);
    line.rotateX(Math.PI / 2);
    return line;
};
function getAllMaterials(group) {
    const materials = [];

    function traverseMaterials(object) {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            materials.push(object.material);
        }

        object.children.forEach(child => {
            traverseMaterials(child);
        });
    }

    traverseMaterials(group);

    return materials;
}
export const initSolar = () => {
    camera = camera2;
    // new OrbitControls(camera, renderer.domElement);
    const Data = getSolarData();
    solarGroup = new THREE.Group();
    sun = createSphereMesh(Data.sun.R, Data.sun.URL);
    sun.name = Data.sun.name;
    solarGroup.add(sun);
    planetGroup = new THREE.Group();
    solarGroup.add(planetGroup);

    Data.planet.forEach(function (obj) {
        let planet = null;
        if (obj.ring) {
            planet = createRingPlanetMesh(obj.sphere.R, obj.sphere.URL, obj.ring.r, obj.ring.R, obj.ring.URL);
        } else {
            planet = createSphereMesh(obj.R, obj.URL);
        }
        planet.revolutionR = obj.revolutionR;
        planet.angle = 2 * Math.PI * Math.random();
        planet.name = obj.name;
        planetGroup.add(planet);
        const line = circle(obj.revolutionR);
        solarGroup.add(line);
    });
    materials = getAllMaterials(solarGroup);
    materials.forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0;
    });
    solarGroup.position.set(0, -20, 0);
    scene.add(solarGroup);
    camera.position.set(-962.64, 125.84, 149.13);
    camera.lookAt(scene.position);
};

export const toggleSolar = opacity => {
    materials.forEach(mat => {
        mat.opacity = opacity;
    });
};
export const clearSolar = () => {
    scene.remove(solarGroup);
    camera = camera1;
};

export const starForge = () => {
    initLight();
    const starQty = 20000;
    const positions = [];
    const materialOptions = {
        map: textureLoader.load('particle.png'),
        size: 1, // 点的大小
        transparent: true, // 是否使用透明度
        opacity: 0.8, // 透明度值
        blending: THREE.AdditiveBlending // 混合模式
    };

    for (let i = 0; i < starQty; i++) {
        positions.push(
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000)
        );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const starStuff = new THREE.PointsMaterial(materialOptions);

    stars = new THREE.Points(geometry, starStuff);

    scene.add(stars);
};

export const initEarth = () => {
    camera.position.z = 5;
    initLight();
    earthGroup = new THREE.Group();
    const gem = new THREE.SphereGeometry(15, 500, 500);
    const outGem = new THREE.SphereGeometry(15.01, 500, 500);

    const map = textureLoader.load('earth_diff.webp');
    const mapCloud = textureLoader.load('earth_clouds.webp');
    const spritMat = new THREE.SpriteMaterial({
        map: textureLoader.load('earth-glow.png'),
        transparent: true,
        opacity: 0.3
    });
    sprit = new THREE.Sprite(spritMat);
    sprit.scale.set(12, 12, 12);
    sprit.position.set(0, 11.3, 2.5);
    const mat = new THREE.MeshPhongMaterial({
        map
    });
    const outMat = new THREE.MeshPhongMaterial({
        map: mapCloud,
        transparent: true,
        opacity: 0.4
    });
    earth = new THREE.Mesh(gem, mat);
    earth.rotation.set(0, 10, 120);
    cloud = new THREE.Mesh(outGem, outMat);
    cloud.rotation.set(0, 120, 0);
    earthGroup.add(earth);
    earthGroup.add(cloud);
    earthGroup.add(sprit);
    earthGroup.position.set(0, -17.5, 0);
    scene.add(earthGroup);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    window.earth = earth;
    window.earthGroup = earthGroup;
};

export const upEarth = (y, z) => {
    if (earthGroup) {
        new TWEEN.Tween(earthGroup.position).to({ x: 0, y, z }, 100).start();
    }
};

export const outEarth = opacity => {
    if (earthGroup) {
        new TWEEN.Tween([earth.material, cloud.material, sprit.material]).to({ opacity }, 100).start();
    }
};

export const animate = () => {
    const delta = clock.getDelta();
    if (cloud) {
        cloud.rotation.z += 0.03 * delta;
    }
    if (stars) {
        stars.rotation.x += 0.001;
        stars.rotation.y += 0.001;
    }
    if (sun) {
        sun.rotation.y += 0.01;
    }
    if (planetGroup) {
        planetGroup.children.forEach(function (obj) {
            obj.rotation.y += 0.01;
            obj.angle += (0.005 / obj.revolutionR) * 400;
            obj.position.set(obj.revolutionR * Math.sin(obj.angle), 0, obj.revolutionR * Math.cos(obj.angle));
        });
    }
    TWEEN.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
