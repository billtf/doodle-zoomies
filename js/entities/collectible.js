(function () {
  "use strict";
  function Collectible(type,x,y){this.type=type;this.x=x;this.y=y;this.w=26;this.h=26;this.active=true;}
  Collectible.prototype.update=function(dt,speed){this.x-=speed*dt;};
  Collectible.prototype.hitbox=function(){return{x:this.x,y:this.y,w:this.w,h:this.h};};
  DZ.Collectible=Collectible;
}());
