/*
 * This Is the file where we will keep all of the functions 
 * that are called within the leap loop.
 * This included:
 *
 *    - LEAPLOOP:
 *      Function called in leap loop, defining rather then anonymous, 
 *      just for better organization
 *    
 *    - checkGestures:
 *        Function that checks for all of the gestures
 *
 *        //the onGesture commands
 *        - onCircle:
 *            changes the speed of the picture tube
 *        
 *        - onScreenTap:
 *            removeCurrentSlide();
 *            selectSlide();
 *
 *        - onKeyTap:
 *             removeCurrentSlide();
 *            
 *          - removeCurrentSlide:
 *              places the currently selected Slide
 *              back in its orginal position
 *
 *          - selectSlide:
 *              moves slide to the center
 *
 *          
 *
 *        
 *    - checkPointables:
 *        Checks for pointables 
 *        
 *          Slowing down
 *        
 *
 *
 */




function checkGestures(frame){
  if(frame.gestures[0]){
    var gesture=frame.gestures[0]
    var type = gesture.type
    if(type == 'circle'){
      onCircle(gesture);               
    }else if(type=='screenTap'){
      onScreenTap();
    }else if(type == 'keyTap'){
      removeCurrent();
    }
    
  }
}


function onCircle(gesture){

  
  //if rotation is clockwise, move forward
  if(gesture.normal[2]<0){
    speed += (gesture.radius/100) *(fieldLength/10000)
  
  //Otherwise move it backwards
  }else{
    speed -= gesture.radius/100 *(fieldLength/10000)
  }   

}


function checkPointables(frame){
  
  numOf = frame.pointables.length
  oNumOf = frame.oFrame.pointables.length
  //console.log(numOfPointables);
  //console.log(oNumOf);
  

  //Full Hand
  if(numOf >= 4 && oNumOf >= 4){
    dampening = .9

    //check to see where

  }else{
    dampening = .99 
  }


  

  //Single pointable (doing 1 pointable buffer)
  //if(numOf >= 1 ){
    checkClosest();

  //}

  if(numOf >= 4){
    newPos = leapToZ(frame.pointables[0].tipPosition)
    pointer.position.z = newPos.z 
    //make pointer visable
    $('.pointer').css('visibility','visible')
  }else{
    
    $('.pointer').css('visibility','hidden')
  }
  

}

function checkClosest(){

  var closestDistance = 1000000// getDistance(objects[0],pointer)
  //console.log(closestDistance);
  for(var i=0; i<objects.length; i++){

    if(objects[i].selected == false){
      $(objectsDOM[i]).removeClass('closest') 
      //console.log('cehs');
      var test ={}
      test.position={x:0,y:0,z:0}
      var newDistance = getDistance(objects[i],pointer)
      //console.log(newDistance);
      //:console.log(newDistance);
      if(newDistance < closestDistance){
       // console.log('clooser');
        closestObjectDOM = objectsDOM[i];
        closestObject = objects[i];
        closestObjectID = i
        closestDistance = newDistance;
      }else{
         
      }
    }
  }

  //$(closestObject).attr('id', 'closest');
  $(closestObjectDOM).addClass('closest')

  rotatePointer(closestObject);

}

function leapToScene(position){


  toReturn ={
    x:position[0]*4,
    y:(position[1]-200)*4,
    z:position[2]*50
      
  }

  return toReturn

}

function leapToZ(position){
  return {
    x:0,
    y:0,
    z:position[2]*(fieldLength/1000) - fieldLength/20
  }
}

function rotatePointer(obj){
  //pointer.rotation.z += .01;
  //console.log(obj)
  var x = obj.position.x  
  var y = obj.position.y
  var ratio  = y/x
  var angle = Math.atan2(y,x)
 
   pointer.rotation.z = angle - (Math.PI/2)

}

//get the distance between two THREE.CSS3D objects
function getDistance(p1,p2){

  var dif={
    x:p1.position.x - p2.position.x,
    y:p1.position.y - p2.position.y,
    z:p1.position.z - p2.position.z,
  } 

  var sumOfSquares=((dif.x*dif.x)+(dif.y*dif.y)+(dif.z*dif.z))
  var mag = Math.sqrt(sumOfSquares)

  return mag
}





function onScreenTap(){
    closestObject.selected = true;

   // console.log(  $('.beingViewed').length);
    removeCurrent();
  
    $(closestObjectDOM).addClass('beingViewed')
    closestObjectDOM.id = closestObjectID
  
 //   console.log( closestObjectDOM.id )
    closestObject.tempPosition = new THREE.Vector3()
    closestObject.tempPosition.x = closestObject.position.x
    closestObject.tempPosition.y = closestObject.position.y
    closestObject.tempPosition.z = closestObject.position.z
   // console.log(closestObjectDOM.children[0].src)
    closestObjectDOM.children[0].src = reddit[closestObjectID].url
  // console.log(closestObjectDOM.children[0].offsetWidth)
  // console.log(closestObjectDOM.children[0].offsetHeight)
  // console.log($(closestObjectDOM.children[0]));
   // $(closestObjectDOM).css("width",function(){
   //
   // conso
    $('.beingViewed .title').css("width",function(){

        return  closestObjectDOM.children[0].clientWidth +"px"
    })


    var mainTarget = new THREE.Object3D();
    mainTarget.position.x = -(closestObjectDOM.children[0].offsetWidth/3);
    mainTarget.position.z = 0;

    transformSingle(closestObject,mainTarget,1000);




}

function removeCurrent(){



  
    for(var i=0; i<=$('.beingViewed').length; i++){
  
      //console.log($('.beingViewed')[i])
      if($('.beingViewed')[i]){

     // console.log($('.beingViewed')[i].id)
        var id = parseInt($('.beingViewed')[i].id)
        //if(objects[id-1]){
         // console.log((objects[id]))

          var target = new THREE.Object3D();
          target.position = objects[id].tempPosition
          transformSingle(objects[id],target,500);
                 
        //}

        objects[id].selected = false
        

      }
      //$($('.beingViewed')[i]).remove();
      
     // console.log( $($('.beingViewed')[0]))
      $($('.beingViewed')[i]).removeClass('beingViewed');

    }

}





