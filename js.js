//获取元素计算后的样式	
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
//运动框架
function startMove(obj, attr, itarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var iCur = 0;
        if (attr == 'opacity') {
            iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100)
        } else {
            iCur = parseInt(getStyle(obj, attr));
        }

        var ispeed = (itarget - iCur) / 10;
        ispeed = ispeed > 0 ? Math.ceil(ispeed) : Math.floor(ispeed);

        if (iCur == itarget) {
            clearInterval(obj.timer);
        } else {
            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (ispeed + iCur) + ')';
                obj.style.opacity = (ispeed + iCur) / 100;
            } else {
                obj.style[attr] = iCur + ispeed + 'px';
            }
        }
    }, 50);
}

//通过class来获取元素
function getByClass(oParent, sClass) {
    var aEle = document.getElementsByTagName('*');
    var i = 0;
    var aResult = [];

    for (i = 0; i < aEle.length; i++) {
        if (aEle[i].className == sClass) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

window.onload = function() {
    var oDiv = document.getElementById('playimages');
    var oBtnPrev = getByClass(oDiv, 'prev')[0];
    var oBtnNext = getByClass(oDiv, 'next')[0];
    var oMarkLeft = getByClass(oDiv, 'mark_left')[0];
    var oMarkRight = getByClass(oDiv, 'mark_right')[0];
    var oSmallUl = getByClass(oDiv, 'small_pic')[0].getElementsByTagName('ul')[0];
    var aSmallLi = oSmallUl.getElementsByTagName('li');
    var oBigUl = getByClass(oDiv, 'big_pic')[0];
    var aBigLi = oBigUl.getElementsByTagName('li');
    var iMinZindex = 2;
    var iNow = 0;
    var i = 0;

    oSmallUl.style.width = aSmallLi.length * aSmallLi[0].offsetWidth + 'px';

    //所有移动的箭头
    oBtnPrev.onmouseover = oMarkLeft.onmouseover = function() {
        startMove(oBtnPrev, 'opacity', 100);
    }
    oBtnPrev.onmouseout = oMarkLeft.onmouseout = function() {
        startMove(oBtnPrev, 'opacity', 0);
    }

    oBtnNext.onmouseover = oMarkRight.onmouseover = function() {
        startMove(oBtnNext, 'opacity', 100);
    }
    oBtnNext.onmouseout = oMarkRight.onmouseout = function() {
        startMove(oBtnNext, 'opacity', 0);
    }

    for (i = 0; i < aSmallLi.length; i++) {

        aSmallLi[i].index = i;

        //小图透明度变化
        aSmallLi[i].onmouseover = function() {
            startMove(this, 'opacity', 100);
        }
        aSmallLi[i].onmouseout = function() {
            if (this.index != iNow) { //不在当前的对象中移出时
                startMove(this, 'opacity', 60);
            }
        }

        aSmallLi[i].onclick = function() {
            if (iNow == this.index) return false;
            iNow = this.index;

            tab();
        }
        //小图左右变换 大图改变
        function tab() {
            for (i = 0; i < aSmallLi.length; i++) {
                startMove(aSmallLi[i], 'opacity', 60);
            }
            startMove(aSmallLi[iNow], 'opacity', 100);

            aBigLi[iNow].style.zIndex = iMinZindex++;
            aBigLi[iNow].style.height = 0;

            startMove(aBigLi[iNow], 'height', oBigUl.offsetHeight);

            if (iNow == 0) {
                startMove(oSmallUl, 'left', 0);
            } else if (iNow == aSmallLi.length - 1) {
                startMove(oSmallUl, 'left', -(iNow - 2) * aSmallLi[0].offsetWidth);
            } else {
                startMove(oSmallUl, 'left', -(iNow - 1) * aSmallLi[0].offsetWidth);
            }
        }

        //左右箭头点击图片变换
        oBtnPrev.onclick = function(){
        	iNow--;
        	if(iNow == -1){
        		iNow = aSmallLi.length - 1; 
        	}

        	tab();
        }
        oBtnNext.onclick = function(){
        	iNow++;
        	if(iNow == aSmallLi.length - 1){
        		iNow = 0;
        	}
        	tab();
        }

    }
}