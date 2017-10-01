var score = 0;              // つくるけぇボックス取得カウント
var startDate;          // 開始時間

var mazeSize = 10;       // 迷路の縦横サイズ
var width = 3;          // 壁の幅を設定
var posX = -1 * width;  // 最初の壁のX座標
var posZ = -1 * width;  // 最初の壁のZ座標
var map = makeMaze(mazeSize);   // 迷路ロジックの結果（二次元配列）。1が壁を示す。

function makeMaze(mazeSize) {

  var w = mazeSize; // 幅（奇数）
  var h = mazeSize; // 高さ（奇数）
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
  // つくるけぇボックス情報
  var tukurukexe =
    {
      "tsu": { "img": "#tsu", "scale": 1 },
      "ku": { "img": "#ku", "scale": 1 },
      "ru": { "img": "#ru", "scale": 1 },
      "ke": { "img": "#ke", "scale": 1 },
      "xe": { "img": "#xe", "scale": 1 },
      "ex": { "img": "#ex", "scale": 1 }
    };

  // つくるけぇボックス配置情報の設定
  for (var i in tukurukexe) {
    var t_posx = Math.floor(Math.random() * mazeSize);
    var t_posz = Math.floor(Math.random() * mazeSize);
    console.log(i + " x:" + t_posx + " z:" + t_posz + " map:" + map[t_posz][t_posx]);
    while (map[t_posz][t_posx] != 0) {
      var t_posx = Math.floor(Math.random() * mazeSize);
      var t_posz = Math.floor(Math.random() * mazeSize);
      console.log(i + " x:" + t_posx + " z:" + t_posz + " map:" + map[t_posz][t_posx]);
    }
    map[t_posz][t_posx] = i;
  }

  /* ハンズオン：A-SCENEエンティティの取得 */
  var sceneEntity = document.querySelector("#maze-scene");

  // 迷路図作成
  for (var z = 0; z < map.length; z++) {
    for (var x = 0; x < map[0].length; x++) {

      // 壁の場合
      if (map[z][x] == 1) {

        var wall = document.createElement("a-box");

        wall.setAttribute("position", posX + " " + width / 2 + " " + posZ);
        wall.setAttribute("width", width);
        wall.setAttribute("height", width);
        wall.setAttribute("depth", width);
        wall.setAttribute("src", "#stoneWall");
        wall.setAttribute("static-body", "");

        wall.setAttribute("visible-wall", "distance: 5");

        sceneEntity.appendChild(wall);

        if (x == map[0].length - 1) {
          posX = -1 * width;
          posZ = posZ + width;
        } else {
          posX = posX + width;
        }

      } else if (map[z][x] == 0) {
        // 壁ではない場合
        posX = posX + width;
      } else {
        // つくるけぇボックスの配置
        var i = map[z][x];
        var imgname = tukurukexe[i].img;
        var scaleSize = tukurukexe[i].scale;

        var box = document.createElement("a-box");
        box.setAttribute("src", imgname);
        box.setAttribute("point-logo", "str:" + i + ";size:" + scaleSize);
        box.setAttribute("scale", "1 1 1");
        box.setAttribute("position", posX + " " + width / 2 + " " + posZ);

        anime = document.createElement("a-animation");
        anime.setAttribute("attribute", "rotation");
        anime.setAttribute("from", "0 0 0");
        anime.setAttribute("to", "360 360 360");
        anime.setAttribute("dur", "4000");
        anime.setAttribute("easing", "linear");
        anime.setAttribute("repeat", "indefinite");

        box.appendChild(anime);
        sceneEntity.appendChild(box);

        posX = posX + width;
      }

    }
  }
}

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
}

function openQRcode() {

  $("#dialog-qrcode").dialog({
    resizable: false,
    width: 200,
    height: 280,
    modal: true,
  });
};

/**
 * 近づくと現れるコンポーネントを作成
 */
AFRAME.registerComponent('visible-wall', {
  scheme: {
    // 引数の変数設定
    distance: { default: 10 },
  },
  init: function () {
    // 初回実行処理
    this.el.object3D.visible = false;
  },
  tick: function () {
    // 毎フレーム毎の処理（最大60回/秒）
    var cameraPosition = this.el.sceneEl.camera.el.object3D.position;
    var wallPosition = this.el.object3D.position;

    if (wallPosition.distanceTo(cameraPosition) < this.data.distance) {
      if (this.el.object3D.visible == false) {
        this.el.object3D.visible = true;
      }
    } else {
      if (this.el.object3D.visible == true) {
        this.el.object3D.visible = false;
      }
    }
  },
});

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
        console.log("clear!!");
        clear_js();
      }
    }
  }
}),

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
})

function openQRcode() {

  $.dialog({
    theme: 'light',
    title: 'お友達に教えてね',
    content: '<center><img src="./qrcode/maze_visible.png"></img></center>',
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
        '大事な「つくるけぇ！」を迷路内に落としてしまった。' +
        'いそいで取ってきてほしい。' +
        '<li>進む方向にスマートフォンを向けます</li>' +
        '<li>画面タッチで前に進みます</li>' +
        '<li>壁は近づかないと現れないぞ</li>' +
        '<li>つくるけぇ！をすべて取るとクリア</li>' +
        '</p>',
        closeIcon: true,
        onClose: function () {
          start_js();
        }
      })
    }
  })
};
