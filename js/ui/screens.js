(function () {
  "use strict";
  var T=function(c,s,x,y,z,a){DZ.hud.text(c,s,x,y,z,a||"center");};
  DZ.screens={
    title:function(ctx,g,time){
      ctx.fillStyle="rgba(75,53,50,.2)";ctx.fillRect(0,0,960,540);
      T(ctx,"DOODLE",480,132,70);T(ctx,"ZOOMIES",480,197,62);
      DZ.art.drawDoodle(ctx,{x:480,y:355,state:"run",onGround:true,facingBlink:false},time,true);
      T(ctx,"Press Space to start",480,443,25);T(ctx,"H: How to play    M: Sound "+(DZ.audio.muted?"off":"on"),480,484,16);
      T(ctx,"Best: "+Math.floor(g.best.score)+"  •  "+Math.floor(g.best.distance)+" m",480,520,16);
    },
    how:function(ctx){
      ctx.fillStyle="rgba(48,55,63,.88)";ctx.fillRect(0,0,960,540);T(ctx,"HOW TO PLAY",480,92,43);
      T(ctx,"←  →   Move and change speed",480,180,25);T(ctx,"SPACE / ↑   Jump — hold to go higher",480,240,25);
      T(ctx,"↓   Duck — or fast fall in the air",480,300,25);T(ctx,"P / ESC   Pause        M   Mute",480,360,25);
      T(ctx,"Grab treats. Dodge the neighborhood!",480,426,21);T(ctx,"Press any key to go back",480,490,17);
    },
    pause:function(ctx){ctx.fillStyle="rgba(35,36,48,.62)";ctx.fillRect(0,0,960,540);T(ctx,"PAUSED",480,230,55);T(ctx,"P / Esc resume   •   R restart   •   M mute",480,300,20);},
    gameover:function(ctx,g){ctx.fillStyle="rgba(52,42,47,.7)";ctx.fillRect(0,0,960,540);T(ctx,"ZOOMIES OVER",480,155,50);T(ctx,Math.floor(g.distance)+" m   •   "+Math.floor(g.score)+" points",480,230,27);T(ctx,"Bones: "+g.bones,480,275,20);if(g.newBest)T(ctx,"NEW BEST! ★",480,330,28);T(ctx,"Space / R to run again   •   Esc for title",480,410,20);}
  };
}());
