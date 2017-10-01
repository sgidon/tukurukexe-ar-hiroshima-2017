var rad = 12;
var rad_min = 0.5;
var x, z, x_min, z_min, angle;
var sceneObj, plane;

var targetObj = "";
var playerAliveFlg = true;
var zombieCnt = 50;
var zombieCreateCnt = 0;
var zombieDeathCnt = 0;

function createZombie() { 

  sceneObj = document.getElementById('scene_id');
  plane = document.createElement("a-plane");
  angle = Math.random() * 360
  x = rad * Math.cos(angle / 180 * Math.PI);
  z = rad * Math.sin(angle / 180 * Math.PI);
  x_min = rad_min * Math.cos(angle / 180 * Math.PI);
  z_min = rad_min * Math.sin(angle / 180 * Math.PI);
  plane.setAttribute("position",x + " -1.5 " + z);
  plane.setAttribute("material","shader: standard; transparent: true; side: double;");
  if (zombieCreateCnt == 40) {
    plane.setAttribute("width",3);
    plane.setAttribute("height",5);
    plane.setAttribute("src","./images/zombie3.png");
    plane.setAttribute("zombie-shoot","hitPoint:50; walkSpeed:30000");
  } else {
    plane.setAttribute("width",2);
    plane.setAttribute("height",3);
    if (Math.random() <= 0.9) {
      plane.setAttribute("src","./images/zombie1.png");
      plane.setAttribute("zombie-shoot","hitPoint:1;");
    } else {
      plane.setAttribute("src","./images/zombie2.png");
      plane.setAttribute("zombie-shoot","hitPoint:3;");
    }
  }
  plane.setAttribute("look-at","[camera]");
  plane.className = "zombie_class";

  sceneObj.appendChild(plane);

  zombieCreateCnt++;
  if (( playerAliveFlg == true ) && ( zombieCreateCnt < zombieCnt )) {
    if (zombieCreateCnt <= 20) {
      setTimeout(createZombie, 3000);
    } else {
      setTimeout(createZombie, 1500);
    }
  }
}

function targetClick() {
  if (targetObj != "") {
    targetObj.click();
  }
};

  // ONLOAD後処理
function start_js() {

  var textObj = document.getElementById("text_id");
  var cameraObj = document.getElementById("camera_id");
  textObj.emit("start");

  setTimeout(() => {
    textObj.setAttribute("text","align:center; baseline:center; value:2; width:10; height:10");
    textObj.emit("start");
    setTimeout(() => {
      textObj.setAttribute("text","align:center; baseline:center; value:1; width:10; height:10");
      textObj.emit("start");
      setTimeout(() => {
        textObj.setAttribute("text","align:center; baseline:center; value:GO!!; width:10; height:10");
        textObj.setAttribute("color","red");
        textObj.emit("start");

        // START後の動作を記載する。
        updateStatus("start", zombieDeathCnt);
        createZombie();

      }, 1100);
    }, 1100);
  }, 1100);
}

// GAME CLEAR時処理
function clear_js() {
  var raycasterObj = document.getElementById("raycaster_id");
  raycasterObj.parentNode.removeChild(raycasterObj);
  
  var textObj = document.getElementById("text_id");
  textObj.setAttribute("text","align:center; baseline:center; value:GAME CLEAR!!; width:10; height:10");
  textObj.emit("clear");
  
  updateStatus("clear", zombieDeathCnt);

  setTimeout(function() {
    $.dialog({
      theme: 'light',
      title: 'AR勉強会に来てね',
      content: 'AR勉強会ブースで別のゲームがもらえるよ！<br />ぜひ遊びに来てね',
      closeIcon: true,
    })
  }, 2000)
}

// GAME OVER時処理
function gameover_js() {
  var raycasterObj = document.getElementById("raycaster_id");
  raycasterObj.parentNode.removeChild(raycasterObj);
  
  var textGameoverObj = document.getElementById("text_gameover_id");
  textGameoverObj.style.display="inline";
  updateStatus("dead", zombieDeathCnt);
}

AFRAME.registerComponent('zombie-shoot',{
  schema: {
    dist: {type: "number", default: 0.6},
    hitPoint: {type: "number", default: 1},
    walkSpeed: {type: "number", default: 10000}
  },
  init: function() {
    var hitCount = this.data.hitPoint;
    var walkSpeed = this.data.walkSpeed;
    this.el.addEventListener("click", function(e) {
      hitCount--;
      e.target.emit("hit");
      if (hitCount <= 0) {
        e.target.parentNode.removeChild(e.target);
        zombieDeathCnt++;
        if (zombieDeathCnt >= zombieCnt) {
          clear_js();
        }
      }
    });
    this.el.addEventListener("raycaster-intersected", function(e) {
      targetObj = e.target;
    });
    this.el.addEventListener("raycaster-intersected-cleared", function(e) {
      targetObj = "";
    })

    var anime = document.createElement("a-animation");
    anime.setAttribute("attribute","position");
    anime.setAttribute("from",x + " -1.5 " + z);
    anime.setAttribute("to",x + " 1.5 " + z);
    anime.setAttribute("dur","1000");
    anime.setAttribute("easing","linear");
    anime.setAttribute("repeat",0);

    var anime2 = document.createElement("a-animation");
    anime2.setAttribute("attribute","position");
    anime2.setAttribute("from",x + " 1.5 " + z);
    anime2.setAttribute("to",x_min + " 1.5 " + z_min);
    anime2.setAttribute("dur",walkSpeed);
    anime2.setAttribute("delay","1000");
    anime2.setAttribute("easing","linear");
    anime2.setAttribute("repeat",0);

    var anime3 = document.createElement("a-animation");
    anime3.setAttribute("attribute","opacity");
    anime3.setAttribute("direction","alternate");
    anime3.setAttribute("begin","hit");
    anime3.setAttribute("from","1");
    anime3.setAttribute("to","0.5");
    anime3.setAttribute("dur","50");
    anime3.setAttribute("easing","linear");
    anime3.setAttribute("repeat",1);

    this.el.appendChild(anime);
    this.el.appendChild(anime2);
    this.el.appendChild(anime3);

  },
  tick: function() {
    if (playerAliveFlg == true) {
      var cameraPos = this.el.sceneEl.camera.el.object3D.position;
      var zombiePos = this.el.object3D.position;

      if (cameraPos.distanceTo(zombiePos) < this.data.dist) {
        console.log("dead!!");
        playerAliveFlg = false;
        gameover_js();
      }
    }
  }
})

function openQRcode() {

  $.dialog({
    theme: 'light',
    title: 'お友達に教えてね',
    content: '<center><img src="./qrcode/zombieShoot.png"></img></center>',
    closeIcon: true,
  })
};

function onloadFunction() {

  document.getElementById("shoot_btn_id").addEventListener("touchEnd", event => {
    event.preventDefault();
  }, false);

  $.dialog({
    theme: 'light',
    title: '注 意 事 項',
    content: 'スマートフォンは両手でしっかり持ち、<br>' +
    '周りに注意して遊びましょう。',
    closeIcon: true,
    onClose: function () {
      $.dialog({
        theme: 'light',
        title: '操 作 方 法',
        content: '<p>' +
        'ゾンビが襲ってきた。目標をセンターに入れてスイッチ！！ 一発で倒せないゾンビもいるようだ。とくにボスには気をつけろ。'+
        '<li>ゾンビに真ん中の照準を合わせます。</li>' +
        '<li>右下ボタンタッチでゾンビを倒せます。</li>' +
        '<li>すべてのゾンビを倒すとクリアです</li>' +
        '</p>',
        closeIcon: true,
        onClose: function () {
          start_js();
        }
      })
    }
  })
};


