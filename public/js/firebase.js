// Initialize Firebase
var config = {
  apiKey: "AIzaSyABl7QK_Y3_siGslqr9tSuh2YDtiqBb57w",
  authDomain: "tukurukexe-ar-hiroshima.firebaseapp.com",
  databaseURL: "https://tukurukexe-ar-hiroshima.firebaseio.com",
  projectId: "tukurukexe-ar-hiroshima",
  storageBucket: "tukurukexe-ar-hiroshima.appspot.com",
  messagingSenderId: "1074995826784"
};

firebase.initializeApp(config);

// ID
var firebase_browserInfo_id;
var uid;

function browserInfo() {

  // 匿名ログイン
  firebase.auth().signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("firebase signInAnonymously:[" + errorCode + "]" + errorMessage + ".")
  });

  // Browser infomation
  var browserInfoRef = firebase.database().ref('/browserInfo/');

  if(document.all){ // 古いIE用
    language = navigator.browserLanguage;
  } else{
    language = navigator.language;
  }

  var clientDate = new Date();
  var browserInfo = {
    "userid": uid,
    "clientDate": clientDate.getTime(),
    "serverDate": firebase.database.ServerValue.TIMESTAMP,
    "host": location.host,
    "appCodeName": navigator.appCodeName,
    "appName": navigator.appName,
    "appVersion": navigator.appVersion,
    "platform": navigator.platform,
    "userAgent": navigator.userAgent,
    "language": language,
    "pathname": location.pathname,
    "referrer": document.referrer,
    "domain": document.domain,
    "screenWidth": screen.width,
    "screenAvailWidth": screen.availWidth,
    "screenHeight": screen.height,
    "screenAvailHeight": screen.availHeight,
    "screenColorDepth": screen.colorDepth,
    "clientWidth": document.documentElement.clientWidth,
    "clientHeight": document.documentElement.clientHeight,
    "score": "",
    "status": "init"
  };

  firebase_browserInfo_id = browserInfoRef.push(browserInfo).key;
};

// ログイン情報の取得
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
  } else {
    console.log("firebase user not found.");
  }

  // ブラウザ情報取得
  browserInfo();
});

// ステータス更新
function updateStatus(status, score) {
  var update= {};
  update['/browserInfo/'+firebase_browserInfo_id+'/score'] = score;
  update['/browserInfo/'+firebase_browserInfo_id+'/status'] = status;
  return firebase.database().ref().update(update);
}

