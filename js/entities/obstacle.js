(function () {
  "use strict";
  var G=DZ.config.groundY;
  DZ.obstacleTypes = {
    trash:{answer:"jump",w:44,h:60,unlock:0}, hydrant:{answer:"jump",w:32,h:48,unlock:0},
    gnome:{answer:"jump",w:30,h:44,unlock:0}, branch:{answer:"duck",w:120,h:170,unlock:0},
    frisbee:{answer:"duck",w:40,h:14,unlock:250,moving:80}, bins:{answer:"jump",w:90,h:56,unlock:400},
    skateboard:{answer:"jump",w:60,h:20,unlock:500,moving:70}, clothesline:{answer:"duck",w:160,h:170,unlock:600},
    soccer:{answer:"time",w:34,h:34,unlock:800}, sprinkler:{answer:"jump",w:40,h:70,unlock:1000},
    crow:{answer:"duck",w:46,h:30,unlock:1300,moving:50}, bike:{answer:"jump",w:70,h:80,unlock:1600,moving:90},
    mailbox:{answer:"jump",w:50,h:72,unlock:0}, kiddiepool:{answer:"jump",w:110,h:24,unlock:250},
    flowerpots:{answer:"jump",w:76,h:40,unlock:400}, gardenhose:{answer:"jump",w:92,h:18,unlock:500}
  };
  function Obstacle(type,x,delay){
    var d=DZ.obstacleTypes[type];this.type=type;this.answer=d.answer;this.w=d.w;this.h=d.h;this.x=x;this.baseX=x;
    this.y=(d.answer==="duck"?(G-30-d.h):G-d.h);this.baseY=this.y;this.moving=d.moving||0;this.age=-(delay||0);this.active=true;this.passed=false;this.activeSpray=true;
    this.clusterId=0;this.clusterIndex=0;this.clusterCount=0;this.requiresDouble=false;
  }
  Obstacle.prototype.update=function(dt,speed){
    this.age+=dt;if(this.age<0)return;
    this.x-=(speed+this.moving)*dt;
    if(this.type==="soccer")this.y=this.baseY-Math.abs(Math.sin(this.age*3.2))*105;
    else if(this.type==="crow")this.y=this.baseY-Math.max(0,85-this.age*80);
    else if(this.type==="sprinkler")this.activeSpray=(this.age%2)<1.2;
  };
  Obstacle.prototype.hitbox=function(){
    if(this.type==="sprinkler"&&!this.activeSpray)return{x:this.x,y:DZ.config.groundY-15,w:this.w,h:15};
    return{x:this.x,y:this.y,w:this.w,h:this.h};
  };
  DZ.Obstacle=Obstacle;
}());
