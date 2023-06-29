import * as THREE from 'three';
const canvas = document.getElementById('canvas');
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const k = width / height;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, k, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
canvas.appendChild(renderer.domElement);
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath('/assets/images/texture/');

let earth, cloud, earthGroup, stars;

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

export const starForge = () => {
    initLight();
    const starQty = 10000;
    const positions = [];
    const materialOptions = {
        map: textureLoader.load('particle.png'),
        size: 5, // 点的大小
        transparent: true, // 是否使用透明度
        opacity: 0.5, // 透明度值
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
    const sprit = new THREE.Sprite(spritMat);
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
};

export const upEarth = () => {
    new TWEEN.Tween(earthGroup.position).delay(2000).to({ x: 0, y: -21, z: 5 }, 1000).start();
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
    TWEEN.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
