import * as THREE from 'three';

const solarGroup = new THREE.Group();
let sun, planetGroup;
let Data = data();
sun = createSphereMesh(Data.sun.R, Data.sun.URL);
sun.name = Data.sun.name;
solarGroup.add(sun);
planetGroup = new THREE.Group();
solarGroup.add(planetGroup);
Data.planet.forEach(function (obj) {
    let planet = null;
    if (obj.ring) {
        planet = createringPlanetMesh(obj.sphere.R, obj.sphere.URL, obj.ring.r, obj.ring.R, obj.ring.URL);
    } else {
        planet = createSphereMesh(obj.R, obj.URL);
    }
    planet.revolutionR = obj.revolutionR;
    planet.angle = 2 * Math.PI * Math.random();
    planet.name = obj.name;
    planetGroup.add(planet);
    intersectsArr.push(planet);
    const line = circle(obj.revolutionR);
    solarGroup.add(line);
});

screen.add(solarGroup);

let clock = new THREE.Clock();

function render() {
    if (solarGroup) {
        sun.rotation.y += 0.01;
        planetGroup.children.forEach(function (obj) {
            obj.rotation.y += 0.01;
            obj.angle += (0.005 / obj.revolutionR) * 400;
            obj.position.set(obj.revolutionR * Math.sin(obj.angle), 0, obj.revolutionR * Math.cos(obj.angle));
        });
    }
    requestAnimationFrame(render);
}
render();

function createMesh(geometry, URL) {
    const material = new THREE.MeshBasicMaterial({
        map: texLoader.load(URL),
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createSphereMesh(R, URL) {
    const geometry = new THREE.SphereGeometry(R, 100, 100);
    return createMesh(geometry, URL);
}

function createRingMesh(r, R, URL) {
    const geometry = new THREE.CylinderGeometry(r, R, 0, 100, 100, true);

    return createMesh(geometry, URL);
}

function createringPlanetMesh(sphere_R, sphere_URL, ring_r, ring_R, ring_URL) {
    const group = new THREE.Group();
    const spere = createSphereMesh(sphere_R, sphere_URL);
    const ring = createRingMesh(ring_r, ring_R, ring_URL);
    group.add(spere, ring);
    return group;
}

function circle(r) {
    const arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI, true);
    const points = arc.getPoints(50);
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x222222
    });
    const line = new THREE.LineLoop(geometry, material);
    line.rotateX(Math.PI / 2);
    return line;
}

function data() {
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
}
