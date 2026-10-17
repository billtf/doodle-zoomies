(function(){
  "use strict";
  var out=document.getElementById("results"),lines=[],passed=0,failed=0;
  window.DZ.audio={sfx:function(){}};
  function test(name,fn){try{fn();passed++;lines.push("PASS  "+name);}catch(e){failed++;lines.push("FAIL  "+name+": "+e.message);}}
  function ok(value,message){if(!value)throw new Error(message||"assertion failed");}
  function near(a,b,t){ok(Math.abs(a-b)<=t,a+" not within "+t+" of "+b);}
  test("AABB overlap and edge separation",function(){ok(DZ.util.aabb({x:0,y:0,w:10,h:10},{x:9,y:9,w:2,h:2}));ok(!DZ.util.aabb({x:0,y:0,w:10,h:10},{x:10,y:0,w:2,h:2}));});
  test("seeded RNG is deterministic",function(){var a=new DZ.util.RNG(7),b=new DZ.util.RNG(7);for(var i=0;i<100;i++)ok(a.next()===b.next());});
  test("dog names are sanitized and limited to 12 characters",function(){
    ok(DZ.profile.sanitizeName("  Zoomie!! Pup  ")==="Zoomie Pup");
    ok(DZ.profile.sanitizeName("abcdefghijklmnop")==="abcdefghijkl");
    ok(DZ.profile.sanitizeName("   ")==="Doodle");
  });
  test("coat palette has eight unique presets",function(){
    var seen={};ok(DZ.art.coatPresets.length===8);for(var i=0;i<DZ.art.coatPresets.length;i++){var id=DZ.art.coatPresets[i].id;ok(!seen[id]);seen[id]=1;}
  });
  test("coat sprites rebuild only when the preset changes",function(){
    DZ.art.setCoat("apricot");var before=DZ.art.coatCacheBuilds,canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
    for(var i=0;i<100;i++)DZ.art.drawDoodle(ctx,{x:60,y:94,state:"run",onGround:true,facingBlink:false},i/60,false);
    ok(DZ.art.coatCacheBuilds===before);DZ.art.setCoat("blue");ok(DZ.art.coatCacheBuilds===before+1);
    DZ.art.setCoat("apricot");
  });
  test("speed formula has 70% minimum and 135% maximum",function(){near(DZ.difficulty.worldSpeed(0,DZ.config.player.minX,false),224,.01);near(DZ.difficulty.worldSpeed(0,DZ.config.player.maxX,false),432,.01);});
  test("difficulty table and cap",function(){ok(DZ.difficulty.baseSpeed(0)===320);ok(DZ.difficulty.baseSpeed(250)===380);ok(DZ.difficulty.baseSpeed(800)===450);ok(DZ.difficulty.baseSpeed(99999)===640);});
  test("full jump apex is about 155 px",function(){
    var p=new DZ.Player(),input={down:function(){return false;},hit:function(k){return k==="Space";},up:function(){return false;}},min=p.y;
    p.update(1/60,input,false);input.hit=function(){return false;};for(var i=0;i<90;i++){p.update(1/60,input,false);min=Math.min(min,p.y);}near(DZ.config.groundY-min,155,8);
  });
  test("duck hitbox clears 30 px opening",function(){var p=new DZ.Player();p.state="duck";var b=p.hitbox();ok(b.h===22&&b.y>DZ.config.groundY-30);});
  test("all 12 obstacles are present and unlock by 1600 m",function(){var keys=Object.keys(DZ.obstacleTypes);ok(keys.length===12);for(var i=0;i<keys.length;i++)ok(DZ.obstacleTypes[keys[i]].unlock<=1600);});
  test("24 patterns span four tiers",function(){var s=new DZ.Spawner(1);ok(s.patterns.length>=20);for(var t=0;t<4;t++)ok(s.choose(t).length>0);});
  test("10,000 spawns per tier preserve reaction plus full-arc gap",function(){
    for(var tier=0;tier<4;tier++){var s=new DZ.Spawner(9+tier),m=[0,250,800,1600][tier],speed=DZ.difficulty.baseSpeed(m)*1.35,last=-1;
      for(var i=0;i<10000;i++){var p=s.choose(tier);ok(s.last!==last,"repeated pattern");last=s.last;var gap=s.minimumGap(speed);ok(gap>=speed*(.35+2*900/2600)-.001);ok(p.length>0);}}
  });
  test("storage falls back when localStorage throws",function(){
    var proto=Object.getPrototypeOf(localStorage),oldGet=proto.getItem,oldSet=proto.setItem;
    proto.getItem=function(){throw new Error("blocked");};proto.setItem=function(){throw new Error("blocked");};
    DZ.storage.set("test.throw",{safe:true});ok(DZ.storage.get("test.throw",null).safe);proto.getItem=oldGet;proto.setItem=oldSet;
  });
  test("profile persists through the safe storage wrapper",function(){
    var key=DZ.profile.key;DZ.profile.key="dz.v1.profile.test";
    DZ.profile.save({name:"Pepper<script>",color:"pink",customized:false});var p=DZ.profile.load();
    ok(p.name==="Pepperscript");ok(p.color==="pink");ok(p.customized===true);DZ.profile.key=key;
  });
  test("per-player bests migrate, merge case-insensitively, and rank top five",function(){
    var key=DZ.bests.key,legacy=DZ.bests.legacyKey;
    DZ.bests.key="dz.v1.bests.test";DZ.bests.legacyKey="dz.v1.best.test";
    DZ.storage.remove(DZ.bests.key);DZ.storage.remove(DZ.bests.legacyKey);
    DZ.storage.set(DZ.bests.legacyKey,{score:120,distance:40});
    var all=DZ.bests.loadAll("Milo",true),milo=DZ.bests.get(all,"mILO");
    ok(milo.score===120&&milo.distance===40);ok(DZ.storage.get(DZ.bests.legacyKey,null)===null);
    DZ.bests.update(all,"MILO",150,35);ok(DZ.bests.get(all,"milo").score===150);ok(DZ.bests.get(all,"milo").distance===40);
    DZ.bests.update(all,"Poppy",500,20);DZ.bests.update(all,"Scout",400,20);DZ.bests.update(all,"Blue",300,20);
    DZ.bests.update(all,"Goldie",200,20);DZ.bests.update(all,"Pepper",100,20);
    var top=DZ.bests.top(all,5);ok(top.length===5);ok(top[0].name==="Poppy");ok(top[4].name==="MILO");
    DZ.storage.remove(DZ.bests.key);DZ.storage.remove(DZ.bests.legacyKey);DZ.bests.key=key;DZ.bests.legacyKey=legacy;
  });
  test("20,000 tick entity simulation remains finite and bounded",function(){
    var game={distance:0,speed:320,obstacles:[],collectibles:[],player:{hearts:2}},s=new DZ.Spawner(55);
    for(var i=0;i<20000;i++){game.distance+=game.speed/60/50;game.speed=DZ.difficulty.baseSpeed(game.distance);s.update(1/60,game);
      for(var j=game.obstacles.length-1;j>=0;j--){game.obstacles[j].update(1/60,game.speed);if(game.obstacles[j].x<0)game.obstacles.splice(j,1);}
      for(var k=game.collectibles.length-1;k>=0;k--){game.collectibles[k].update(1/60,game.speed);if(game.collectibles[k].x<0)game.collectibles.splice(k,1);}
      ok(Number.isFinite(game.distance));ok(game.obstacles.length<=DZ.config.limits.obstacles+3);ok(game.collectibles.length<40);
    }
  });
  lines.push("");lines.push(passed+" passed, "+failed+" failed");out.textContent=lines.join("\n");out.className=failed?"fail":"pass";document.title=failed?"FAIL":"PASS";window.DZ_TEST_RESULT={passed:passed,failed:failed};
}());
