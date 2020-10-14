var context, video, width, height, canvas;

function Tag(w, h, color, x, y) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y; 
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
  // créer de manière dynamique afin de masquer la video
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
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause();
    var tagtest = new Tag(3, 3, "red", e.layerX, e.layerY);
  })
} 
