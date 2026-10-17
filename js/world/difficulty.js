(function () {
  "use strict";
  DZ.difficulty = {
    tier:function(m){return m<250?0:m<800?1:m<1600?2:3;},
    baseSpeed:function(m){if(m<250)return 320;if(m<800)return 380;if(m<1600)return 450;return Math.min(640,520+Math.floor((m-1600)/200)*10);},
    density:function(m){return m<250?.72:m<800?.58:m<1600?.5:.43;},
    worldSpeed:function(m,x,zoomies){
      var c=DZ.config,t=DZ.util.clamp((x-c.player.minX)/(c.player.maxX-c.player.minX),0,1);
      return this.baseSpeed(m)*(zoomies?c.speed.bandMax:DZ.util.lerp(c.speed.bandMin,c.speed.bandMax,t));
    }
  };
}());
