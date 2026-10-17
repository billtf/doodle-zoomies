(function () {
  "use strict";
  var patterns=[
    ["trash"],["hydrant"],["gnome"],["branch"],["trash","bone"],["bone","bone","trash"],
    ["frisbee"],["bins"],["skateboard"],["clothesline"],["hydrant","frisbee"],["bins","tennis"],
    ["soccer"],["sprinkler"],["crow"],["trash","soccer"],["sprinkler","bone","crow"],
    ["bike"],["crow","bike"],["bins","clothesline"],["bike","tennis"],["soccer","crow"],
    ["bike","zoomies"],["clothesline","heart"]
  ];
  var starts=[0,6,12,17], ends=[6,12,17,24];
  function Spawner(seed){this.rng=new DZ.util.RNG(seed||12345);this.timer=.9;this.last=-1;this.patterns=patterns;this.nextShield=600;this.nextZoomies=1200;this.nextHeart=900;this.lastGap=0;}
  Spawner.prototype.minimumGap=function(speed){return speed*(DZ.config.reactionTime+(2*DZ.config.player.jumpVelocity/DZ.config.player.gravity));};
  Spawner.prototype.choose=function(tier){
    var start=starts[tier],end=ends[tier],n=start+((this.rng.next()*(end-start))|0);
    if(n===this.last)n=start+((n-start+1)%(end-start));this.last=n;return patterns[n];
  };
  Spawner.prototype.update=function(dt,game){
    this.timer-=dt;if(this.timer>0||game.obstacles.length>=DZ.config.limits.obstacles)return;
    var pattern=this.choose(DZ.difficulty.tier(game.distance)),gap=Math.max(this.minimumGap(game.speed),game.speed*DZ.difficulty.density(game.distance));
    this.lastGap=gap;var x=DZ.config.width+50;
    for(var i=0;i<pattern.length;i++){
      var name=pattern[i],def=DZ.obstacleTypes[name];
      if(def&&def.unlock<=game.distance){game.obstacles.push(new DZ.Obstacle(name,x+i*gap));}
      else if(!def&&!(name==="heart"&&game.player.hearts>=3)){game.collectibles.push(new DZ.Collectible(name,x+i*gap,DZ.config.groundY-95));}
    }
    if(game.distance>=this.nextShield){game.collectibles.push(new DZ.Collectible("shield",x+90,DZ.config.groundY-110));this.nextShield+=DZ.config.powerups.shieldGap;}
    if(game.distance>=this.nextZoomies){game.collectibles.push(new DZ.Collectible("zoomies",x+130,DZ.config.groundY-120));this.nextZoomies+=DZ.config.powerups.zoomiesGap;}
    if(game.player.hearts<3&&game.distance>=this.nextHeart){game.collectibles.push(new DZ.Collectible("heart",x+100,DZ.config.groundY-100));this.nextHeart+=DZ.config.powerups.heartGap;}
    this.timer=gap*(pattern.length+1)/game.speed;
  };
  Spawner.prototype.debugState=function(){return"pattern "+this.last+" gap "+Math.round(this.lastGap);};
  DZ.Spawner=Spawner;
}());
