(function () {
  "use strict";
  var canvas=document.getElementById("game"),ctx=canvas.getContext("2d",{alpha:false});
  canvas.width=DZ.config.width;canvas.height=DZ.config.height;canvas.focus();
  DZ.input.init(canvas);DZ.audio.init();DZ.bot=/[?&]bot=1(?:&|$)/.test(location.search);
  var game=DZ.game=new DZ.Game(),last=performance.now(),acc=0,fps=60,frames=0,fpsTime=last;
  function frame(now){
    var delta=Math.min(DZ.config.maxDelta,(now-last)/1000);last=now;acc+=delta;
    while(acc>=DZ.config.step){game.update(DZ.config.step);DZ.input.endFrame();acc-=DZ.config.step;}
    frames++;if(now-fpsTime>=500){fps=frames*1000/(now-fpsTime);frames=0;fpsTime=now;}
    game.render(ctx,fps);requestAnimationFrame(frame);
  }
  function pause(){if(game)game.pause();}
  document.addEventListener("visibilitychange",function(){if(document.hidden)pause();});
  window.addEventListener("blur",pause);
  requestAnimationFrame(frame);
}());
