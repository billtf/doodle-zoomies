(function () {
  "use strict";
  var C = DZ.config, U = DZ.util;
  function Player() { this.reset(); }
  Player.prototype.reset = function () {
    this.x=C.player.startX;this.y=C.groundY;this.vx=0;this.vy=0;this.state="run";this.onGround=true;
    this.coyote=0;this.buffer=0;this.hearts=C.player.hearts;this.invulnerable=0;this.shield=false;
    this.airJumps=C.player.airJumps;this.spinTime=0;this.spinAngle=0;this.doubleJumpPulse=false;
    this.zoomies=0;this.facingBlink=false;this.cleared=0;this.streak=0;
  };
  Player.prototype.jump = function (isDouble) {
    this.vy=-C.player.jumpVelocity;this.onGround=false;this.state="jumpRise";this.coyote=0;this.buffer=0;
    if(isDouble){
      this.airJumps--;this.spinTime=C.player.doubleJumpSpin;this.spinAngle=0;this.doubleJumpPulse=true;
      DZ.audio.sfx("doubleJump");
    }else DZ.audio.sfx("jump");
  };
  Player.prototype.update = function (dt, input, headroom) {
    this.doubleJumpPulse=false;
    var left=input.down("ArrowLeft"), right=input.down("ArrowRight"), down=input.down("ArrowDown");
    if(right)this.vx+=C.player.accel*dt;else if(left)this.vx-=C.player.accel*dt;else this.vx*=Math.max(0,1-8*dt);
    this.vx=U.clamp(this.vx,-C.player.maxMoveSpeed,C.player.maxMoveSpeed);
    this.x=U.clamp(this.x+this.vx*dt,C.player.minX,C.player.maxX);
    if(input.hit("Space")||input.hit("ArrowUp"))this.buffer=C.player.jumpBuffer;else this.buffer-=dt;
    if(this.onGround)this.coyote=C.player.coyote;else this.coyote-=dt;
    if(this.buffer>0){
      if(this.coyote>0)this.jump(false);
      // A press just before landing stays buffered for a normal ground jump instead of spending the double jump.
      else if(!this.onGround&&this.airJumps>0&&this.timeToLand(down)>this.buffer)this.jump(true);
    }
    if(!this.onGround){
      if((input.up("Space")||input.up("ArrowUp"))&&this.vy<0)this.vy*=C.player.jumpCut;
      this.vy+=C.player.gravity*(down?C.player.fastFall:1)*dt;this.y+=this.vy*dt;
      this.state=this.vy<0?"jumpRise":"jumpFall";
      if(this.y>=C.groundY){this.y=C.groundY;this.vy=0;this.onGround=true;this.airJumps=C.player.airJumps;this.spinTime=0;this.spinAngle=0;this.state=down?"duck":"run";DZ.audio.sfx("land");}
    } else if(down){if(this.state!=="duck")DZ.audio.sfx("duck");this.state="duck";}
    else if(this.state==="duck"&&!headroom)this.state="duck";else if(this.state!=="hurt")this.state="run";
    if(this.invulnerable>0){this.invulnerable-=dt;this.facingBlink=((this.invulnerable*10)|0)%2===0;}else this.facingBlink=false;
    if(this.spinTime>0){this.spinTime-=dt;this.spinAngle+=Math.PI*2/C.player.doubleJumpSpin*dt;if(this.spinTime<=0){this.spinTime=0;this.spinAngle=0;}}
    if(this.zoomies>0)this.zoomies-=dt;
  };
  Player.prototype.timeToLand = function (down) {
    if(this.onGround)return 0;
    var g=C.player.gravity*(down?C.player.fastFall:1),h=C.groundY-this.y,v=this.vy;
    return (-v+Math.sqrt(Math.max(0,v*v+2*g*h)))/g;
  };
  Player.prototype.hitbox = function () {
    var size=C.player.hitboxes[this.state==="duck"?"duck":(this.onGround?"run":"jump")];
    return {x:this.x-size[0]/2,y:this.y-size[1],w:size[0],h:size[1]};
  };
  Player.prototype.hit = function () {
    if(this.invulnerable>0||this.zoomies>0)return false;
    if(this.shield){this.shield=false;this.invulnerable=.35;DZ.audio.sfx("hit");return false;}
    this.hearts--;this.invulnerable=C.player.invulnerable;this.state=this.hearts<=0?"knockedOut":"hurt";this.streak=0;DZ.audio.sfx("hit");return true;
  };
  DZ.Player=Player;
}());
