import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import { DragControls } from './node_modules/three/examples/jsm/controls/DragControls';
import CANNON from 'cannon';

const scene = new THREE.Scene()
var objects = [];
const light1 = new THREE.SpotLight()
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 2, 4)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.y = 0.5



const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()


const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
icosahedronMesh.position.x = 1
icosahedronMesh.position.y = 3
icosahedronMesh.castShadow = true
scene.add(icosahedronMesh)
const position = icosahedronMesh.geometry.attributes.position.array
const icosahedronPoints = []
for (let i = 0; i < position.length; i += 3) {
  icosahedronPoints.push(
    new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
  )
}
const icosahedronFaces = []
for (let i = 0; i < position.length / 3; i += 3) {
  icosahedronFaces.push([i, i + 1, i + 2])
}
const icosahedronShape = new CANNON.ConvexPolyhedron(icosahedronPoints, icosahedronFaces)
const icosahedronBody = new CANNON.Body({ mass: 1 })
icosahedronBody.addShape(icosahedronShape)
icosahedronBody.position.x = icosahedronMesh.position.x
icosahedronBody.position.y = icosahedronMesh.position.y
icosahedronBody.position.z = icosahedronMesh.position.z
world.addBody(icosahedronBody)


function CreateTrimesh(geometry) {
  const vertices = geometry.attributes.position.array
  const indices = Object.keys(vertices).map(Number)
  return new CANNON.Trimesh(vertices, indices)
}

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

objects.push(icosahedronMesh)

const dragControls = new DragControls(objects, camera, renderer.domElement);

// add event listener to highlight dragged objects

dragControls.addEventListener('dragstart', function (event) {

  controls.enabled = false;
  event.object.material.wireframe = true;

});

dragControls.addEventListener('dragend', function (event) {
  controls.enabled = true;
  event.object.material.wireframe = false;
});

console.log(dragControls)

const clock = new THREE.Clock()
let delta

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  //delta = clock.getDelta()
  delta = Math.min(clock.getDelta(), 0.1)
  world.step(delta)

  icosahedronMesh.position.set(
    icosahedronBody.position.x,
    icosahedronBody.position.y,
    icosahedronBody.position.z
  )
  icosahedronMesh.quaternion.set(
    icosahedronBody.quaternion.x,
    icosahedronBody.quaternion.y,
    icosahedronBody.quaternion.z,
    icosahedronBody.quaternion.w
  )

  render()

}

function render() {
  renderer.render(scene, camera)
}

animate()