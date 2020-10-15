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
  if (this.video.ended) {
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
  context.drawImage(this.video, 0, 0, this.width, this.height);
  // pour garder les tags existant et les tracer 
  if (allTags.length>0) {
    existAtime = allTags.filter(tag => video.currentTime >= tag.currentTime);
    if (existAtime.length>0) {
      allTags.map(function(tag){
        context.fillStyle = "red";
        context.fillRect(tag.x, tag.y, tag.w, tag.h);
      });  
    }
  }
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause();
    // voir ct distinguer les tags existants + drag et drop
    allTags.push(new Tag(30, 30, "red", e.layerX, e.layerY));
  })
} 
