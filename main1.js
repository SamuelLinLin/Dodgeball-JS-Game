// Global variables
// height and width of the browser window
var ww = window.innerWidth;
var wh = window.innerHeight;
var counter = 1;

var n = 4;
var spheres = [];

var directions = [];
var speeds = [];
var radius = [];

/* Feb 4: Homework:
1. Add another a point light into your scene
	 https://threejs.org/docs/#api/en/lights/PointLight
2. Please animate your point light :
	rotate it around the cube
*/

function init() {
  /*Initilization function
    Calls render, camera, light, makeBox, and makes scene
  */

  // Make a renderer
  createRenderer();
  // Make a camera
  createCamera();
  // Make a light
  createLight();

  // Build a scene to glue everything together
  // Need to add in the camera, light, and objects
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(light);

  // get camera to look at origin
  camera.lookAt(scene.position);

  // Create cube
  // Add cube to scene
  createCube();
  scene.add(cube);

  for (let i = 0; i < n; i++) {
    let s = createSphere();
    s.position.set(i * 40 + -60, 10, getRandomInt(-90, 90));
    spheres.push(s);
    directions.push(true);
    speeds.push(getRandomInt(1, 4));
    scene.add(sphere);
  }

  // Create ground
  // Add ground to scene
  createGround();
  scene.add(ground);

  // get the renderer to render our scene
  // leave the rendering to last
  renderer.render(scene, camera);

  // animate at the end of the setup
  animate();

  // If the user scrolls up or down
  window.addEventListener("mousewheel", zoom);

  // If the user presses an arrow key
  window.addEventListener("keydown", move);
}

function createRenderer() {
  /* Creates the renderer*/
  // Call rendering engine WebGL
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene")
  });

  // set the background colour of our scene
  renderer.setClearColor(0x1C2833);

  // render the full screen
  renderer.setSize(ww, wh);

  // Activate shadow rendering
  //renderer.shadowMap.enabled = true;
  //renderer.shadowMapSoft = true;
  //renderer.shadowMapType.type = THREE.PCFSoftShadowMap;
  //renderer.physicallyBasedShading = true;

}

function createCamera() {
  /* Creates the camera*/
  camera = new THREE.PerspectiveCamera(75, ww / wh, 1, 10000);

  // set position of camera
  // x = 0, y = 0, z = 500
  camera.position.set(0, 100, 200);

}

function startGame() {
  let startDiv = document.getElementById("start");
  let gameCanvas = document.getElementById("scene");
  let gameOver = document.getElementById("game-over");
  let youWin = document.getElementById("you-win");
  startDiv.style.display = "none";
  youWin.style.display = "none";
  gameCanvas.style.display = "block";
  gameOver.style.display = "none";
  init();
}

function gameOver() {
  let startDiv = document.getElementById("start");
  let gameCanvas = document.getElementById("scene");
  let gameOver = document.getElementById("game-over");
  let youWin = document.getElementById("you-win");
  startDiv.style.display = "none";
  gameCanvas.style.display = "none";
  youWin.style.display = "none";
  gameOver.style.display = "block";
}

function youWin() {
  let startDiv = document.getElementById("start");
  let gameCanvas = document.getElementById("scene");
  let gameOver = document.getElementById("game-over");
  let youWin = document.getElementById("you-win");
  startDiv.style.display = "none";
  gameCanvas.style.display = "none";
  youWin.style.display = "block";
}

function createLight() {
  /* Creates the light*/

  // colour = white, intensity = 1
  // Directional light is like the sun at a direction
  light = new THREE.SpotLight(0xffffff);


  // We the position of our light
  // x = 50, y = 250, z = 500
  light.position.set(0, 85, 0);

  light.castShadow = true;
}

function createSphere() {
  r = getRandomInt(3, 6);
  let geometry = new THREE.SphereGeometry(r, 32, 16);
  radius.push(r);

  material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    specular: 0x5e99a7,
    shininess: 100
  });

  sphere = new THREE.Mesh(geometry, material);

  sphere.castShadow = true;

  return sphere;
}

function createCube() {
  /* Creates the cube*/

  // 1. geometry
  // wdith = 200, hiegh = 200, length = 200
  geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10);

  // 2. texture
  texture = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });

  // 3. Mesh
  // give it a geometry and texture
  cube = new THREE.Mesh(geometry, texture);

  // Rotate it a bit to see more of the cube
  // Angle is in units of radians

  // Add some position
  cube.position.set(90, 10, 0);

  cube.castShadow = true;

  cube.receiveShadow = true;

}

function createGround() {
  ground = new THREE.Mesh(
    new THREE.BoxGeometry(200, 1, 200, 10, 10, 10),
    new THREE.MeshLambertMaterial({
      color: 0x979A9A,
      //	opacity: 0.3, 
      //	transparent: true 
    }));
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
}

function getRandomInt(min_num, max_num) {
  /* Generate random integers between min and max input*/
  // Hint1: i = Math.random()
  // Hint2: Math.ceil(i) -> rounds up to nearest integer
  //Hint3: Math.floor(i) -> rounds down to nearest integer
  var n = Math.ceil(Math.random() * (max_num - min_num)) + min_num;
  return n;
}

var animate = function() {
  // Request another frame of the animation
  // call itself
  requestAnimationFrame(animate);

  //sphere.position.y += 0.8*Math.sin(counter*Math.PI/100);
  counter += 1;

  for (let i = 0; i < n; i++) {
    if (spheres[i].position.z < -100) {
      directions[i] = false;
      speeds[i] = -speeds[i];
    }
    if (spheres[i].position.z > 100) {
      directions[i] = true;
      speeds[i] = -speeds[i];
    }
    spheres[i].position.z += speeds[i];
    spheres[i].position.y += 0.5 * Math.sin(counter * Math.PI / 80);
    counter += 1;
    if (Math.abs(cube.position.x - spheres[i].position.x) < 6) {
      if (Math.abs(cube.position.z - spheres[i].position.z) < 6) {
        gameOver();
      }
    }
  }

  //Re-render everytime we make change
  renderer.render(scene, camera);
}

var zoom = function(e) {
  //Move our camera up or down
  camera.position.z += e.deltaY;
}

var move = function(e) {
  // Figure out which ints the 4 arrow correspond to

  let key_int = e.which;

  if (key_int == 37) {
    camera.position.x += 50;
  } else if (key_int == 39) {
    camera.position.x -= 50;
  } else if (key_int == 38) {
    camera.position.y -= 50;
  } else if (key_int == 40) {
    camera.position.y += 50;
  }


}

var move = function(e) {
  // r 39
  // l 37
  // u 38
  // d 40

  // a 65
  // d 68
  // w 87
  // s 83
  if (cube.position.x == -90) {
    youWin();
  }
  if (e.which == 83) {
    cube.position.z += 10;
  } else if (e.which == 87) {
    cube.position.z -= 10;
  } else if (e.which == 65) {
    cube.position.x -= 10;
  } else if (e.which == 68) {
    cube.position.x += 10;
  }


  if (e.which == 40) {
    cube.position.z += 10;
  } else if (e.which == 38) {
    cube.position.z -= 10;
  } else if (e.which == 37) {
    cube.position.x -= 10;
  } else if (e.which == 39) {
    cube.position.x += 10;
  }

  if (cube.position.x > 90) {
    cube.position.x = 90;
  }
  if (cube.position.x < -90) {
    cube.position.x = -90;
  }
  if (cube.position.z > 90) {
    cube.position.z = 90;
  }
  if (cube.position.z < -90) {
    cube.position.z = -90;
  }
}

