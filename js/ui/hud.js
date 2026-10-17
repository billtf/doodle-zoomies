(function () {
  "use strict";
  var P=DZ.palette;
  function text(ctx,s,x,y,size,align){ctx.font="900 "+size+"px ui-rounded, system-ui, sans-serif";ctx.textAlign=align||"left";ctx.lineWidth=5;ctx.strokeStyle="rgba(68,53,47,.8)";ctx.strokeText(s,x,y);ctx.fillStyle=P.white;ctx.fillText(s,x,y);}
  DZ.hud={
    text:text,
    draw:function(ctx,g){
      for(var i=0;i<3;i++){ctx.globalAlpha=i<g.player.hearts?1:.2;ctx.fillStyle=P.red;ctx.font="26px system-ui";ctx.fillText("♥",22+i*30,38);}ctx.globalAlpha=1;
      text(ctx,Math.floor(g.distance)+" m",480,38,24,"center");text(ctx,Math.floor(g.score)+"  •  🦴 "+g.bones,936,38,21,"right");
      if(g.player.shield||g.player.zoomies>0){text(ctx,g.player.zoomies>0?"ZOOMIES":"SHIELD",22,68,14);if(g.player.zoomies>0){ctx.fillStyle=P.yellow;ctx.fillRect(22,76,110*(g.player.zoomies/DZ.config.powerups.zoomies),7);}}
      var t=(g.player.x-DZ.config.player.minX)/(DZ.config.player.maxX-DZ.config.player.minX);
      ctx.fillStyle="rgba(68,53,47,.25)";ctx.fillRect(DZ.config.player.minX,DZ.config.groundY+42,DZ.config.player.maxX-DZ.config.player.minX,8);
      ctx.fillStyle=P.yellow;ctx.fillRect(DZ.config.player.minX,DZ.config.groundY+42,(DZ.config.player.maxX-DZ.config.player.minX)*t,8);
      if(g.popup>0)text(ctx,"Good boy! +100",480,120,27,"center");
    }
  };
}());
