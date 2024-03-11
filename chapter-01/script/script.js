import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module'

const init = () => {
  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  // const axes = new THREE.AxesHelper(20)
  // scene.add(axes)

  const planeGeometry = new THREE.PlaneGeometry(60, 20)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.set(15, 0, 0)
  plane.receiveShadow = true
  scene.add(plane)

  // create a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(-4, 3, 0)
  cube.castShadow = true
  scene.add(cube)

  // create a sphere
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(20, 4, 2)
  sphere.castShadow = true
  scene.add(sphere)

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30)
  camera.lookAt(scene.position)

  // add lights
  const spotLight = new THREE.SpotLight(0xffffff, 8000)
  spotLight.position.set(-40, 40, -15)
  spotLight.castShadow = true
  spotLight.shadow.mapSize = new THREE.Vector2(4096, 4096)
  spotLight.shadow.camera.far = 130
  spotLight.shadow.camera.near = 40
  scene.add(spotLight)

  // add the output of the renderer to the html element
  document.body.appendChild(renderer.domElement)

  let step = 0
  // render the scene
  const renderScene = () => {
    stats.update()

    // animate the cube
    cube.rotation.x += 0.02
    cube.rotation.y += 0.02
    cube.rotation.z += 0.02

    // animate the sphere
    step += 0.04
    sphere.position.x = 20 + 10 * Math.cos(step)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

    requestAnimationFrame(renderScene)
    renderer.render(scene, camera)
  }

  renderScene()
}
init()
