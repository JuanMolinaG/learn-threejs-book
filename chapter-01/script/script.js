import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module'
import { GUI } from 'three/addons/libs/lil-gui.module.min'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let step = 0

const createStats = () => {
  const stats = new Stats()
  document.body.appendChild(stats.dom)
  return stats
}

const createScene = () => {
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (scene) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(-30, 40, 30)
  camera.lookAt(scene.position)
  return camera
}

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)
  return renderer
}

const createPlane = () => {
  const planeGeometry = new THREE.PlaneGeometry(60, 20)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.set(15, 0, 0)
  plane.receiveShadow = true
  return plane
}

const createCube = () => {
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(-4, 3, 0)
  cube.castShadow = true
  return cube
}

const createSphere = () => {
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(20, 4, 2)
  sphere.castShadow = true
  return sphere
}

const createSpotLight = () => {
  const spotLight = new THREE.SpotLight(0xffffff, 8000)
  spotLight.position.set(-40, 40, -15)
  spotLight.castShadow = true
  spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
  spotLight.shadow.camera.far = 130
  spotLight.shadow.camera.near = 40
  return spotLight
}

const setupControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.update()
}

const setupGUI = () => {
  const gui = new GUI()
  const guiParams = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.04
  }

  gui.add(guiParams, 'rotationSpeed', 0.01, 0.5)
  gui.add(guiParams, 'bouncingSpeed', 0.01, 0.5)
  return guiParams
}

const animateCube = (cube, guiParams) => {
  cube.rotation.x += guiParams.rotationSpeed
  cube.rotation.y += guiParams.rotationSpeed
  cube.rotation.z += guiParams.rotationSpeed
}

const animateSphere = (sphere, guiParams) => {
  step += guiParams.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))
}

const onWindowResize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const renderScene = (
  stats,
  scene,
  camera,
  cube,
  sphere,
  renderer,
  guiParams
) => {
  stats.update()
  animateCube(cube, guiParams)
  animateSphere(sphere, guiParams)
  requestAnimationFrame(() =>
    renderScene(stats, scene, camera, cube, sphere, renderer, guiParams)
  )
  renderer.render(scene, camera)
}

const init = () => {
  const stats = createStats()
  const scene = createScene()
  const camera = createCamera(scene)
  const renderer = createRenderer()
  const plane = createPlane()
  const cube = createCube()
  const sphere = createSphere()
  const spotLight = createSpotLight()

  scene.add(plane)
  scene.add(cube)
  scene.add(sphere)
  scene.add(spotLight)

  setupControls(camera, renderer)
  const guiParams = setupGUI()

  window.addEventListener(
    'resize',
    () => onWindowResize(camera, renderer),
    false
  )

  renderScene(stats, scene, camera, cube, sphere, renderer, guiParams)
}
init()
