(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = window.innerWidth;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
    var count = 0;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (16/9);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();

      canvas.addEventListener('click', drawPath, false);
      canvas.addEventListener('touchstart', drawPath, false);
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        video.classList.add('hidden');
      canvas.classList.remove('hidden');
        // var data = canvas.toDataURL('image/png');
        // photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
    }
  
function drawPath (e) {
  var c = canvas.getContext('2d');
  var bound = canvas.getBoundingClientRect();
  

  //var x = e.clientX - bound.left - canvas.clientLeft;
  //var y = e.clientY - bound.top - canvas.clientTop;

  var x = e.clientX - bound.left;
  var y = e.clientY - bound.top;
  console.log(x);
  console.log(y);
  //var x = e.clientX - bound.left - scrollX;
  //var y = e.clientY - bound.top - scrollY;

  count++;

  console.log(count);

 if (count == 1) {
  c.strokeStyle = 'red';
  c.beginPath();
  c.moveTo(x, y);
  
 } else if (count == 2 || count == 3) {

    c.lineTo(x, y);
   
 } else {
  c.lineTo(x, y);
 c.closePath();
 count = 0;
 
 c.stroke();
 }

 


console.log(x, y);

}

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);


    
  })();