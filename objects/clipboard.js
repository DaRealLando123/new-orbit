// create a global audio source
const pageflipsfx = new THREE.Audio( listener );
audioLoader.load( 'assets/sounds/pageflip.mp3', function( buffer ) {
  pageflipsfx.setBuffer( buffer );
  pageflipsfx.setVolume( 0.2 );
});

var clipboard = {
  model: null,
  animation: null,
  animations: { flippage1: null },
  pagenum: 0,
  pageFlipPosChange: [0,0],
  open: false,
  goTo: { x: -1.6, y: -1.4, z: -1.2 },
  goToR: { x: 0, y: -1.2 },

  updatePos(){
    try{
      this.model.position.x = lerp(this.model.position.x, this.goTo.x, 0.007*deltaTime);
      this.model.position.y = lerp(this.model.position.y, this.goTo.y - (this.pageFlipPosChange[0]*0.2), 0.007*deltaTime);
      this.model.position.z = lerp(this.model.position.z, this.goTo.z - (this.pageFlipPosChange[0]*0.3), 0.007*deltaTime);
      this.model.rotation.x = lerp(this.model.rotation.x, this.goToR.x - (this.pageFlipPosChange[0]*0.4), 0.007*deltaTime);
      this.model.rotation.y = lerp(this.model.rotation.y, this.goToR.y, 0.007*deltaTime);
    }catch(e){}
    
    if(this.pageFlipPosChange[1] === 0){
      this.pageFlipPosChange[0] = Math.max(lerp(this.pageFlipPosChange[0], -0.1, 0.005*deltaTime),0);
    }
    if(this.pageFlipPosChange[1] === 1){
      this.pageFlipPosChange[0] = Math.min(lerp(this.pageFlipPosChange[0], 1, 0.02*deltaTime),1);
      if(this.pageFlipPosChange[0] >= 0.99){
        this.pageFlipPosChange[1] = 0;
      }
    }
  },
  // def not efficient
  toggle() {
    this.open = !this.open;
    if (this.open === true) {
      this.goTo = { x: 0, y: -.15, z: -.4 };
      this.goToR = { x: PI/2-.2, y: -PI/2 };
    } else {
      this.goTo = { x: -1.6, y: -1.4, z: -1.2 };
      this.goToR = { x: 0, y: -1.2 };
    }
  },
  
  page(p) {
    this.pagenum = p;
    //set per case later
    const action = clipboard.animation.clipAction( clipboard.animations.flippage1 );
    this.pageFlipPosChange[1] = 1;
    switch(p){
      case 0:
        action.timeScale = -1;
        action.paused = false;
        break;
      case 1:
        action.timeScale = 1;
        action.paused = false;
        break;
    };
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 0);
    console.log(p);
    pageflipsfx.play();
    action.play();
  },

};

loader.load( `assets/clipboard.glb`, (model) => {
  clipboard.model = model.scene;
  //console.log(model);
  clipboard.animation = new THREE.AnimationMixer( clipboard.model );
  clipboard.animations.flippage1 = THREE.AnimationClip.findByName( model.animations, 'flippage1' );
  clipboard.model.scale.set(0.3, 0.3, 0.3);
});