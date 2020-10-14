var context, video, width, height, canvas;
var allTags = new Array(); 

function Tag(w, h, color, x, y) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y; 
  this.currentTime = canvas.previousElementSibling.currentTime;
  // version final
  // this.tagname = prompt("nom du tag :");
  context.fillStyle = color;
  context.fillRect(this.x, this.y, this.w, this.h);
}

function timerCallback () {
  if (this.video.paused || this.video.ended) {
    return;
  }
  this.getFrames();
  let self = this;
  setTimeout(function () {
      self.timerCallback();
    }, 0);
}

function videoToFrame() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  let self = this;
  this.video.addEventListener('play', function() {
    width = video.videoWidth;
    height = video.videoHeight; 
    self.timerCallback()
  }, false);
}

function getFrames() {
  // voir ct/ou stocker la valeur
  // console.log("current time : ", video.currentTime)
  context.drawImage(this.video, 0, 0, this.width, this.height);
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause();
    allTags.push(new Tag(3, 3, "red", e.layerX, e.layerY));
  })
} 
