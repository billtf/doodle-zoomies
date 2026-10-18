(function () {
  "use strict";
  var P = DZ.palette;
  function box(ctx, x, y, w, h, color, r) {
    DZ.util.roundRect(ctx, x, y, w, h, r || 5); DZ.art.shape(ctx, color);
  }
  DZ.art.drawObstacle = function (ctx, o, time) {
    var x = o.x, y = o.y, w = o.w, h = o.h, name = o.type;
    ctx.save();
    if (o.answer === "duck") {
      ctx.fillStyle = "rgba(55,45,55,.22)"; ctx.beginPath(); ctx.ellipse(x + w / 2, DZ.config.groundY + 2, w * .55, 9, 0, 0, 6.3); ctx.fill();
    }
    if (name === "trash") {
      box(ctx,x,y,w,h,"#7696a2",5); ctx.fillStyle=P.ink; ctx.fillRect(x-4,y+5,w+8,5); ctx.strokeStyle=P.ink; ctx.beginPath();ctx.moveTo(x+10,y+18);ctx.lineTo(x+10,y+h-5);ctx.moveTo(x+28,y+18);ctx.lineTo(x+28,y+h-5);ctx.stroke();
    } else if (name === "hydrant") {
      box(ctx,x+5,y+10,w-10,h-10,P.red,7); box(ctx,x,y+17,w,12,P.red,5); ctx.fillStyle="#7bc6dd";ctx.beginPath();ctx.ellipse(x+w+5,y+h,8,3,0,0,6.3);ctx.fill();
    } else if (name === "gnome") {
      ctx.fillStyle=P.red;ctx.beginPath();ctx.moveTo(x+2,y+23);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w-2,y+23);ctx.closePath();DZ.art.shape(ctx,P.red); box(ctx,x+5,y+22,w-10,h-22,"#4e78ad",6);ctx.fillStyle=P.ink;ctx.fillRect(x+9,y+28,3,3);
    } else if (name === "branch") {
      ctx.strokeStyle="#72513b";ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(x+w,y);ctx.quadraticCurveTo(x+w*.55,y+h*.45,x,y+h-30);ctx.stroke();
      ctx.fillStyle=P.darkGrass;for(var i=0;i<6;i++){ctx.beginPath();ctx.arc(x+15+i*18,y+h-42+Math.sin(time*3+i)*4,13,0,6.3);ctx.fill();}
    } else if (name === "frisbee") {
      ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,6.3);DZ.art.shape(ctx,"#f17885");
    } else if (name === "bins") {
      box(ctx,x,y+5,w*.45,h-5,"#4e9c83",5);box(ctx,x+w*.53,y,w*.47,h,"#5c85bd",5);
    } else if (name === "skateboard") {
      box(ctx,x,y,w,h*.55,"#9b67ad",9);ctx.fillStyle=P.ink;ctx.beginPath();ctx.arc(x+12,y+h,5,0,6.3);ctx.arc(x+w-12,y+h,5,0,6.3);ctx.fill();
    } else if (name === "mailbox") {
      ctx.strokeStyle=P.ink;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x+w/2,y+34);ctx.lineTo(x+w/2,y+h);ctx.stroke();
      box(ctx,x,y,w,36,"#5d87ad",8);ctx.fillStyle=P.red;ctx.fillRect(x+w-8,y+6,6,24);
      ctx.strokeStyle=P.ink;ctx.lineWidth=3;ctx.strokeRect(x+w-8,y+6,6,24);
    } else if (name === "kiddiepool") {
      ctx.beginPath();ctx.ellipse(x+w/2,y+h-8,w/2,15,0,0,Math.PI*2);DZ.art.shape(ctx,"#55bfe3");
      ctx.fillStyle="#b8efff";ctx.beginPath();ctx.ellipse(x+w/2,y+h-12,w*.4,6,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=P.yellow;ctx.beginPath();ctx.arc(x+w*.72,y+3,7,0,Math.PI*2);ctx.fill();
    } else if (name === "flowerpots") {
      for(var p=0;p<3;p++){var px=x+p*25;ctx.fillStyle=p===1?P.yellow:P.red;ctx.beginPath();ctx.arc(px+12,y+8,9,0,Math.PI*2);ctx.fill();box(ctx,px+4,y+14,18,h-14,"#b96d48",3);}
    } else if (name === "gardenhose") {
      ctx.strokeStyle="#42a56d";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x,y+h-4);ctx.bezierCurveTo(x+w*.25,y-8,x+w*.55,y+h+8,x+w,y+2);ctx.stroke();
      ctx.strokeStyle=P.ink;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=P.yellow;ctx.fillRect(x+w-5,y-2,9,10);
    } else if (name === "clothesline") {
      ctx.strokeStyle=P.ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.moveTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.moveTo(x,y+18);ctx.lineTo(x+w,y+18);ctx.stroke();
      for(var j=0;j<3;j++){box(ctx,x+18+j*45,y+18,34,38,j===1?P.yellow:P.blue,3);}
    } else if (name === "soccer") {
      ctx.beginPath();ctx.arc(x+w/2,y+h/2,w/2,0,6.3);DZ.art.shape(ctx,P.white);ctx.fillStyle=P.ink;ctx.beginPath();ctx.arc(x+w/2,y+h/2,7,0,6.3);ctx.fill();
    } else if (name === "sprinkler") {
      box(ctx,x,y+h-20,w,20,"#6d88a4",5);if(o.activeSpray){ctx.strokeStyle="#67c7ef";ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+w/2,y+h-15,35,Math.PI,2*Math.PI);ctx.stroke();}
    } else if (name === "crow") {
      ctx.fillStyle="#34353f";ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,20,12,0,0,6.3);ctx.fill();ctx.beginPath();ctx.moveTo(x+20,y+14);ctx.lineTo(x-5,y+Math.sin(time*8)*8);ctx.lineTo(x+22,y+22);ctx.fill();ctx.fillStyle=P.yellow;ctx.fillRect(x+w-3,y+14,10,4);
    } else if (name === "bike") {
      ctx.strokeStyle=P.ink;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+15,y+h-15,14,0,6.3);ctx.arc(x+w-15,y+h-15,14,0,6.3);ctx.moveTo(x+15,y+h-15);ctx.lineTo(x+34,y+h-42);ctx.lineTo(x+w-15,y+h-15);ctx.lineTo(x+15,y+h-15);ctx.stroke();ctx.beginPath();ctx.arc(x+35,y+16,10,0,6.3);DZ.art.shape(ctx,P.gold);
    }
    ctx.restore();
  };
  DZ.art.drawCollectible = function(ctx,c,time){
    ctx.save();ctx.translate(c.x+c.w/2,c.y+c.h/2);ctx.rotate(Math.sin(time*4+c.x)*.12);
    if(c.type==="bone"){ctx.strokeStyle=P.cream;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();ctx.fillStyle=P.cream;[-12,12].forEach(function(x){ctx.beginPath();ctx.arc(x,-4,5,0,6.3);ctx.arc(x,4,5,0,6.3);ctx.fill();});}
    else if(c.type==="tennis"){ctx.fillStyle="#d8ef58";ctx.beginPath();ctx.arc(0,0,11,0,6.3);ctx.fill();ctx.strokeStyle=P.white;ctx.beginPath();ctx.arc(-7,0,9,-1.3,1.3);ctx.stroke();}
    else {ctx.font="bold 25px system-ui";ctx.textAlign="center";ctx.fillText(c.type==="shield"?"🧸":c.type==="zoomies"?"🥓":"♥",0,8);}
    ctx.restore();
  };
}());
