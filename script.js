var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
var lineWidth = 2
var circleRadius = 1

autoSetCanvasSize(canvas)
listenToUser(canvas)

context.fillStyle = 'white'
context.fillRect(0,0,canvas.width,canvas.height)
context.fillStyle = 'black'

var eraserEnabled = false
eraser.onclick = function(){
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}
pen.onclick = function() {
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
clear.onclick = function() {
    context.clearRect(0,0,canvas.width,canvas.height)
}
download.onclick = function() {
    var url = canvas.toDataURL("image/png")
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = 'mypainting'
    a.target = '_blank'
    a.click()


}

black.onclick = function(){
    context.fillStyle = 'black'
    context.strokeStyle = 'black'
    black.classList.add('active')
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.remove('active')
    sizes.classList.add('colorBlack')
    sizes.classList.remove('colorRed')
    sizes.classList.remove('colorGreen')
    sizes.classList.remove('colorBlue')
}
red.onclick = function(){
    context.fillStyle = 'red'
    context.strokeStyle = 'red'
    black.classList.remove('active')
    red.classList.add('active')
    green.classList.remove('active')
    blue.classList.remove('active')
    sizes.classList.remove('colorBlack')
    sizes.classList.add('colorRed')
    sizes.classList.remove('colorGreen')
    sizes.classList.remove('colorBlue')

}
green.onclick = function(){
    context.fillStyle = 'green'
    context.strokeStyle = 'green'
    black.classList.remove('active')
    red.classList.remove('active')
    green.classList.add('active')
    blue.classList.remove('active')
    sizes.classList.remove('colorBlack')
    sizes.classList.remove('colorRed')
    sizes.classList.add('colorGreen')
    sizes.classList.remove('colorBlue')
}
blue.onclick = function(){
    context.fillStyle = 'blue'
    context.strokeStyle = 'blue'
    black.classList.remove('active')
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.add('active')
    sizes.classList.remove('colorBlack')
    sizes.classList.remove('colorRed')
    sizes.classList.remove('colorGreen')
    sizes.classList.add('colorBlue')
}

thin.onclick = function () {
    lineWidth = 2
    circleRadius = 1
    thin.classList.add('active')
    thick.classList.remove('active')
    overthick.classList.remove('active')

}
thick.onclick = function () {
    lineWidth = 4
    circleRadius = 2
    thin.classList.remove('active')
    thick.classList.add('active')
    overthick.classList.remove('active')
}
overthick.onclick = function () {
    lineWidth = 6
    circleRadius = 3
    thin.classList.remove('active')
    thick.classList.remove('active')
    overthick.classList.add('active')
}

//************************************************??
function autoSetCanvasSize(canvas) {
    setCanvasSize()
    window.onresize = function () {
        setCanvasSize()
    }
    function setCanvasSize() {//the same code
        var pageWidth = document.documentElement.clientWidth
        var pageHeigth = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeigth
    }
}
function drawLine(x1,y1,x2,y2){
    context.beginPath();
    context.lineWidth = lineWidth
    context.beginPath()
    context.moveTo(x1,y1)
    context.lineTo(x2,y2)
    context.stroke()
    context.closePath()
}
function drawCircle(x,y,radius){
    context.beginPath()
    context.arc(x,y,radius,0,Math.PI*2)
    context.fill()

}
function listenToUser(canvas) {
    var using = false
    var lastPoint = {x: undefined, y: undefined}
    //特性检测
    if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (msg) {
            using = true
            var x = msg.touches[0].clientX
            var y = msg.touches[0].clientY
            lastPoint = {x: x, y: y}
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawCircle(x, y, circleRadius)
            }
        }
        canvas.ontouchmove = function (msg) {
            if (!using) return;
            var x = msg.touches[0].clientX
            var y = msg.touches[0].clientY
            var newPoint = {x: x, y: y}
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
            }
            lastPoint = newPoint
            /*******KeyPoint*********/

        }
        canvas.ontouchend = function () {
            using = false
        }
    } else {
        canvas.onmousedown = function (msg) {
            using = true
            var x = msg.clientX
            var y = msg.clientY
            lastPoint = {x: x, y: y}
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawCircle(x, y, circleRadius)
            }
        }
        canvas.onmousemove = function (msg) {
            if (!using) return;
            var x = msg.clientX
            var y = msg.clientY
            var newPoint = {x: x, y: y}
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
            }
            lastPoint = newPoint
            /*******KeyPoint*********/

        }
        canvas.onmouseup = function () {
            using = false
        }
    }
}