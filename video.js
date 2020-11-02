var context, video, width, height, canvas;
var allTags = new Array(); 
var tagexist;
var existAtime;
var press = true;
// travailler avec des blobs
var video_data = new Array();
const file = new Blob(
  [JSON.stringify(video_data)], 
  { type: 'application/json' }
);
// url qui sera a telecharger
const fileURL = URL.createObjectURL(file);
var linkElement;

function Tag(w, h, color, x, y) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y; 
  this.currentTime = canvas.previousElementSibling.currentTime;
  this.tagname = prompt("nom du tag :");
  context.fillStyle = color;
  context.fillRect(this.x, this.y, this.w, this.h);
  video_data.push({ 
    "tagname": this.tagname, 
    "currentime": this.currentTime,
    "x": x,
    "y": y
  })
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

// TODO - creation/upload "propres" de fichiers

function videoToFrame() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  linkElement = document.createElement("a");
  linkElement.setAttribute('href', fileURL);
  linkElement.setAttribute('download', 'polypane-workspace.json');
  linkElement.innerText = "test";
  document.body.appendChild(linkElement);
  let self = this;
  this.video.addEventListener('play', function() {
    width = video.videoWidth;
    height = video.videoHeight; 
    self.timerCallback()
  }, false);
}

function getFrames() {
  context.drawImage(this.video, 0, 0, this.width, this.height);
  if (video_data.length>0) {
    video_data = uniqBy(video_data, JSON.stringify)
    // regarder filter nom et plus récent
    existAtime = video_data.filter(tag => video.currentTime.toFixed(0) === tag.currentime.toFixed(0));
    // existAtime = video_data.filter(tag => video.currentTime >= tag.currentime);
    if (existAtime.length>0) {
      existAtime.map(function(tag){
        context.fillStyle = "red";
        context.fillRect(tag.x, tag.y, 30, 30);
      });  
    }
  }
}

// TODO - A découper
function createIfNotExist(mx, my) {
  tagexist = video_data.filter(tag => ((mx>=tag.x&&mx<=tag.x+30)&&(my>=tag.y&&my<=tag.y+30)));
  if (tagexist.length>0) {
    canvas.addEventListener('mousemove', function(e) {
      if (press === true) {
        tagexist[0].x = e.layerX;
        tagexist[0].y = e.layerY;
        tagexist[0].currentime = video.currentTime;
      }
    })
    canvas.addEventListener('mousedown', function(e) {
      press = true;
      console.log('mousedown');
    })
    canvas.addEventListener('mouseup', function(e) {
      press = false;
      console.log('mouseup');
      // test length > 0
      var sameName = allTags.filter(tag => tagexist[0].tagname === tag.tagname)
      if (sameName.length>0) { 
        video_data.push({ 
          "tagname": sameName[0].tagname, 
          "currentime": sameName[0].currentTime,
          "x": sameName[0].x,
          "y": sameName[0].y
        })
        sameName[0].tagname = tagexist[0].tagname;
        sameName[0].currentTime = tagexist[0].currentime;
        sameName[0].x = tagexist[0].x;
        sameName[0].y = tagexist[0].y;
      }
      video_data.push({ 
        "tagname": tagexist[0].tagname, 
      "tagname": tagexist[0].tagname, 
        "tagname": tagexist[0].tagname, 
        "currentime": tagexist[0].currentime,
        "x": tagexist[0].x,
        "y": tagexist[0].y
      })
    })
  console.log(tagexist[0].tagname);
  }
  if (tagexist.length<=0) {
    allTags.push(new Tag(30, 30, "red", mx, my));      
  }
  return tagexist;
}

function deleteTag(mx, my) {
  var tagToDelete = allTags.filter(tag => ((mx>=tag.x&&mx<=tag.x+30)&&(my>=tag.y&&my<=tag.y+30)));
  var index = allTags.indexOf(tagToDelete[0]);
  if (index > -1) {
    allTags.splice(index, 1);
  }
}

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause(e.layerX, e.layerY);
    if (allTags.length>0) {
      createIfNotExist(e.layerX, e.layerY);
    } else {
      allTags.push(new Tag(30, 30, "red", e.layerX, e.layerY));      
    }
  })
  canvas.addEventListener('contextmenu', function(e) {
    // TODO - alert avec possibilité d'annuler 
    e.preventDefault();
    if (video_data.length>0) {
      deleteTag(e.layerX, e.layerY);
    }
  })
} 