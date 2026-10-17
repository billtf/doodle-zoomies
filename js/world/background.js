(function () {
  "use strict";
  DZ.Background=function(){this.zone=0;};
  DZ.Background.prototype.update=function(distance){this.zone=Math.floor(distance/500)%4;};
  DZ.Background.prototype.draw=function(ctx,distance,time){DZ.art.drawBackground(ctx,distance,time);};
}());
