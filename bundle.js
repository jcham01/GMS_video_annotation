(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
          self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
      this.video = document.getElementById("video");
      this.c1 = document.getElementById("canvas");
      this.ctx1 = this.c1.getContext("2d");
      let self = this;
      this.video.addEventListener("play", function() {
          self.width = self.video.videoWidth;
          self.height = self.video.videoHeight;
          self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      return;
    }
  };

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});

},{}]},{},[1]);
