
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

// 倒计时时间-月份是从0开始，00就是1月份
// const endTime = new Date(2018, 00, 30, 01, 12, 13);
var endTime = new Date();
endTime.setTime(endTime.getTime() + 3600 * 1000);
// 当前毫秒
var curShowTimeSeconds = 0;
// 小球动画数组和颜色
var balls = [];
const colors = ["#f44336","#e91e63","#e91e63","#00bcd4","#4caf50","#cddc39","#ffeb3b","#ff5722","#795548","#9e9e9e"];


window.onload = function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');


	// 自适应
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	MARGIN_LEFT = Math.round(canvas.width/10);
	MARGIN_TOP = Math.round(canvas.height/5);
	RADIUS = Math.round(canvas.width*4/5 / 108)-1;

	
	
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function(){
		render(context);
		upDate();
		
	}, 50)
}


// 时间变化比较
function upDate() {
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600)/60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600)/60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextSeconds != curSeconds) {
		// 计算彩色小球坐标
		if(parseInt(curHours/10) != parseInt(nextHours/10)) {
			addBalls(MARGIN_LEFT+0, MARGIN_TOP, parseInt(nextHours/10));
		}
		if(parseInt(curHours%10) != parseInt(nextHours%10)) {
			addBalls(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(nextHours%10));
		}

		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)) {
			addBalls(MARGIN_LEFT+38*(RADIUS+1), MARGIN_TOP, parseInt(nextMinutes/10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)) {
			addBalls(MARGIN_LEFT+53*(RADIUS+1), MARGIN_TOP, parseInt(nextMinutes%10));
		}

		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)) {
			addBalls(MARGIN_LEFT+76*(RADIUS+1), MARGIN_TOP, parseInt(nextSeconds/10));
		}
		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)) {
			addBalls(MARGIN_LEFT+91*(RADIUS+1), MARGIN_TOP, parseInt(nextSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}
	upDateBalls();
	console.log(balls.length);

}
// 彩色小球运动
function upDateBalls() {
	for(var i=0; i<balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		if(balls[i].y >= canvas.height - RADIUS) {
			balls[i].y = canvas.height - RADIUS;
			balls[i].vy = -balls[i].vy*0.65;
		}
	}
	// 循环balls数组，删除已出画面的小球
	var cnt = 0;
	for(var i=0; i<balls.length; i++) {
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<canvas.width) {
			balls[cnt++] = balls[i];
		}
	}
	while(balls.length > cnt) {
		balls.pop();
	}
}


// 彩色小球数组属性
function addBalls(x, y, num) {
	for(var i=0; i<digit[num].length; i++) {
		for(var j=0; j<digit[num][i].length; j++) {
			if(digit[num][i][j] == 1) {
				var aBall = {
					x: x+j*2*(RADIUS+1)+(RADIUS+1),
					y: y+i*2*(RADIUS+1)+(RADIUS+1),
					g: 1.5+Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,
					vy: -5,
					color: colors[Math.floor(Math.random()*colors.length)]

				}
				balls.push(aBall);
			}

		}
	}
}

// 计算距离倒计时还有多少秒
function getCurrentShowTimeSeconds() {
	var curTime = new Date();
	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret/1000);
	return ret>=0? ret : 0;
}


// 绘制时钟
function render(ctx) {

	// 刷新画布
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
	var seconds = curShowTimeSeconds % 60;

	// 时
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), ctx);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), ctx);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, ctx);

	// 分
	renderDigit(MARGIN_LEFT+38*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), ctx);
	renderDigit(MARGIN_LEFT+53*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), ctx);
	renderDigit(MARGIN_LEFT+68*(RADIUS+1), MARGIN_TOP, 10, ctx);

	// 秒
	renderDigit(MARGIN_LEFT+76*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), ctx);
	renderDigit(MARGIN_LEFT+91*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), ctx);

	// 彩色小球绘制
	for(var i=0; i<balls.length; i++) {
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
	}
}




// 绘制函数
function renderDigit(x, y, num, ctx) {
	ctx.fillStyle = "#2196f3";

	for(var i=0; i<digit[num].length; i++) {
		for(var j=0; j<digit[num][i].length; j++) {

			// 计算圆心的位置
			// ctxX：x+j*2*(R+1)+(R+1)
			// ctxY：y+i*2*(R+1)+(R+1)
			if(digit[num][i][j] == 1) {
				ctx.beginPath();
				ctx.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}


