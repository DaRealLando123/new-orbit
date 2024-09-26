const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


function raycast() {

  raycaster.setFromCamera(pointer, camera);

  // Get intersections
  let intersects = raycaster.intersectObjects(scene.children, true);
  //let intersectionPoint = intersects[0].point;

  if(clipboard.open) clipboard.toggle();
  if(note.open) note.toggle();

  //console.log(intersects)
  for(let i = 0; i < intersects.length; i++){
    // pick it up...
    switch (intersects[i].object.name) {
      case "note":
        if(!note.open){
          note.toggle();
        }
        break;
      case "clipboard":
        if(!clipboard.open){
          clipboard.toggle();
        }
        break;
    }

    //
    // WHAT IS BELOW COMMENTED IS COMPLETELY UNNECESSARY BUT SCREW IT IM KEEPING IT IN CASE I NUKED KANSAS
    //

    /*/ are you picking it up? if so, skip what's after.
    if(intersects[i].object.name == "clipboard" && clipboard.open || intersects[i].object.name == "note" && note.open){
      break
    }
    // ...put it down*/
  }
}

window.addEventListener( 'pointermove', onPointerMove );