window.onload = function(){
  var
  UP = 38,DOWN =40,LEFT = 37,RIGHT = 39,
  SPEED = 400,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  pianyi = 3,
  xia = 0,
  maps = [
    [[0,1,0],
     [1,1,1],
     [0,0,0],
    ],
    [[1,1],
     [1,1]],

    [[0,1,0],
     [0,1,1],
     [0,0,1],],
    [[0,1,0],
     [1,1,0],
     [1,0,0],],

    [[0,1,0,0],
     [0,1,0,0],
     [0,1,0,0],
     [0,1,0,0]],

    [[0,1,0],
     [0,1,0],
     [0,1,1],],

    [[0,1,1],
     [0,1,0],
     [0,1,0],]
  ],
  shape = maps[ Math.floor(Math.random()*maps.length) ],
  remain = {};
  ctx.fillStyle = '#d6ffb2';
  //根据数据画形状
  function drawRemain(){
    for (var i in remain){
      for(var j=0; j<remain[i].length; j++){
        drawBlock(i,remain[i][j]);
      }
    }
  }
  function drawBlock(x,y){
    ctx.fillRect( y * 20+2,x * 21 + 3,18,18);
  }
  function drawShape(){
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia,y = j+pianyi;
        drawBlock(x,y);
      }
    }
  }
  function drawSence(){
    ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
    for( var i = 0; i < 10; i++){
      for( var j = 0; j < 16; j++){
        ctx.fillRect(i*20+9,j*21+10,2,2);
      }
    }
    drawRemain();
    drawShape();
  }

  //四组判断
  function isZhuangqiang(c){
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia,y = j+pianyi;
        if(y==c){
          return true;
        }
      }
    }
    return false;
  }
  function isZhuangRemin(c){
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia,y = j+pianyi+c;
        if(!remain[x]){
          continue;
        }
        for(var h=0;h<remain[x].length; h++){
          if(y == remain[x][h]){
            return true;
          }
        }
      }
    }
    return false;
  }
  function isReachBottom(){
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia;
        if(x==15){
          return true;
        }
      }
    }
    return false;
  }
  function isReachRemain(){
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia+1,y = j+pianyi;
        if(!remain[x]){
          continue;
        }
        for(var h=0;h<remain[x].length; h++){
          if(y == remain[x][h]){
            return true;
          }
        }
      }
    }
    return false;
  }
  //消除
  function xiaochu(){
    var len = 0;
    for(var i in remain){
      if(remain[i].length == 10){
        delete(remain[i]);
        continue;
      }
      len = len + 1;
    }
    var newremain = {};
    var j = 16-len;
    for(var i in remain){
      newremain[j] = [];
      for(var k = 0; k< remain[i].length; k++){
        newremain[j].push(remain[i][k]);
      }
      j = j+1;
    }
    remain = newremain;
  }
  //出下一个块
  function next(){
    if(remain[0]){
      return false;
    }
    for(var i=0; i<shape.length; i++){
      for(var j=0; j<shape[i].length; j++){
        if(shape[i][j] == 0) continue;
        var x = i+xia, y = j+pianyi;
        if(!remain[x]){
          remain[x] = [];
        }
        remain[x].push(y);
      }
    }
    xiaochu();
    xia = 0;
    pianyi = 3;
    shape = maps[ Math.floor(Math.random()*maps.length) ];
    return true;
  }
  //块变形
  function bianxing(){
    // 注释中的算法为原地转换数组，不引入外部变量
    // var matrix = shape;
    // var n = matrix.length;
    // var limit = (n-1)/2;
    // for(var i=0;i<= limit; i++){
    //   for(var j=i;j<n-1-i;j++){
    //     var temp = matrix[i][j];
    //     matrix[i][j] = matrix[n-1-j][i];
    //     matrix[n-1-j][i] = matrix[n-1-i][n-1-j];
    //     matrix[n-1-i][n-1-j] = matrix[j][n-1-i];
    //     matrix[j][n-1-i] = temp;
    //   }
    // }
    var tmp = [];
    for(var i = 0;i<shape.length; i++){
      tmp[i] = [];
      for(var j=0; j<shape[i].length; j++){
        tmp[i][j] = shape[shape.length - 1 -j][i];
      }
    }
    shape = tmp;
  }
  function canBianxing(){
    var tmp = [];
    for(var i = 0;i<shape.length; i++){
      tmp[i] = [];
      for(var j=0; j<shape[i].length; j++){
        tmp[i][j] = shape[shape.length - 1 -j][i];
      }
    }
    for(var i=0; i<tmp.length; i++){
      for(var j=0; j<tmp[i].length; j++){
        if(tmp[i][j] == 0) continue;
        var x = i+xia,y = j+pianyi;
        if(y== -1|| y == 10){
          return false;
        }
        if(!remain[x]){
          continue;
        }
        for(var h=0;h<remain[x].length; h++){
          if(y == remain[x][h]){
            return false;
          }
        }
      }
    }
    return true;
  }

  drawSence();
  function start(){
    if(!isReachBottom() && !isReachRemain()){
      xia ++;
    }else{
      if(!next()){
        clearInterval(timerId);
        console.log("lose");
      }
    }
    drawSence();
  }
  var timerId = setInterval(start,SPEED);
  document.onkeydown = function(ev){
    ev.preventDefault();
    if(ev.keyCode == DOWN){
      if(!isReachBottom() && !isReachRemain()){
        xia ++;
      }else{
        if(!next()){
          console.log("lose!!");
          return;
        }
      }
    }
    if(ev.keyCode == LEFT){
      if(!isZhuangqiang(0) && !isZhuangRemin(-1))
        pianyi --;
    }
    if(ev.keyCode == RIGHT){
      if(!isZhuangqiang(9) && !isZhuangRemin(1))
        pianyi ++;
    }
    if(ev.keyCode == UP){
      if(canBianxing()){
        bianxing();
      }
    }
    drawSence();
  };
};
