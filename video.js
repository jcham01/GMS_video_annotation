var context, video, width, height, canvas;
var allTags = new Array(); 
var tagexist;
var tagByName;
var tagByTime;
var press = true;
var video_data = new Array();

function Tag(tagname, w, h, color, x, y, currentTime) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y; 
  this.currentTime = currentTime;
  this.tagname = "" ? prompt("nom du tag :") : tagname;
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
  var source = prompt("vidéo à annoter : ")
  video = document.getElementById("video");
  video.src = "media/"+source+".mp4"
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
  if (allTags.length>0) {
    var existAtime = allTags.filter(tag => video.currentTime.toFixed(0) === tag.currentTime.toFixed(0));
    if (existAtime.length>0) {
      existAtime.map(function(tag){
        context.fillStyle = "red";
        context.fillRect(tag.x, tag.y, tag.w, tag.h);
      });  
    }
  }
}

function createIfNotExist(mx, my) {
  tagexist = allTags.filter(tag => ((mx>=tag.x&&mx<=tag.x+30)&&(my>=tag.y&&my<=tag.y+30)));
  if (tagexist.length>0) {
    tagByName = allTags.filter(tag => tagexist[0].tagname === tag.tagname)
    tagByTime = tagByName.filter(tag => video.currentTime.toFixed(0) === tag.currentTime.toFixed(0));
    canvas.addEventListener('mousemove', function(e) {
      if (press === true) {
        tagByTime[0].x = e.layerX;
        tagByTime[0].y = e.layerY;
      }
    })
    canvas.addEventListener('mousedown', function(e) {
      press = true;
    })
    canvas.addEventListener('mouseup', function(e) {
      press = false;
      var diffX = tagByTime[0].x - tagByName[tagByName.indexOf(tagByTime[0])-1].x
      var diffY = tagByTime[0].y - tagByName[tagByName.indexOf(tagByTime[0])-1].y
      var duree = tagByName.indexOf(tagByTime[0])
      var diffXduree = diffX/duree
      var diffYduree = diffY/duree
      var d = 0
      // une première boucle pour le mouvement avec le premier index voir decouper en step
      // voir si decouper dans une fonction
      for (var a = tagByName.indexOf(tagByName[0]); a < tagByName.indexOf(tagByTime[0]); a++) {
        d++
        tagByName[a].x = tagByName[a].x + diffXduree*d
        tagByName[a].y = tagByName[a].y + diffYduree*d
      }
      for (var t = tagByName.indexOf(tagByTime[0]); t < tagByName.length; t++) {
        tagByName[t].x = tagByTime[0].x 
        tagByName[t].y = tagByTime[0].y
      }
    })
  }
  if (tagexist.length<=0) {
    var name = prompt("nom du tag :")
    if (name !== "") {
      for (var i = parseInt(video.currentTime.toFixed(0)); i < parseInt(video.duration.toFixed(0)); i++) {
        allTags.push(new Tag(name, 30, 30, "red", mx, my, i));              
      }
    }
  } 
  if (allTags.length > 0) {
    // TODO - voir si gestion sur crochets et afficher telecharger une fois 
    allTags.map(function(tag) {
      video_data.push({
        "tagname" : tag.tagname,
        "currentTime" : tag.currentTime,
        "x" : tag.x, 
        "y" : tag.y
      })
    })
  }
  const file = new Blob(
    [JSON.stringify(video_data)], 
    { type: 'application/json' }
  );
  const fileURL = URL.createObjectURL(file);
  var linkElement;
  linkElement = document.createElement("a");
  linkElement.setAttribute('href', fileURL);
  linkElement.setAttribute('download', 'annotations.json');
  linkElement.innerText = "télécharger";
  document.body.appendChild(linkElement);
  return tagexist;
}

function deleteTag(mx, my) {
  var tagToDelete = allTags.filter(tag => !((mx>=tag.x&&mx<=tag.x+30)&&(my>=tag.y&&my<=tag.y+30)));
  allTags = tagToDelete
}

videoToFrame()

if (canvas !== null) {
  canvas.addEventListener('click', function(e) {
    video.pause(e.layerX, e.layerY);
    if (allTags.length>0) {
      createIfNotExist(e.layerX, e.layerY);
    } else {
      var name = prompt("nom du tag :")
      if (name !== "") {
        for (var i = parseInt(video.currentTime.toFixed(0)); i < parseInt(video.duration.toFixed(0)); i++) {
          allTags.push(new Tag(name, 30, 30, "red", e.layerX, e.layerY, i));              
        }
      }
    }
  })
  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (allTags.length>0) {
      deleteTag(e.layerX, e.layerY);
    }
  })
} 