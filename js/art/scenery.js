(function () {
  "use strict";
  var cache = [];
  function layer(index) {
    if (cache[index]) return cache[index];
    var c = document.createElement("canvas"), x = c.getContext("2d"); c.width = 960; c.height = 540;
    if (index === 0) {
      var g=x.createLinearGradient(0,0,0,440);g.addColorStop(0,"#94d8f5");g.addColorStop(1,"#fff0cf");x.fillStyle=g;x.fillRect(0,0,960,440);
      x.fillStyle="rgba(255,250,190,.75)";x.beginPath();x.arc(790,85,40,0,6.3);x.fill();
    } else if (index === 1) {
      for(var i=0;i<7;i++){var bx=i*160;x.fillStyle=i%2?"#e9a68f":"#f2cf7a";x.fillRect(bx,270,125,170);x.fillStyle="#86594d";x.beginPath();x.moveTo(bx-10,275);x.lineTo(bx+62,220);x.lineTo(bx+135,275);x.fill();x.fillStyle="#9cd0e0";x.fillRect(bx+20,300,28,35);x.fillRect(bx+77,300,28,35);}
    } else if (index === 2) {
      x.fillStyle="#4e8e58";for(var j=0;j<13;j++){x.beginPath();x.arc(j*80+20,360-(j%2)*20,42,0,6.3);x.fill();x.fillStyle="#72513b";x.fillRect(j*80+14,378,12,62);x.fillStyle="#4e8e58";}
      x.strokeStyle="#fff8dc";x.lineWidth=9;for(var k=0;k<10;k++){x.beginPath();x.moveTo(k*110,385);x.lineTo(k*110,440);x.moveTo(k*110-10,398);x.lineTo(k*110+100,398);x.moveTo(k*110-10,425);x.lineTo(k*110+100,425);x.stroke();}
    } else {
      x.fillStyle="#b9b8b4";x.fillRect(0,440,960,100);x.fillStyle="#7fbd66";x.fillRect(0,425,960,18);
      x.strokeStyle="#9a9995";x.lineWidth=2;for(var q=0;q<10;q++){x.beginPath();x.moveTo(q*110,440);x.lineTo(q*110-20,540);x.stroke();}
    }
    cache[index]=c;return c;
  }
  DZ.art.drawBackground = function(ctx,distance,time){
    var offsets=[distance*10,distance*22,distance*50,distance*60], alpha=Math.min(0.32,(distance%2500)/2500*.32);
    for(var i=0;i<4;i++){var img=layer(i),off=-(offsets[i]%960);ctx.drawImage(img,off,0);ctx.drawImage(img,off+960,0);}
    if(alpha){ctx.fillStyle="rgba(91,57,120,"+alpha+")";ctx.fillRect(0,0,960,540);}
  };
}());
