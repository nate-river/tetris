window.onload = function(){
    var canvas = document.getElementById('canvas'),
	canvasWidth = 200,
	canvasHeight = 300,
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

    tetris.prototype.born = function(){
	this.curentShape = this.maps[ Math.round( Math.random()* (this.maps.length-1) ) ];
    }
    tetris.prototype.drawRemain = function(){
	for ( var i = 0;  i < this.remain.length;  i++){
	    drawBlock(this.remain[i][0],this.remain[i][1]);
	}
    }
    tetris.prototype.drawShape = function(){
	var tmp = {isPeng:false,tmp:[]};
	for ( var i = 0;  i < this.curentShape.length;  i++){
	    for ( var j=0; j< this.curentShape[i].length; j++){
		if(this.curentShape[i][j]){
		    var x = j+this.zuoyou,
			y = i+this.xia;
		    //画块的时候如果画到了已有的块上，证明碰撞了。返回false;
		    var that  = this;
		    var isPeng = function(){
			for ( var i = 0;  i < that.remain.length;  i++){
			    if( x == that.remain[i][0] && y == that.remain[i][1]){
				return true;
			    }
			}
			return false;
		    }();
		    drawBlock( x, y);
		    tmp['isPeng'] = isPeng;
		    tmp['tmp'].push([j+this.zuoyou,i+this.xia]);
		}
	    }
	}
	return tmp;
    }

    var t = new tetris();
    t.born();
    
    var iterId = setInterval(function(){
    	_ctx.clearRect(0,0,202,339);
    	drawSence();
    	t.drawRemain();
    	var lastpos = t.drawShape();
    	t.xia ++;
    	if( t.xia > 13 || lastpos.isPeng ){
    	    //重新出块之前把上次那个块停下的位置送人this.remain;
    	    t.remain = t.remain.concat(lastpos.tmp);
    	    t.xia = 0;
    	    t.zuoyou = 3;
    	    t.born();
    	}
    },200);

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
    function drawBlock (i,j){
	_ctx.fillRect(i*20+2,j*21+3,18,18);
    }
}