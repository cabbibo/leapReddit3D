
function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = cameraZ;
    camera.position.x = cameraX;
    scene = new THREE.Scene();
   
    //Creating the CSS3D objects, and also pushing them to the
    //Objects array2
    for ( var i = 0; i < numberOfImages; i ++ ) {
        
        //assigns an item from the reddit array
        var item = reddit[ i ];

        //Creates a DIV, which will become the CSS3D object
        var element = document.createElement( 'div' );
        element.className = 'element';

        //Adds the thumbnail image from the reddit data
        var image = document.createElement( 'img' );
        image.className = 'image';
        image.src = item.image;
        element.appendChild( image );

        //Adds the title, which will be invisible unless
        //it is selected
        var title = document.createElement( 'div' );
        title.className = 'title';
        title.textContent = item.title;
        element.appendChild(title);
      
        //Adds an ID for easier navigation
        var id = document.createElement('div');
        id.className = 'id';
        id.textContent = i;
        element.appendChild(id);


        //Adds a score
        //TODO, make a helix that is score based
        var score = document.createElement('div');
        score.className = 'score';
        score.innerHTML = item.score;


        //Creates a CSS3D object using the div
        //we just created
        var object = new THREE.CSS3DObject( element );
                       
        //gets the phi so that it places
        //the images in a smooth circle as they cycle through
        var phi = (i/numberOfImages) * (numberOfRotations * 2 * Math.PI); 

        object.position.x = radius * Math.sin( phi );
        object.position.y = radius * Math.cos( phi );
        object.position.z = - ( i / numberOfImages )*fieldLength + cameraZ;
 

        

        //Sets the object to be selected as false
        object.selected = false;
        
        //adds the object to the scene
        scene.add( object );

        //assigns this object to the item we are looking at
        //so that it can all be accessed through
        //the reddit array
        //TODO: make this the way we acces them
        item.object = object;
        item.DOM = element;

        //TODO: make these unneccesary
        objects.push( object );
        objectsDOM.push(element);


    }


    //Creating a 'pointer' which will be the object in teh middle
    //that points at the currently selected slide
    //right now it is invisible
    //but leaving it in so that if someone wants that visual input
    //it is easy to add in 
    var pointerDOM = $('.pointer')[0]
    
    pointer = new THREE.CSS3DObject(pointerDOM)
    pointer.position.x = 0
    pointer.position.y = 0
    pointer.position.z = 200

    scene.add(pointer)
    

    //Sets up a target for the selected object to move towards
    var object = new THREE.Object3D();
    mainTarget = object 

    
    //Creates the renderer
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    //Make sure the windows still look ok when resized
    window.addEventListener( 'resize', onWindowResize, false );

    //Once Everything is set up, start the leap loop
    //This is where everything happens
    Leap.loop({enableGestures:true},function(frame){
              
      if(oFrame){
        frame.oFrame = oFrame
      }else{
        frame.oFrame = frame
      }
          
      //Checks all the gestures that are used    
      checkGestures(frame);

      //Checks all the uses of the pointables
      checkPointables(frame); 
    
      //Checks to see which slide is the closest
      checkClosest();

      //updates the speed based on the dampening
      speed = speed * dampening
      
      //updates the positions based on speed
      updatePositions();

      //three.js animation loop
      animate();
      
      //keep the oFrame object to pass into the 
      // the frame.oFrame
      //
      // TODO: Is this a memory leak?
      oFrame = frame
    });
            



}




//Creates the ability to move smoothly from one location to another
//using the TWEEN library
function transformSingle(object,target,duration){
 
  new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.Out )
            .start();

    new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.Out )
            .start();

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        //.onUpdate( render )
        .start();
}


//Resizes the camera and renderer
//so that they always fill the screen
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


//animates the scene
//by rendering and updating the tweens
function animate() {
    TWEEN.update();
    renderer.render( scene, camera );
}


