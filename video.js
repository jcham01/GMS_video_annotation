var context, video, width, height, canvas;
var allTags = new Array(); 
var tagexist;
var press = true;

function Tag(w, h, color, x, y) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y; 
  this.currentTime = canvas.previousElementSibling.currentTime;
  // version final
  this.tagname = prompt("nom du tag :");
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
    var existAtime = allTags.filter(tag => video.currentTime >= tag.currentTime);
    if (existAtime.length>0) {
      allTags.map(function(tag){
        context.fillStyle = "red";
        context.fillRect(tag.x, tag.y, tag.w, tag.h);
      });  
    }
  }
}

function createIfNotExist(mx, my) {
  // changer les valeurs en dur : 30
  /* allTags.map(function(tag) {  
    canvas.addEventListener('mousemove', function(e) {
        if ((e.layerX>=tag.x&&e.layerX<=tag.x+30)&&(e.layerY>=tag.y&&e.layerY<=tag.y+30)) {
          console.log("mouse move x : ", e.layerX, " y : ", e.layerY);
          context.fillRect(e.layerX, e.layerY, 30, 30);
        }
    })
  }) */
  tagexist = allTags.filter(tag => ((mx>=tag.x&&mx<=tag.x+30)&&(my>=tag.y&&my<=tag.y+30)));
  if (tagexist.length>0) {
    canvas.addEventListener('mousemove', function(e) {
      if (press === true) {
        tagexist[0].x = e.layerX;
        tagexist[0].y = e.layerY;
        console.log("mouse move tagexist[0].x ", tagexist[0].x, " tagexist[0].y ", tagexist[0].y);  
      }
    })
    canvas.addEventListener('mousedown', function(e) {
      press = false;
      console.log('mousedown');
    })
  }
  if (tagexist.length<=0) {
    allTags.push(new Tag(30, 30, "red", mx, my));      
  }
  return tagexist;
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause(e.layerX, e.layerY);
    //drag et drop
    if (allTags.length>0) {
      press = true
      createIfNotExist(e.layerX, e.layerY);
    } else {
      allTags.push(new Tag(30, 30, "red", e.layerX, e.layerY));      
    }
  })
} 
