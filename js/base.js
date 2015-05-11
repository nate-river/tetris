window.onload = function(){
    var canvas = document.getElementById('canvas'),
	_ctx = canvas.getContext('2d');
    _ctx.fillStyle = '#d6ffb2';

    document.onkeydown = function(e){
	if(e.keyCode == 37){
	    t.zuoyou --;
	}
	if(e.keyCode == 39){
	    t.zuoyou ++;
	}
    }
    //画出主场景，致敬第一款俄罗斯方块的界面
    function drawSence (){
	for ( var i = 0;  i < 16;  i++){
	    for ( var j=0; j<10; j++){
		var x = 20*j + 9;
		var y = 21*i + 10; 
		_ctx.fillRect(x,y,2,2);
	    }
	}
    };
    drawSence();
    //用来根据坐标在画布中画出一个块
    function drawBlock (i,j){
	_ctx.fillRect(i*20+2,j*21+3,18,18);
    }

    function tetris (){
	this.maps = [
	    [
		[0,1,0],
		[1,1,1],
		[0,0,0],
	    ],
	    [
		[0,1,0],
		[0,1,1],
		[0,0,1],
	    ],
	    [
		[0,1,0],
		[0,1,0],
		[0,1,1],
	    ],
	];
	this.xia = 0;
	this.zuoyou = 3;
	this.remain = [ [0,15],[1,15],[2,15],[3,15],[4,15] ];
    }
    //随机选取一种形状出现
    tetris.prototype.born = function(){
	this.curentShape = this.maps[ Math.round( Math.random()* (this.maps.length-1) ) ];
    }

    //画出累积页面上的块
    tetris.prototype.drawRemain = function(){
	for ( var i = 0;  i < this.remain.length;  i++){
	    drawBlock(this.remain[i][0],this.remain[i][1]);
	}
    }

    //根据随机出现的形状，画出形状中的各个块
    tetris.prototype.drawShape = function(){
	var tmp = []; 
	for ( var i = 0;  i < this.curentShape.length;  i++){
	    for ( var j=0; j< this.curentShape[i].length; j++){
		if(this.curentShape[i][j]){
		    var x = j+this.zuoyou,
			y = i+this.xia;
		    drawBlock( x, y);
		    tmp.push([x,y]);
		}
	    }
	}
	return tmp;
    }
    //画形状中的各个块之前，先判断一下
    tetris.prototype.dapanduan = function(){
	if(this.xia > 13){
	    return false;
	}
	for ( var i = 0;  i < this.curentShape.length;  i++){
	    for ( var j=0; j<this.curentShape[i].length; j++){
		if( this.curentShape[i][j] ){
		    var x = j + this.zuoyou,
			y = i + this.xia;
		    if( this.pandan(x,y) ){
			return false;
		    }
		}
		    
	    }
	}
	return true;
    }
    //传入坐标x,y,判断页面中该位置上是否有已画好的块
    tetris.prototype.pandan =function(x,y){
	for ( var i = 0;  i < this.remain.length;  i++){
	    if( x == this.remain[i][0] && y == this.remain[i][1] ){
		return true;
	    }
	}
	return false;
    }
    tetris.prototype.start = function(){
	var that = this;
	var tmp;
	this.interId = setInterval(function(){
	    _ctx.clearRect(0,0,202,339);
	    drawSence();
	    that.drawRemain();

    	    if( that.dapanduan() ){
		tmp = that.drawShape();
    		that.xia ++;
    	    }else{
		that.remain = that.remain.concat(tmp);
		for ( var i = 0;  i < tmp.length;  i++){
		    drawBlock(tmp[i][0],tmp[i][1]);
		}
		//这里需要看看remain里面有没有一行已经满了的情况。做消除处理
		that.xiaochu(tmp);

    		that.xia = 0;
    		that.zuoyou = 3;
    		that.born();
	    }
	},200)
    }
    tetris.prototype.xiaochu = function(tmp){
	// this.remain = [ [0,15],[1,15],[2,15],[3,15],[4,15] ];
	// tmp = [ [4,13],[4,14],[5,14],[5,15] ];

	//根据tmp的y坐标来判断。看看this remain里这个y坐标下是否有10个元素，如果有，代表这一行满，把他们全消除掉
	var aa = [];
	for ( var i = 0;  i < tmp.length;  i++){
	    aa.push(tmp[i][1]);
	}

	while( aa.length ){
	    var y = aa.pop();
	    var count = 0,
		t = [];
	    for ( var i = 0;  i < this.remain.length;  i++){
		if ( this.remain[i][1] == y ){
		    count++;  
		    continue;
		}
		t.push(this.remain[i]);
 	    }
	    if(count == 10){
		console.log('man');
		this.remain = t;
	    }
	};
    }

    var t = new tetris();
    t.born();
    t.drawShape();
    // t.start();
    
}