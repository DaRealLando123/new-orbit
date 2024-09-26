
// If you get confused, just remember THIS IS LITERALLY JUST AN OBJECT!
// It's not a class, it's just an object.

var note = {
  model: null, // this is for when the model loads
  open: false, // are you holding the object?
  goTo: { x: -1.1, y: -1.4, z: -1.8 }, // where the position for the object sitting down is
  goToR: { x: 0, y: -1.2 }, // what the rotation for the object sitting down is

  updatePos(){ // update the position of the object to where it should be... goTo and goToR
    try{
      this.model.position.x = lerp(this.model.position.x, this.goTo.x, 0.007*deltaTime);
      this.model.position.y = lerp(this.model.position.y, this.goTo.y, 0.007*deltaTime);
      this.model.position.z = lerp(this.model.position.z, this.goTo.z, 0.007*deltaTime);
      this.model.rotation.x = lerp(this.model.rotation.x, this.goToR.x, 0.007*deltaTime);
      this.model.rotation.y = lerp(this.model.rotation.y, this.goToR.y, 0.007*deltaTime);
    }catch(e){}
  },

  toggle() { // toggle if you're holding the object
    this.open = !this.open;
    if (this.open === true) {
      this.goTo = { x: 0, y: -.15, z: -.4 };
      this.goToR = { x: PI/2-.2, y: -PI/2 };
    } else {
      this.goTo = { x: -1.1, y: -1.4, z: -1.8 };
      this.goToR = { x: 0, y: -1.2 };
    }
  },
};

loader.load( `assets/note.glb`, (model) => {
  note.model = model.scene;
  note.model.scale.set(0.1, 0.1, 0.1);
});