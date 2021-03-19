var c = document.getElementById('canvas');
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;

// 全局常量
var marginLeft = Math.round(c.width / 20);
var marginTop = Math.round(c.height / 5);
var radius = Math.round(c.width * 4.5 / 5 / 108) - 1;

// 全局变量
curHours = new Date().getHours();
curMinutes = new Date().getMinutes();
curSeconds = new Date().getSeconds();



// 兼容性检测
if (c.getContext) {
    var ctx = c.getContext('2d');
    // drawing code here
} else {
    alert("Your browser doesn't support it Canvas")
}


setInterval(function() {
    draw.clock();
    contrast();

}, 50);

function contrast() {
    nextHours = new Date().getHours();
    nextMinutes = new Date().getMinutes();
    nextSeconds = new Date().getSeconds();

    // 当前时和下次时的个位十位数比较
    if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
        console.log(`当前时${curSeconds}下次时${nextSeconds}`);
        ball.add(marginLeft + 0, marginTop, parseInt(nextMinutes / 10));

    }
    if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
        console.log(`当前时${curSeconds}下次时${nextSeconds}`);
        ball.add(marginLeft + 15 * (radius + 1), marginTop, parseInt(nextMinutes / 10));

    }

    // 当前分和下次时的个位十位数比较
    if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
        console.log(`当前分${curSeconds}下次分${nextSeconds}`);
        ball.add(marginLeft + 38 * (radius + 1), marginTop, parseInt(nextMinutes / 10))

    }
    if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
        console.log(`当前分${curSeconds}下次分${nextSeconds}`);
        ball.add(marginLeft + 53 * (radius + 1), marginTop, parseInt(nextMinutes % 10))
    }

    // 当前秒和下次时的个位十位数比较    
    if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
        console.log(`当前秒${curSeconds}下次秒${nextSeconds}`);
        ball.add(marginLeft + 76 * (radius + 1), marginTop, parseInt(nextSeconds / 10))
    }
    if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
        console.log(`当前秒${curSeconds}下次秒${nextSeconds}`);
        ball.add(marginLeft + 91 * (radius + 1), marginTop, parseInt(nextSeconds % 10));

    }


    // 当前的等于下次的
    curHours = nextHours;
    curMinutes = nextMinutes;
    curSeconds = nextSeconds;
    ball.up();
    console.log(`当前页面有${ball.message.length}个小球`);


}
// 小球
var ball = {
    colors: [
        "#666699",
        "#0099CC",
        "#CC3399",
        "#FFFF00",
        "#009933",
        "#CC6600",
        "#FF6666",
        "#CCCCCC",
        "#009999",
        "#FF0033"
    ],
    message: [],
    // 添加小球
    add: function(x, y, num) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    var aBall = {
                        x: x + j * 2 * (radius + 1) + (radius + 1),
                        y: y + i * 2 * (radius + 1) + (radius + 1),
                        g: 1.5 + Math.random(),
                        angle: "90deg",
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                        vy: -5,
                        color: ball.colors[Math.floor(Math.random() * ball.colors.length)]
                    };

                    ball.message.push(aBall);
                }
            }
        }
    },

    up: function() {
        for (var i = 0; i < ball.message.length; i++) {
            ball.message[i].x += ball.message[i].vx;
            ball.message[i].y += ball.message[i].vy;
            ball.message[i].vy += ball.message[i].g;
            if (ball.message[i].y >= c.height - radius) {
                ball.message[i].y = c.height - radius;
                ball.message[i].vy = -ball.message[i].vy * 0.62;
            }
        }

        var cnt = 0;
        for (var i = 0; i < ball.message.length; i++) {
            if (
                ball.message[i].x + radius > 0 &&
                ball.message[i].x - radius < c.width
            ) {
                ball.message[cnt++] = ball.message[i];
            }
        }

        while (ball.message.length > cnt) {
            ball.message.pop();
        }
    }
};


// 绘制时钟
var draw = {

    clock: function() {
        ctx.clearRect(0, 0, c.width, c.height);
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        console.log(hours, minutes, seconds);

        // 时
        draw.renderDigit(marginLeft, marginTop, parseInt(hours / 10), ctx);
        draw.renderDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hours % 10), ctx);
        draw.renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, ctx);

        // 分
        draw.renderDigit(marginLeft + 38 * (radius + 1), marginTop, parseInt(minutes / 10), ctx);
        draw.renderDigit(marginLeft + 53 * (radius + 1), marginTop, parseInt(minutes % 10), ctx);
        draw.renderDigit(marginLeft + 68 * (radius + 1), marginTop, 10, ctx);

        // 秒
        draw.renderDigit(marginLeft + 76 * (radius + 1), marginTop, parseInt(seconds / 10), ctx);
        draw.renderDigit(marginLeft + 91 * (radius + 1), marginTop, parseInt(seconds % 10), ctx);

        // 绘制彩色小球
        for (var i = 0; i < ball.message.length; i++) {
            ctx.fillStyle = ball.message[i].color;
            ctx.beginPath();
            ctx.arc(ball.message[i].x, ball.message[i].y, radius, 0, 2 * Math.PI);
            // ctx.rect(ball.message[i].x, ball.message[i].y, radius * 2, radius * 2);
            ctx.closePath();
            ctx.fill();
        }

    },

    // 绘制函数
    renderDigit: function(x, y, num) {

        ctx.fillStyle = "#0099CC";

        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                // 计算圆心的位置
                // ctxX：x+j*2*(R+1)+(R+1)
                // ctxY：y+i*2*(R+1)+(R+1)
                if (digit[num][i][j] == 1) {
                    ctx.beginPath();
                    ctx.arc(
                        x + j * 2 * (radius + 1) + (radius + 1),
                        y + i * 2 * (radius + 1) + (radius + 1),
                        radius,
                        0,
                        2 * Math.PI
                    );
                    // ctx.rect(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius * 2, radius * 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }
};