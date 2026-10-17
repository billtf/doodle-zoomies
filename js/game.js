(function () {
  "use strict";
  var C=DZ.config,U=DZ.util;
  function Game(){
    this.state="title";this.time=0;this.player=new DZ.Player();this.spawner=new DZ.Spawner(20261017);
    this.background=new DZ.Background();this.particles=new DZ.Particles();this.obstacles=[];this.collectibles=[];
    this.profile=DZ.profile.load();this.profile.color=DZ.art.setCoat(this.profile.color);
    this.bests=DZ.bests.loadAll(this.profile.name,this.profile.customized);
    this.best=DZ.bests.get(this.bests,this.profile.name);this.leaderboard=DZ.bests.top(this.bests,5);
    this.customizeDraft=null;this.customizeOriginal=null;this.customizeBest=this.best;this.customizeStart=false;this.customizeFresh=false;
    this.score=0;this.distance=0;this.bones=0;
    this.speed=320;this.popup=0;this.gameOverTime=0;this.newBest=false;this.debug=false;this.shake=0;
    this.cameraOffset={x:0,y:0};this.frozenTime=0;
  }
  Game.prototype.start=function(){
    this.player.reset();this.obstacles.length=0;this.collectibles.length=0;this.spawner=new DZ.Spawner(20261017);
    this.score=0;this.distance=0;this.bones=0;this.popup=0;this.newBest=false;this.shake=0;this.frozenTime=0;this.state="playing";DZ.audio.sfx("bark");
  };
  Game.prototype.openCustomize=function(startAfter){
    this.customizeOriginal={name:this.profile.name,color:this.profile.color,customized:this.profile.customized};
    this.customizeDraft={name:this.profile.name,color:this.profile.color};
    this.customizeBest=DZ.bests.get(this.bests,this.customizeDraft.name);
    this.customizeStart=!!startAfter;this.customizeFresh=true;this.state="customize";
    DZ.input.setTextMode(true);DZ.art.setCoat(this.customizeDraft.color);
  };
  Game.prototype.updateCustomize=function(){
    var input=DZ.input,draft=this.customizeDraft,presets=DZ.art.coatPresets;
    if(input.backspace){draft.name=draft.name.slice(0,-1);this.customizeFresh=false;this.customizeBest=DZ.bests.get(this.bests,draft.name);}
    if(input.text){
      var typed=input.text.replace(/[^a-zA-Z0-9 '\-]/g,"");
      draft.name=(this.customizeFresh?typed:draft.name+typed).slice(0,12);this.customizeFresh=false;
      this.customizeBest=DZ.bests.get(this.bests,draft.name);
    }
    var direction=(input.hit("ArrowRight")||input.hit("ArrowDown"))?1:
      ((input.hit("ArrowLeft")||input.hit("ArrowUp"))?-1:0);
    if(direction){
      var index=(DZ.art.coatIndex(draft.color)+direction+presets.length)%presets.length;
      draft.color=presets[index].id;DZ.art.setCoat(draft.color);
    }
    if(input.hit("Enter")){
      this.profile={name:DZ.profile.sanitizeName(draft.name),color:draft.color,customized:true};
      DZ.profile.save(this.profile);DZ.bests.migrateLegacy(this.bests,this.profile.name);
      this.best=DZ.bests.get(this.bests,this.profile.name);this.leaderboard=DZ.bests.top(this.bests,5);
      DZ.input.setTextMode(false);
      if(this.customizeStart)this.start();else this.state="title";
    }else if(input.hit("Escape")){
      this.profile=this.customizeOriginal;DZ.art.setCoat(this.profile.color);DZ.input.setTextMode(false);this.state="title";
    }
  };
  Game.prototype.pause=function(){if(this.state==="playing"){this.shake=0;this.frozenTime=this.time;this.state="paused";}};
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
      else if(nearest.requiresDouble&&!this.player.onGround&&this.player.airJumps>0&&(nearest.clusterIndex>0||nearest.x-this.player.x<50))DZ.input.pressed.Space=true;
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
      else if(DZ.input.hit("KeyC"))this.openCustomize(false);
      else if(DZ.input.hit("Space")||DZ.input.hit("Enter")){
        if(this.profile.customized)this.start();else this.openCustomize(true);
      }
      return;
    }
    if(this.state==="customize"){this.updateCustomize();return;}
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
    if(DZ.input.hit("KeyP")||DZ.input.hit("Escape")){this.pause();return;}
    this.botInput();
    this.speed=DZ.difficulty.worldSpeed(this.distance,this.player.x,this.player.zoomies>0);
    var headroom=false,pbox=this.player.hitbox();
    for(var h=0;h<this.obstacles.length;h++)if(this.obstacles[h].answer==="duck"&&U.aabb({x:pbox.x,y:pbox.y-28,w:pbox.w,h:28},this.obstacles[h].hitbox()))headroom=true;
    this.player.update(dt,DZ.input,headroom);
    if(this.player.doubleJumpPulse)this.particles.burst(this.player.x,this.player.y-28,DZ.palette.white,10);
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
    this.shake=0;this.frozenTime=this.time;this.state="gameover";this.gameOverTime=0;this.newBest=this.score>this.best.score||this.distance>this.best.distance;
    if(this.newBest){this.best=DZ.bests.update(this.bests,this.profile.name,this.score,this.distance);this.leaderboard=DZ.bests.top(this.bests,5);DZ.audio.sfx("bark");}
    else DZ.audio.sfx("gameover");
  };
  Game.prototype.render=function(ctx,fps){
    var visualTime=this.state==="playing"?this.time:((this.state==="paused"||this.state==="gameover")?this.frozenTime:0);
    U.screenOffset(this.state,this.shake,C.reduceMotion,Math.random,this.cameraOffset);
    ctx.save();if(this.cameraOffset.x||this.cameraOffset.y)ctx.translate(this.cameraOffset.x,this.cameraOffset.y);
    this.background.draw(ctx,this.distance,visualTime);
    for(var i=0;i<this.obstacles.length;i++){var o=this.obstacles[i];if(o.age>=0)DZ.art.drawObstacle(ctx,o,visualTime);}
    for(var j=0;j<this.collectibles.length;j++)DZ.art.drawCollectible(ctx,this.collectibles[j],visualTime);
    this.particles.draw(ctx);
    if(this.state!=="title"&&this.state!=="how"&&this.state!=="customize")DZ.art.drawDoodle(ctx,this.player,visualTime,false,this.state!=="playing");
    if(this.state!=="title"&&this.state!=="how"&&this.state!=="customize")DZ.hud.draw(ctx,this);
    if(this.state==="title")DZ.screens.title(ctx,this,0);else if(this.state==="how")DZ.screens.how(ctx);
    else if(this.state==="customize")DZ.screens.customize(ctx,this,0);
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
