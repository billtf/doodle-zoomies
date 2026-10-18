(function () {
  "use strict";
  function cluster(items){items.cluster=true;return items;}
  var patterns=[
    ["trash"],["hydrant"],["gnome"],["mailbox"],["branch"],["trash","bone"],["bone","bone","trash"],["mailbox","bone"],
    ["frisbee"],["bins"],["skateboard"],["clothesline"],["kiddiepool"],["flowerpots"],["gardenhose"],
    ["hydrant","frisbee"],["bins","tennis"],["mailbox","kiddiepool"],
    ["soccer"],["sprinkler"],["crow"],["trash","soccer"],["sprinkler","bone","crow"],["flowerpots","tennis"],
    cluster(["mailbox","flowerpots","kiddiepool"]),cluster(["trash","hydrant","gardenhose"]),
    ["bike"],["crow","bike"],["bins","clothesline"],["bike","tennis"],["soccer","crow"],["bike","zoomies"],
    cluster(["kiddiepool","flowerpots","mailbox"]),cluster(["gardenhose","trash","bins"])
  ];
  var starts=[0,8,18,26], ends=[8,18,26,34];
  function Spawner(seed){this.rng=new DZ.util.RNG(seed||12345);this.timer=.9;this.last=-1;this.patterns=patterns;this.nextShield=600;this.nextZoomies=1200;this.nextHeart=900;this.lastGap=0;this.clusterSerial=0;this.lastWasCluster=false;}
  Spawner.prototype.jumpDuration=function(jumps){return (jumps>1?3:2)*DZ.config.player.jumpVelocity/DZ.config.player.gravity;};
  Spawner.prototype.arcLength=function(speed,jumps){return speed*this.jumpDuration(jumps||1);};
  Spawner.prototype.minimumGap=function(speed,jumps){return speed*(DZ.config.reactionTime+this.jumpDuration(jumps||1));};
  Spawner.prototype.clusterSpan=function(speed){
    return Math.min(this.arcLength(speed,2)-speed*.08,this.arcLength(speed,1)+speed*.14);
  };
  // One layout function feeds both the live spawner and the fairness check, so the test checks real positions.
  Spawner.prototype.layout=function(pattern,speed,distance){
    var gap=Math.max(this.minimumGap(speed,pattern.cluster?2:1),speed*DZ.difficulty.density(distance||0));
    var span=pattern.cluster?this.clusterSpan(speed):(pattern.length-1)*gap;
    var lastDef=DZ.obstacleTypes[pattern[pattern.length-1]],spacing=pattern.length>1?(pattern.cluster?(span-(lastDef?lastDef.w:0))/(pattern.length-1):gap):0;
    return {gap:gap,span:span,spacing:spacing};
  };
  Spawner.prototype.isFairPattern=function(pattern,speed,distance){
    var l=this.layout(pattern,speed,distance);
    if(pattern.cluster)return l.span>this.arcLength(speed,1)&&l.span<this.arcLength(speed,2);
    var need=this.minimumGap(speed,1),prev=-1;
    for(var i=0;i<pattern.length;i++){
      if(!DZ.obstacleTypes[pattern[i]])continue;
      if(prev>=0&&(i-prev)*l.spacing<need)return false;
      prev=i;
    }
    return true;
  };
  Spawner.prototype.choose=function(tier){
    var start=starts[tier],end=ends[tier],n=start+((this.rng.next()*(end-start))|0);
    if(n===this.last)n=start+((n-start+1)%(end-start));this.last=n;return patterns[n];
  };
  Spawner.prototype.update=function(dt,game){
    this.timer-=dt;if(this.timer>0||game.obstacles.length>=DZ.config.limits.obstacles)return;
    var pattern=this.choose(DZ.difficulty.tier(game.distance)),needed=0;
    for(var n=0;n<pattern.length;n++)if(DZ.obstacleTypes[pattern[n]])needed++;
    if(game.obstacles.length+needed>DZ.config.limits.obstacles){this.timer=.2;return;}
    var l=this.layout(pattern,game.speed,game.distance),gap=l.gap,span=l.span,spacing=l.spacing;
    var clusterId=pattern.cluster?++this.clusterSerial:0;
    this.lastGap=gap;this.lastWasCluster=!!pattern.cluster;var x=DZ.config.width+50;
    for(var i=0;i<pattern.length;i++){
      var name=pattern[i],def=DZ.obstacleTypes[name];
      if(def&&def.unlock<=game.distance){
        var obstacle=new DZ.Obstacle(name,x+i*spacing);
        if(pattern.cluster){obstacle.clusterId=clusterId;obstacle.clusterIndex=i;obstacle.clusterCount=pattern.length;obstacle.requiresDouble=true;}
        game.obstacles.push(obstacle);
      }
      else if(!def&&!(name==="heart"&&game.player.hearts>=3)){game.collectibles.push(new DZ.Collectible(name,x+i*spacing,DZ.config.groundY-95));}
    }
    if(game.distance>=this.nextShield){game.collectibles.push(new DZ.Collectible("shield",x+90,DZ.config.groundY-110));this.nextShield+=DZ.config.powerups.shieldGap;}
    if(game.distance>=this.nextZoomies){game.collectibles.push(new DZ.Collectible("zoomies",x+130,DZ.config.groundY-120));this.nextZoomies+=DZ.config.powerups.zoomiesGap;}
    if(game.player.hearts<3&&game.distance>=this.nextHeart){game.collectibles.push(new DZ.Collectible("heart",x+100,DZ.config.groundY-100));this.nextHeart+=DZ.config.powerups.heartGap;}
    this.timer=(span+gap*1.35)/game.speed;
  };
  Spawner.prototype.debugState=function(){return"pattern "+this.last+(this.lastWasCluster?" cluster":"")+" gap "+Math.round(this.lastGap);};
  DZ.Spawner=Spawner;
}());
