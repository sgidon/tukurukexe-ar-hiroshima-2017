var score = 0;
var startDate;

// つくるけぇボックス配置ランダムポジション作成関数
function randomPos(xRng, yRng, zRng) {
  var xpos = (Math.random() - 0.5) * xRng;
  var ypos = (Math.random() - 0.5) * yRng;
  var zpos = (Math.random() - 0.5) * zRng;
  while ((-80 <= xpos) && (xpos <= 80) && (-200 <= ypos) && (ypos <= 0) && (-450 <= zpos) && (zpos <= 450)) {
    console.log("wrong box pos: " + xpos + " " + ypos + " " + zpos);
    xpos = (Math.random() - 0.5) * xRng;
    ypos = (Math.random() - 0.5) * yRng;
    zpos = (Math.random() - 0.5) * zRng;
  }
  return xpos + " " + ypos + " " + zpos;
}

function initSpace() {
  // チリに見立てたパーティクルを配置する。
  var sceneObj = document.getElementById("scene_id");
  for (var i = 1; i <= 1000; i++) {
    var sphere = document.createElement("a-sphere");
    sphere.id = "sphere" + (("0000" + i).slice(-4));
    sphere.setAttribute("class", "sphere-class");
    sphere.setAttribute("position", (Math.random() - 0.5) * 2000 + " " + (Math.random() - 0.5) * 2000 + " " + (Math.random() - 0.5) * 2000);
    sphere.setAttribute("color", "white");
    sphere.setAttribute("radius", "3");
    sphere.setAttribute("opacity", "0.5");
    sceneObj.appendChild(sphere);
  }

  // つくるけぇボックス情報
  var tukurukexe =
    {
      "tsu": { "img": "#tsu", "scale": 100 },
      "ku": { "img": "#ku", "scale": 100 },
      "ru": { "img": "#ru", "scale": 100 },
      "ke": { "img": "#ke", "scale": 100 },
      "xe": { "img": "#xe", "scale": 80 },
      "ex": { "img": "#ex", "scale": 100 }
    };

  // つくるけぇボックス作成
  var box;
  var anime;
  for (var i in tukurukexe) {
    var imgname = tukurukexe[i].img;
    var scaleSize = tukurukexe[i].scale;
    box = document.createElement("a-box");
    box.setAttribute("src", imgname);
    box.setAttribute("point-logo", "str:" + i + ";size:" + scaleSize);
    box.setAttribute("scale", scaleSize + " " + scaleSize + " " + scaleSize);
    box.setAttribute("position", randomPos(2000, 2000, 2000));

    anime = document.createElement("a-animation");
    anime.setAttribute("attribute", "rotation");
    anime.setAttribute("from", "0 0 0");
    anime.setAttribute("to", "360 360 360");
    anime.setAttribute("dur", "4000");
    anime.setAttribute("easing", "linear");
    anime.setAttribute("repeat", "indefinite");

    box.appendChild(anime);
    sceneObj.appendChild(box);
  }
}

function openQRcode() {

  $.dialog({
    theme: 'light',
    title: 'お友達に教えてね',
    content: '<center><img src="./qrcode/spaceship.png"></img></center>',
    closeIcon: true,
  })
};

// つくるけぇロゴボックスの動作
AFRAME.registerComponent('point-logo', {
  schema: {
    str: { type: 'string' },
    size: { type: 'number' }
  },
  init: function () {
  },
  tick: function () {
    var cameraPos = this.el.sceneEl.camera.el.object3D.position;
    var boxPos = this.el.object3D.position;

    if (cameraPos.distanceTo(boxPos) < this.data.size) {
      score = score + 1;
      var img = document.getElementById("img-" + this.data.str);
      img.style.opacity = 1;
      this.el.parentNode.removeChild(this.el);
      if (score >= 6) {
        clear_js();
      }
    }
  }
});

// 時間表示のための機能。カメラにつけておく。
AFRAME.registerComponent('cnt-time', {
  schema: {
  },
  init: function () {
  },
  tick: function () {
    if (startDate != undefined) {
      var lapTime = new Date();
      var diff = lapTime.getTime() - startDate.getTime();
      var lapText = document.getElementById("lapText");
      var msec = diff % 1000;
      var sec = (diff - msec) % (1000 * 60) / 1000;
      var min = (diff - sec * 1000 - msec) % (1000 * 60 * 60) / (1000 * 60);
      var lapTime = ("00" + min).slice(-2) + ":" + ("00" + sec).slice(-2);
      lapText.value = lapTime;
    }
  }
});


// START処理
function start_js() {

  var textObj = document.getElementById("text_id");
  var cameraObj = document.getElementById("camera_id");
  textObj.emit("start");

  setTimeout(() => {
    textObj.setAttribute("text", "align:center; baseline:center; value:2; width:10; height:10");
    textObj.emit("start");
    setTimeout(() => {
      textObj.setAttribute("text", "align:center; baseline:center; value:1; width:10; height:10");
      textObj.emit("start");
      setTimeout(() => {
        textObj.setAttribute("text", "align:center; baseline:center; value:GO!!; width:10; height:10");
        textObj.setAttribute("color", "red");
        textObj.emit("start");

        // START後の動作を記載する。
        cameraObj.setAttribute("universal-controls", "movementSpeed:200; movementAcceleration:200; movementEasing:1; movementEasingY:1; fly: true");
        startDate = new Date();
        updateStatus("start", "00:00");

      }, 1100);
    }, 1100);
  }, 1100);
}

// GAME CLEAR時処理
function clear_js() {
  timeStr = "time [" + document.getElementById("lapText").value + "]";
  var textObj = document.getElementById("text_id");
  textObj.setAttribute("text", "align:center; baseline:center; value:GAME CLEAR!!\n" + timeStr + "; width:10; height:10");
  textObj.emit("clear");
  updateStatus("clear", document.getElementById("lapText").value);

  setTimeout(function () {
    $.dialog({
      theme: 'light',
      title: 'AR勉強会に来てね',
      content: 'AR勉強会ブースで別のゲームがもらえるよ！<br />ぜひ遊びに来てね',
      closeIcon: true,
    })
  }, 2000)};

// onload時処理
function onloadFunction() {

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
        'スペースシャトルから大事な「つくるけぇ！」が飛び出してしまった。時間がない。すぐに回収してほしい。' +
        '<li>進む方向にスマートフォンを向けます</li>' +
        '<li>画面タッチで前に進みます</li>' +
        '<li>つくるけぇ！をすべて取るとクリア</li>' +
        '</p>',
        closeIcon: true,
        onClose: function () {
          start_js();
        }
      })
    }
  })

  initSpace();

};

