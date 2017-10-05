var score = 0;              // つくるけぇボックス取得カウント
var startDate;          // 開始時間
var goalFlg = 0;

function start_js() {
  var textObj = document.getElementById("text_id");
  var cameraObj = document.getElementById("maze-player");
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
        cameraObj.removeAttribute("look-controls");
        cameraObj.setAttribute("universal-controls", "");
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
  }, 2000)
}

function openQRcode() {
  $("#dialog-qrcode").dialog({
    resizable: false,
    width: 200,
    height: 280,
    modal: true,
  });
};

function makeMaze() {

  var w = 15; // 幅（奇数）
  var h = 15; // 高さ（奇数）
  var x;
  var y;
  var maze = new Array();

  // 準備
  for (y = 0; y < h; y++) {
    maze[y] = new Array();
    for (x = 0; x < w; x++) {
      if (y == 0 || y == h - 1 || x == 0 || x == w - 1) {
        maze[y][x] = 1; // 外周
      } else if (y % 2 == 0 && x % 2 == 0) {
        maze[y][x] = 1; // [偶数][偶数]
      } else {
        maze[y][x] = 0; // その他
      }
    }
  }


  // 壁位置
  for (y = 2; y < h - 2; y += 2) {
    for (x = 2; x < w - 2; x += 2) {

      var n;
      if (y == 2) { // 一番上の段
        if (maze[y][x - 1] == 1) {
          n = rand(0, 2);
        } else {
          n = rand(0, 3);
        }
      } else {
        if (maze[y][x - 1] == 1) {
          n = rand(1, 2);
        } else {
          n = rand(1, 3);
        }
      }

      switch (n) {
        case 0: // 上
          maze[y - 1][x] = 1;
          break;
        case 1: // 右
          maze[y][x + 1] = 1;
          break;
        case 2: // 下
          maze[y + 1][x] = 1;
          break;
        default: // 左
          maze[y][x - 1] = 1;
          break;
      }
    }
  }
  return maze;
};

// 乱数取得
function rand(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function initMaze() {
  var map = makeMaze();   // 迷路ロジックの結果（二次元配列）。1が壁を示す。
  var width = 3;          // 壁の幅を設定
  var posX = -1 * width;  // 最初の壁のX座標
  var posZ = -1 * width;  // 最初の壁のZ座標
  var wall;

  /* ハンズオン：A-SCENEエンティティの取得 */
  var sceneEntity = document.querySelector("#maze-scene");

  // 迷路図作成
  for (var z = 0; z < map.length; z++) {
    for (var x = 0; x < map[0].length; x++) {

      // 壁の場合
      if (map[z][x] == 1) {

        wall = document.createElement("a-box");
        wall.setAttribute("position", posX + " " + width / 2 + " " + posZ);
        wall.setAttribute("width", width);
        wall.setAttribute("height", width);
        wall.setAttribute("depth", width);
        wall.setAttribute("static-body", "");
        wall.setAttribute("src", "./images/mason-brick.png");
        wall.setAttribute("material", "repeat:3 3;")

        sceneEntity.appendChild(wall);

        if (x == map[0].length - 1) {
          posX = -1 * width;
          posZ = posZ + width;
        } else {
          posX = posX + width;
        }

        // 壁ではない場合
      } else {
        posX = posX + width;
      }
    }
  }

  //GOALの作成
  var goalx = (map.length - 3) * width;
  var goalz = (map[0].length - 3) * width;

  var pig = document.createElement("a-plane");
  pig.setAttribute("position", goalx + " 0.3 " + goalz);
  pig.setAttribute("height", 1.5);
  pig.setAttribute("width", 1.5);
  pig.setAttribute("src", "./images/pig.png");
  pig.setAttribute("check-goal", "");
  pig.setAttribute("rotation", "0 45 0");
  pig.setAttribute("material", "shader:standard; transparent:true; side:double");
  sceneEntity.appendChild(pig);
}

// 時間表示のための機能。カメラにつけておく。
AFRAME.registerComponent('time-cnt', {
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
})

AFRAME.registerComponent('check-goal', {
  schema: {
    dist: { type: "number", default: 2 }
  },
  init: function () {
    console.log("checl-goal");
  },
  tick: function () {
    if (goalFlg == 0) {
      var cameraPos = this.el.sceneEl.camera.el.object3D.position;
      var goalPos = this.el.object3D.position;

      if (cameraPos.distanceTo(goalPos) < this.data.dist) {
        clear_js();
        goalFlg = 1;
      }
    }
  }
})

function openQRcode() {

  $.dialog({
    theme: 'light',
    title: 'お友達に教えてね',
    content: '<center><img src="./qrcode/maze.png"></img><br />' +
    '<HR>' +
    '本作品はMinecraftのコンテンツを利用しています。<br />' +
    'Mojang © 2009-2017. "Minecraft" は Mojang Synergies AB の登録商標です<br />' +
    '<a href="https://account.mojang.com/terms?ref=ft" target="_blank">利用条件</a></center>',
    closeIcon: true,
  })
};

function onloadFunction() {

  initMaze();

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
        '子豚が迷路内に迷い込んでしまった。いそいで救出しなければ。' +
        '<li>進む方向にスマートフォンを向けます</li>' +
        '<li>画面タッチで前に進みます</li>' +
        '</p>',
        closeIcon: true,
        onClose: function () {
          start_js();
        }
      })
    }
  })
};
