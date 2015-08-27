(function ($) {
    var touches = {};
    var touchEvents={};
    $.tapDelay=220;
    $.holdDelay = 700;
    //滑动阀值
    $.swipeLen = 30;
    function getEle(e){
        touches.el=$(("tagName" in e.target)? e.target: e.target.parentNode);
       return touches.el;
    }

$(function(){
            $(document).on("touchstart", function (e) {
                //touchstart(轻击)事件
               var data = _eventVal(e)
                touches.tapTime = setTimeout(function () {
                    getEle(e).trigger("tap",data);
                    clearTimeout(touches.tapTime);
                }, $.tapDelay)

                //hold事件
                touches.temp=setTimeout(function(){
                    clearTimeout(touches.temp);
                    clearTimeout(touches.tapTime);
                }, $.tapDelay-5);
                touches.holdTime=setTimeout(function(){
                    getEle(e).trigger("hold",data);
                    clearTimeout(touches.holdTime);
                }, $.holdDelay);
                //swip
                
                touchEvents.x = e.touches[0].clientX;
                touchEvents.y = e.touches[0].clientY;
                touchEvents.startx = touchEvents.x;
                touchEvents.starty = touchEvents.y;
                touchEvents.initx = touchEvents.x;
                touchEvents.inity = touchEvents.y;
            }).on("touchmove",function(e){
                touchEvents.x1 = e.touches[0].clientX;
                touchEvents.y1 = e.touches[0].clientY;

                x1=touchEvents.x1;
                y1=touchEvents.y1;

                touches.moveTime=setTimeout(function(){

                       swip(touchEvents.x, touchEvents.y, x1, y1, e);


                       drag(touchEvents.x,touchEvents.y,x1,y1,touchEvents.startx,touchEvents.starty,touchEvents.initx,touchEvents.inity,e)

                    rotate(touchEvents.initx,touchEvents.inity,e);
                },0)

            }).on("touchend",function(e){
                getEle(e).off("touchstart");
                getEle(e).off("touchmove");
                getEle(e).off("touchend");
                getEle(e).trigger("tapend");
                    //清除定时器
                    clearTimeout(touches.temp);
                    clearTimeout(touches.holdTime);

            })







})


    //swip
    function swip(x,y,x1,y1,e){
        if(x==x1&&y==y1){
            return;
        }
        _stop();

        var obj = {x: x, y: y, x1: x1, y1: y1, lenx: Math.abs(x - x1), leny: Math.abs(y - y1)};
        var data = _eventVal(e, obj);
        if (Math.abs(x - x1) > $.swipeLen || Math.abs(y - y1) > $.swipeLen) {

            getEle(e).trigger("swip" ,data);

            if (Math.abs(x - x1) > Math.abs(y - y1)) {
                if (x > x1) {

                    getEle(e).trigger("swipleft",data);

                }
            }else if (Math.abs(x - x1) > Math.abs(y - y1)) {
                if (x < x1) {
                    getEle(e).trigger("swipright",data);

                }
            }else  if (Math.abs(x - x1) < Math.abs(y - y1)) {
                if (y > y1) {
                    getEle(e).trigger("swipup",data);

                }
            }else    if (Math.abs(x - x1) < Math.abs(y - y1)) {
                if (y < y1) {
                    getEle(e).trigger("swipdown",data);

                }
            }
            touchEvents.x=x1;touchEvents.y=y1;
        }

    }

    //drag
    function drag(x,y,x1,y1,startx,starty,initx,inity,e){

        currentx = x1 - x;
        currenty = y1 - y;
        if (x1 < startx) {

            if (x1 > x) {
                startx = x;
            }
        }
        if (x1 > startx) {

            if (x1 < x) {
                startx = x;
            }
        }

        if (y1 < starty) {

            if (y1 > y) {
                starty = y;
            }
        }
        if (y1 > starty) {

            if (y1 < y) {
                starty = y;
            }
        }

        var obj = {
            x: x,
            y: y,
            x1: x1,
            y1: y1,
            lenx: Math.abs(x1 - initx),
            leny: Math.abs(y1 - inity),
            currentx: currentx,
            currenty: currenty
        }
        data = _eventVal(e, obj);
        getEle(e).trigger("drag",data);
        if (Math.abs(x - x1) > Math.abs(y - y1)) {
            getEle(e).trigger("dragx",data);
            if (x1 < x) {
                data.dir = "l"
                getEle(e).trigger("dragleft",data);
            } else {
                data.dir = "r";
                getEle(e).trigger("dragright",data);
            }

        }else if (Math.abs(x - x1) < Math.abs(y - y1)) {
            getEle(e).trigger("dragy",data);
            if (y1 < y) {
                data.dir = "t"
                getEle(e).trigger("dragup",data);
            } else {
                data.dir = "b";
                getEle(e).trigger("dragdown",data);
            }

        }


        touchEvents.x = x1;
        touchEvents.y = y1;

    }

    function rotate(startx,starty,e){
        _stop()
        var speed = 5;
        var x = e.touches[0].pageX;
        var y = e.touches[0].pageY;
        var newx = x - startx;
        var newy = y - starty;
        var aa = Math.atan2(starty - y, startx - x) * 180 / Math.PI;
        e.angle = aa;
        getEle(e).trigger("rotate",e);
        startx = x;
        starty = y
    }






    //停止事件
    function _stop() {
        for(var i in touches){
            clearTimeout(touches[i]);
        }
    }


    //滚动取消所有事件
    $(window).on("scroll", function (e) {
        _stop();
        /*
        for(var i in touchEvents){
            $(document).off("touchmove",touchEvents.i)
        }
        */
    })

    //处理事件对象返回值
    function _eventVal(e, obj) {
        var data = e;
        data.clientX = e.touches[0].clientX;
        data.screenX = e.touches[0].screenX;
        data.pageX = e.touches[0].pageX;
        data.target= e.touches[0].target;
        if (obj) {
            data.x = obj.x;
            data.y = obj.y;
            data.x1 = obj.x1;
            data.y1 = obj.y1;
            data.lenx = obj.lenx;
            data.leny = obj.leny;
            data.currentx = obj.currentx;
            data.currenty = obj.currenty;
        }
        return data;
    }

    function parseEvent(callback,e){
        var p=(/function\s+\((\w*),?[\w,]?\)/.exec(callback))[1];
        if(!p){
            return;
        }
        var stop=(eval("/"+p+".stopPropagation\\s*\\(\\s*\\)/").exec(callback));
        if(stop){
            e.stopPropagation()
        }
        var de=(eval("/"+p+".preventDefault\\s*\\(\\s*\\)/").exec(callback))
        {
            e.preventDefault();
        }
    };

    ("tap hold swip swipleft swipright swipup swipdown drag dragleft dragx dragy dragright dragdown dragup rotate").split(" ").forEach(function(event){
        $.fn[event] = function (callback) {
            return (0 in arguments) ?
                this.on(event, callback) :
                this.trigger(event);
        }
    });
    ("pagedown pageup pagetop pagebottom pagescroll").split(" ").forEach(function(event){
        $.fn[event] = function (callback) {
            return (0 in arguments) ?
                $(document).on(event, callback) :
                $(document).trigger(event);
        }
    })

})(Zepto);
