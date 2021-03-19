//游戏数据 16个格子 分数
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);

}

function newgame(){
	//初始化
	init();
	//随机地在两个格子里生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){

	//设置小格子的位置
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			//通过ID获取每个小格子
			var gridCell = $("#grid-cell-"+i+"-"+j);
			//获取每个格子的坐标数据
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}

	//初始化board
	for (var i = 0; i < 4; i++) {
		//将board变成二维数组
		board[i] = new Array();
		hasConflicted[i] = new Array();
		//初始化board每个值
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	//显示并设定munber-cell里的元素
	updateBoardView();

	//初始化score值
	score = 0;
	updateScore(score);
}

function updateBoardView(){

	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $("#number-cell-"+i+"-"+j);

			if (board[i][j] == 0) {
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+0.5*cellSideLength);
				theNumberCell.css('left',getPosLeft(i,j)+0.5*cellSideLength);
			}else {
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;

		}
	}

	$('.number-cell').css('line-height',cellSideLength + 'px');
	$('.number-cell').css('font-size',0.6*cellSideLength + 'px');

}

function generateOneNumber(){

	if (nospace(board)) {
		return false;
	}

	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var time = 0;

	while (time <50) {
		if (board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));

		time ++;
	}
	if (time == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				randx = i;
				randy = j;
			}
		}
	}

	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 :4;
	//在随机位置上显示数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);

	return true;
}

$(document).keydown(function(event) {

	switch(event.keyCode) {
		case 37://left
			event.preventDefault();
			if (moveLeft()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
			break;
		case 38://up
			if (moveUp()) {
				event.preventDefault();
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
			break;
		case 39://right
			event.preventDefault();
			if (moveRight()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
			break;
		case 40://down
			event.preventDefault();
			if (moveDown()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
			break;
		default://default

			break;
	}
});

document.addEventListener('touchstart', function (event) {
	 
	 startx = event.touches[0].pageX;
	 starty = event.touches[0].pageY;
})

document.addEventListener('touchmove', function (event) {
	event.preventDefault(); 
})

document.addEventListener('touchend', function (event) {
	 
	 endx = event.changedTouches[0].pageX;
	 endy = event.changedTouches[0].pageY;

	 var deltax = endx - startx;
	 var deltay = endy - starty;

	 if (Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth) {
	 	return;
	 }

	//在x轴移动
	if (Math.abs(deltax) >= Math.abs(deltay)) {
		
		if (deltax > 0) {
			//move right
			if (moveRight()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
		}else{
			//move left
			if (moveLeft()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
		}
	}
	//在y轴上移动
	else{

		if (deltay > 0) {
			//move down
			if (moveDown()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
		}else{
			//move up
			if (moveUp()) {
				setTimeout(generateOneNumber(), 210);
				setTimeout(isgameover(), 300);
			}
		}
	}
})

function isgameover(){
	if (nospace(board) && nomove()) {
		gameover();
	}
}

function gameover(){
	alert('Game Over');
}

function moveLeft(){
	if (!canMoveLeft(board)) {
		return false;
	}
	//moveLeft
	//落脚位置是否为空 落脚位置的数字和待判定元素数字相等 移动路径中是否有障碍物
	for (var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++){
			if (board[i][j] != 0) {
				for(var k = 0;k < j; k++){
					if (board[i][k] == 0 && noBlockLeft(i,j,k,board)) {

						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if (board[i][k] == board[i][j] && noBlockLeft(i,j,k,board) && !hasConflicted[i][k]) {

						//move
						showMoveAnimation(i,j,i,k);
						//add

						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveRight(){
	if (!canMoveRight(board)) {
		return false;
	}
	//moveRight
	//落脚位置是否为空 落脚位置的数字和待判定元素数字相等 移动路径中是否有障碍物
	for (var i = 0; i < 4; i++) {
		for(var j = 2; j >= 0; j--){
			if (board[i][j] != 0) {
				for(var k = 3;k > j; k--){
					if (board[i][k] == 0 && noBlockRight(i,j,k,board)) {

						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if (board[i][k] == board[i][j] && noBlockRight(i,j,k,board) && !hasConflicted[i][k]) {

						//move
						showMoveAnimation(i,j,i,k);
						//add

						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveUp(){
	if (!canMoveUp(board)) {
		return false;
	}
	//moveUp
	//落脚位置是否为空 落脚位置的数字和待判定元素数字相等 移动路径中是否有障碍物
	for (var i = 1; i < 4; i++) {
		for(var j = 0; j < 4; j++){
			if (board[i][j] != 0) {
				for(var k = 0;k < i; k++){
					if (board[k][j] == 0 && noBlockUp(i,k,j,board)) {

						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if (board[k][j] == board[i][j] && noBlockUp(i,k,j,board) && !hasConflicted[k][j]) {

						//move
						showMoveAnimation(i,j,k,j);
						//add

						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveDown(){
	if (!canMoveDown(board)) {
		return false;
	}
	//moveDown
	//落脚位置是否为空 落脚位置的数字和待判定元素数字相等 移动路径中是否有障碍物
	for (var i = 2; i >= 0; i--) {
		for(var j = 0; j < 4; j++){
			if (board[i][j] != 0) {
				for(var k = 3;k > i; k--){
					if (board[k][j] == 0 && noBlockDown(i,k,j,board)) {

						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if (board[k][j] == board[i][j] && noBlockDown(i,k,j,board) && !hasConflicted[k][j]) {

						//move
						showMoveAnimation(i,j,k,j);
						//add

						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}