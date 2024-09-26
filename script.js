const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 80 );

const renderer = new THREE.WebGLRenderer({antialias:false});
renderer.setPixelRatio(.5*window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const listener = new THREE.AudioListener();
camera.add( listener );

const loader = new THREE.GLTFLoader();

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

var mouse = {
  r: false,
  l: false
};

var shipLightDesired = {
  intensity: 3,
  color: new THREE.Color( 0xa66300 ),
  intensitySpeed: 1,
  colorSpeed: 1
};

var cameraMovement = 2.5;
const cameraDown = -0.32;

/*
To shake ship:
set shipShake.intensity and shipShake.duration to desired values
and then just call shakeShip();
*/
var shipShake = {
  intensity: 1,
  decay: 1,
  value: 0
}

var player = {
  r: 0,
  t: cameraDown,
  desiredR: 0,
  desiredT: cameraDown
}


const ambientLight = new THREE.AmbientLight( 0xffffff, 0.04 );
scene.add( ambientLight );


var gameHasStarted = false;

camera.rotateX(player.t);

camera.position.set(0, 1, 10);

var shipModel;
loader.load( `assets/shipscene.glb`, (model) => {
  shipModel = model.scene;
  shipModel.rotation.y = Math.PI;
  shipModel.position.x = 0;
  shipModel.position.y = -3;
  shipModel.position.z = -1.8;
  //console.log(this.model);
});

var mainMenuShipModel = false;
loader.load( `assets/mainmenuship.glb`, (model) => {
  mainMenuShipModel = model.scene;
  mainMenuShipModel.rotation.y = 1.3;
  mainMenuShipModel.rotation.x = .3;
  mainMenuShipModel.position.z = 3;
  mainMenuShipModel.position.y = -.7;
  scene.add(mainMenuShipModel);
  //console.log(this.model);
});


// Load the spherical map texture
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load('assets/stars.png'); // Replace with your texture

// Create a large sphere geometry for the sky
const skyGeometry = new THREE.SphereGeometry(50, 64, 64);

// Create a material and apply the texture
const skyMaterial = new THREE.MeshBasicMaterial({
  map: skyTexture,
  side: THREE.BackSide // Render the inside of the sphere
});

// Create the sky sphere mesh and add it to the scene
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skySphere);

const shipLight = new THREE.PointLight( 0xa66300, 3, 8 );
shipLight.position.set( 2, 2, -2 );
scene.add( shipLight );



//startGame();
function startGame(){
 gameHasStarted = true;
 scene.add(shipModel);
 scene.add(note.model);
 scene.add(clipboard.model);
 scene.remove(mainMenuShipModel);
 note.toggle();

  // to make the clipboard easier to see
  const playerLight = new THREE.PointLight( 0xffaa2b, 0.5, 5 );
  playerLight.position.set( 0, 0, 0 );
  scene.add( playerLight );
}

  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //renderer.shadowMap.autoUpdate = false;
  /*

    How to change ship light dynamically using one function call

    modifyLight( args );

    "args" is an array of arguments to pass to the function
    starting on the first one and running through till the end
    Here is a list of possible arguments

    ["delay", ms]
    ["loop", #ofArgs, #ofLoops]        //loop the next #ofArgs functions #ofLoops times
    ["intensity", int, dampening]      //dampening is how slow it approaches the desired value, 0 = instant change
    ["color", clr, dampening]          //color example: new THREE.Color( 0xa66300 )

    WARNING
    NESTED LOOPS WILL NUKE KANSAS
    WARNING

    Setting #ofLoops to 1 will essentially act like the loop isnt even there
    as that means that the next events run 1 time

    CODE EXAMPLE:

      modifyLight([
        ["loop", 4, 5],
        ["color", new THREE.Color( 0xffffff ), 1],
        ["delay", 400],
        ["color", new THREE.Color( 0xa66300 ), 1],
        ["delay", 400],
      ]);

      makes the color white, then back to normal with 400ms delays
      and loop that entire thing 5 times in a row
    
  */
// create a global audio source
const shipamb = new THREE.Audio( listener );
function startAmbientAudio(){
  audioLoader.load( 'assets/sounds/shipamb.mp3', function( buffer ) {
    shipamb.setBuffer( buffer );
    shipamb.setLoop( true );
    shipamb.setVolume( 0.5 );
    shipamb.play();
  });
}

function animate(){
  //raycast();
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

var gameTimer = 0;

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.position(0,0);
  pixelDensity(1);
  noSmooth();
  frameRate(9999999);
  note.toggle();
}

function draw(){
  if(!gameHasStarted && mainMenuShipModel !== false){
    mainMenu();
  } else if (!gameHasStarted && mainMenuShipModel == false){

  }
  if(gameHasStarted){
    mainGame();
  }
}

function mainMenu(){
  skySphere.rotation.y += 0.00005*deltaTime/10; // Adjust the speed as needed
  mainMenuShipModel.rotation.y += 0.0001*deltaTime/10;
  mainMenuShipModel.rotation.y += 0.00005*deltaTime/10;
}

function mainGame(){
  renderer.setPixelRatio(.5*window.devicePixelRatio);
  deltaTime = Math.min(deltaTime, 60);
  
  try{
    clipboard.animation.update( deltaTime/1000 );
  } catch(e){}

  clipboard.updatePos();
  note.updatePos();

  gameTimer += deltaTime/1000;

  camera.position.set(((Math.random()-0.5)*0.1)*shipShake.value, ((Math.random()-0.5)*0.1)*shipShake.value, ((Math.random()-0.5)*0.1)*shipShake.value)

  //if(mouseX < 10){
  //  player.desiredR = Math.min(player.desiredR+(0.001*deltaTime), 1);
  //} else if(mouseX > window.innerWidth - 10){
  //  player.desiredR = Math.max(player.desiredR-(0.001*deltaTime), -1);
  //}

  player.desiredR = -((mouseX-(window.innerWidth/2))*0.0002*cameraMovement*window.devicePixelRatio);
  player.desiredT = -((mouseY-(window.innerHeight/2))*0.0002*cameraMovement*window.devicePixelRatio) + cameraDown;

  shipLight.color.lerp(shipLightDesired.color, 0.01*deltaTime*shipLightDesired.colorSpeed);
  shipLight.intensity = lerp(shipLight.intensity, (shipLightDesired.intensity*0.83) + (noise(gameTimer*5)*(shipLightDesired.intensity*0.1)), Math.min(0.01*deltaTime*shipLightDesired.intensitySpeed));
  
  if(Math.random() < 0.001*deltaTime){
    shipLight.intensity = shipLightDesired.intensity*0.8;
  }

  ambientLight.intensity = (0.04/3)*shipLight.intensity;

  camera.rotateX(-player.t);
  camera.rotateY(-player.r);
  player.r = lerp(player.r, player.desiredR, 0.01*deltaTime);
  player.t = lerp(player.t, player.desiredT, 0.01*deltaTime);
  camera.rotateY(player.r);
  camera.rotateX(player.t);

  shipShake.value = Math.max(0, shipShake.value - (0.001*deltaTime*shipShake.decay*Math.max(shipShake.value*2,1)));
  

}

function windowResized() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resizeCanvas(window.innerWidth, window.innerHeight);
  renderer.setSize( innerWidth, innerHeight );
}

function mousePressed(){
  raycast();
  //requestPointerLock();
  //startAmbientAudio();
}

function keyPressed(){
  if(keyCode === 69){
    modifyLight([
      ["color", new THREE.Color( 0xff0000 ), 0.5],
      ["delay", 800],
      ["loop", 6, 5],
      ["color", new THREE.Color( 0x000000 ), 0.5],
      ["intensity", 0.1, 0.5],
      ["delay", 800],
      ["color", new THREE.Color( 0xff0000 ), 0.5],
      ["intensity", 3, 0.5],
      ["delay", 800],
      ["color", new THREE.Color( 0xa66300 ), 0.5]
    ]);
  }
}

document.addEventListener("mousedown", function(event) {
  if (event.button === 0) { // Left mouse button
    mouse.l = true;
  }
  if (event.button === 2) { // Right mouse button
    mouse.r = true;
  }
});

document.addEventListener("mouseup", function(event) {
  if (event.button === 0) { // Left mouse button
    mouse.l = false;
  }
  if (event.button === 2) { // Right mouse button
    mouse.r = false;
  }
});

function shakeShip(){
  shipShake.value = shipShake.intensity;
}

function modifyLight(data, index){

  let inLoop = false;

  if(index === undefined || index === 0){
    index = 0;
  } else {
    inLoop = true;
  }

  switch(data[index][0]){
      
    case "delay":
      if(!inLoop){
        let delayAmt = data[index][1];
        data.shift();
        if(data.length >= 1){
          setTimeout(modifyLight, delayAmt, data);
        }
      } else {
        if(data[0][1] <= index){
          setTimeout(modifyLight, data[index][1], data, 0);
        } else {
          setTimeout(modifyLight, data[index][1], data, index+1);
        }
      }
      break;
      
    case "color":
      if(!inLoop){
        shipLightDesired.color = data[index][1];
        shipLightDesired.colorSpeed = data[index][2];
        data.shift();
        if(data.length >= 1){
          setTimeout(modifyLight, 0, data);
        }
      } else {
        shipLightDesired.color = data[index][1];
        shipLightDesired.colorSpeed = data[index][2];
        if(data[0][1] <= index){
          setTimeout(modifyLight, 0, data, 0);
        } else {
          setTimeout(modifyLight, 0, data, index+1);
        }
      }
      break;
      
    case "intensity":
      if(!inLoop){
        shipLightDesired.intensity = data[index][1];
        shipLightDesired.intensitySpeed = data[index][2];
        data.shift();
        if(data.length >= 1){
          setTimeout(modifyLight, 0, data);
        }
      } else {
        shipLightDesired.intensity = data[index][1];
        shipLightDesired.intensitySpeed = data[index][2];
        if(data[0][1] <= index){
          setTimeout(modifyLight, 0, data, 0);
        } else {
          setTimeout(modifyLight, 0, data, index+1);
        }
      }
      break;
      
    case "loop":
      data[index][2] -= 1;
      if(data[index][2] <= 0){
        data.shift();
        if(data.length >= 1){
          setTimeout(modifyLight, 0, data);
        }
      } else {
        setTimeout(modifyLight, 0, data, 1);
      }
      break;
  }

  
}

function mouseWheel(event) {
  if(clipboard.open && gameHasStarted){
      if(event.delta < 0){
        if(clipboard.pagenum === 0){
          clipboard.page(clipboard.pagenum+1)
        }
      } else {
      if(clipboard.pagenum === 1){
        clipboard.page(clipboard.pagenum-1) 
      }
    }
  }
}

console.log(
  "Created by DaRealLando123 and Zpitolava22350, programmers just like you :)"
);

document.getElementById('startButton').addEventListener('click', function() {
  startGame();
  document.getElementById('gameTitle').style.display = 'none';
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('optionsButton').style.display = 'none';
  document.getElementById('creditsButton').style.display = 'none';
});
