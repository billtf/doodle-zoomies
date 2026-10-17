(function () {
  "use strict";
  function Particles(){
    this.pool=new DZ.util.Pool(function(){return{x:0,y:0,vx:0,vy:0,life:0,color:"#fff",active:false};},function(p){p.life=0;},DZ.config.limits.particles);
  }
  Particles.prototype.burst=function(x,y,color,count){
    for(var i=0;i<count;i++){var p=this.pool.acquire();if(!p)return;p.x=x;p.y=y;p.vx=(Math.random()-.5)*180;p.vy=-40-Math.random()*140;p.life=.35+Math.random()*.35;p.color=color;}
  };
  Particles.prototype.update=function(dt){
    var a=this.pool.items;for(var i=0;i<a.length;i++){var p=a[i];if(!p.active)continue;p.life-=dt;if(p.life<=0){this.pool.release(p);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=350*dt;}
  };
  Particles.prototype.draw=function(ctx){
    var a=this.pool.items;for(var i=0;i<a.length;i++){var p=a[i];if(!p.active)continue;ctx.globalAlpha=Math.min(1,p.life*3);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,4,0,6.3);ctx.fill();}ctx.globalAlpha=1;
  };
  DZ.Particles=Particles;
}());
