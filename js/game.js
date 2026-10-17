(function () {
  "use strict";
  var C=DZ.config,U=DZ.util;
  function Game(){
    this.state="title";this.time=0;this.player=new DZ.Player();this.spawner=new DZ.Spawner(20261017);
    this.background=new DZ.Background();this.particles=new DZ.Particles();this.obstacles=[];this.collectibles=[];
    this.best=DZ.storage.get("dz.v1.best",{score:0,distance:0});this.score=0;this.distance=0;this.bones=0;
    this.speed=320;this.popup=0;this.gameOverTime=0;this.newBest=false;this.debug=false;this.shake=0;
  }
  Game.prototype.start=function(){
    this.player.reset();this.obstacles.length=0;this.collectibles.length=0;this.spawner=new DZ.Spawner(20261017);
    this.score=0;this.distance=0;this.bones=0;this.popup=0;this.newBest=false;this.state="playing";DZ.audio.sfx("bark");
  };
  Game.prototype.pause=function(){if(this.state==="playing")this.state="paused";};
  Game.prototype.botInput=function(){
    if(!DZ.bot)return;var nearest=null;
    for(var i=0;i<this.obstacles.length;i++){var o=this.obstacles[i];if(o.age>=0&&o.x+o.w>this.player.x-40&&(!nearest||o.x<nearest.x))nearest=o;}
    DZ.input.held.ArrowRight=true;DZ.input.held.ArrowDown=false;
    if(nearest&&nearest.x-this.player.x<175){
      if(nearest.type==="soccer"&&!nearest.botAnswer){
        var arrival=Math.max(0,(nearest.x-this.player.x)/(this.speed+nearest.moving));
        var futureY=nearest.baseY-Math.abs(Math.sin((nearest.age+arrival)*3.2))*105;
        nearest.botAnswer=futureY<C.groundY-80?"duck":"jump";
      }
      if(nearest.answer==="duck"||nearest.botAnswer==="duck")DZ.input.held.ArrowDown=true;
      else if(this.player.onGround&&nearest.x>this.player.x+20)DZ.input.pressed.Space=true;
    }
    if(!this.player.onGround)DZ.input.held.Space=this.player.y>C.groundY-135;
  };
  Game.prototype.update=function(dt){
    this.time+=dt;
    if(DZ.input.hit("KeyM"))DZ.audio.toggle();
    if(DZ.input.hit("Backquote"))this.debug=!this.debug;
    if(this.state==="title"){
      if(DZ.input.hit("KeyH"))this.state="how";
      else if(DZ.input.hit("Space")||DZ.input.hit("Enter"))this.start();
      return;
    }
    if(this.state==="how"){if(Object.keys(DZ.input.pressed).length)this.state="title";return;}
    if(this.state==="paused"){
      if(DZ.input.hit("KeyP")||DZ.input.hit("Escape"))this.state="playing";
      else if(DZ.input.hit("KeyR"))this.state="title";
      return;
    }
    if(this.state==="gameover"){
      this.gameOverTime+=dt;
      if(this.gameOverTime>=C.gameOverGuard&&(DZ.input.hit("Space")||DZ.input.hit("KeyR")))this.start();
      else if(DZ.input.hit("Escape"))this.state="title";
      return;
    }
    if(DZ.input.hit("KeyP")||DZ.input.hit("Escape")){this.state="paused";return;}
    this.botInput();
    this.speed=DZ.difficulty.worldSpeed(this.distance,this.player.x,this.player.zoomies>0);
    var headroom=false,pbox=this.player.hitbox();
    for(var h=0;h<this.obstacles.length;h++)if(this.obstacles[h].answer==="duck"&&U.aabb({x:pbox.x,y:pbox.y-28,w:pbox.w,h:28},this.obstacles[h].hitbox()))headroom=true;
    this.player.update(dt,DZ.input,headroom);
    this.distance+=this.speed*dt*C.metersPerPixel;
    var band=(this.player.x-C.player.minX)/(C.player.maxX-C.player.minX),mult=1+band*.5;
    this.score+=this.speed*dt*C.metersPerPixel*mult*(this.player.zoomies>0?2:1);
    this.spawner.update(dt,this);this.background.update(this.distance);
    pbox=this.player.hitbox();
    for(var i=this.obstacles.length-1;i>=0;i--){
      var o=this.obstacles[i];o.update(dt,this.speed);if(o.age<0)continue;
      if(!o.passed&&o.x+o.w<this.player.x){o.passed=true;this.player.streak++;this.player.cleared++;if(this.player.streak%10===0){this.score+=100;this.popup=1.2;DZ.audio.sfx("streak");}}
      if(U.aabb(pbox,o.hitbox())){if(this.player.hit()){this.particles.burst(this.player.x,this.player.y-30,DZ.palette.gold,12);this.shake=C.reduceMotion?0:.15;}if(this.player.hearts<=0){this.finish();return;}}
      if(o.x+o.w<-20)this.obstacles.splice(i,1);
    }
    for(var j=this.collectibles.length-1;j>=0;j--){
      var c=this.collectibles[j];c.update(dt,this.speed);
      if(U.aabb(pbox,c.hitbox())){this.pickup(c);this.collectibles.splice(j,1);}
      else if(c.x+c.w<0)this.collectibles.splice(j,1);
    }
    this.particles.update(dt);if(this.popup>0)this.popup-=dt;if(this.shake>0)this.shake-=dt;
    DZ.audio.updateMusic(true,DZ.difficulty.tier(this.distance));
  };
  Game.prototype.pickup=function(c){
    if(c.type==="bone"){this.bones++;this.score+=10;DZ.audio.sfx("bone");}
    else if(c.type==="tennis"){this.score+=50;DZ.audio.sfx("tennis");}
    else if(c.type==="shield"){this.player.shield=true;DZ.audio.sfx("power");}
    else if(c.type==="zoomies"){this.player.zoomies=C.powerups.zoomies;DZ.audio.sfx("power");}
    else if(c.type==="heart"){this.player.hearts=Math.min(3,this.player.hearts+1);DZ.audio.sfx("power");}
    this.particles.burst(c.x,c.y,DZ.palette.yellow,8);
  };
  Game.prototype.finish=function(){
    this.state="gameover";this.gameOverTime=0;this.newBest=this.score>this.best.score||this.distance>this.best.distance;
    if(this.newBest){this.best={score:Math.max(this.best.score,this.score),distance:Math.max(this.best.distance,this.distance)};DZ.storage.set("dz.v1.best",this.best);DZ.audio.sfx("bark");}
    else DZ.audio.sfx("gameover");
  };
  Game.prototype.render=function(ctx,fps){
    ctx.save();if(this.shake>0)ctx.translate((Math.random()-.5)*12,(Math.random()-.5)*12);
    this.background.draw(ctx,this.distance,this.time);
    for(var i=0;i<this.obstacles.length;i++){var o=this.obstacles[i];if(o.age>=0)DZ.art.drawObstacle(ctx,o,this.time);}
    for(var j=0;j<this.collectibles.length;j++)DZ.art.drawCollectible(ctx,this.collectibles[j],this.time);
    this.particles.draw(ctx);DZ.art.drawDoodle(ctx,this.player,this.time,false);
    if(this.state!=="title"&&this.state!=="how")DZ.hud.draw(ctx,this);
    if(this.state==="title")DZ.screens.title(ctx,this,this.time);else if(this.state==="how")DZ.screens.how(ctx);
    else if(this.state==="paused")DZ.screens.pause(ctx);else if(this.state==="gameover")DZ.screens.gameover(ctx,this);
    if(this.debug)this.drawDebug(ctx,fps);ctx.restore();
  };
  Game.prototype.drawDebug=function(ctx,fps){
    ctx.font="13px monospace";ctx.textAlign="left";ctx.fillStyle="rgba(0,0,0,.72)";ctx.fillRect(8,92,265,83);ctx.fillStyle="#fff";
    ctx.fillText("FPS "+fps.toFixed(1)+"  speed "+Math.round(this.speed),16,112);ctx.fillText("state "+this.player.state+"  tier "+DZ.difficulty.tier(this.distance),16,130);
    ctx.fillText("objects "+this.obstacles.length+"/"+this.collectibles.length+"/"+this.particles.pool.items.length,16,148);ctx.fillText(this.spawner.debugState(),16,166);
    ctx.strokeStyle="#f0f";ctx.lineWidth=1;var p=this.player.hitbox();ctx.strokeRect(p.x,p.y,p.w,p.h);for(var i=0;i<this.obstacles.length;i++){var b=this.obstacles[i].hitbox();ctx.strokeRect(b.x,b.y,b.w,b.h);}
  };
  DZ.Game=Game;
}());
