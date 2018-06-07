var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
autoSetCanvasSize(canvas)
listenToMouse(canvas)

var eraserEnabled = false
eraser.onclick = function(){
    eraserEnabled = !eraserEnabled
    actions.className = 'actions x'
}
brush.onclick = function(){
    eraserEnabled = !eraserEnabled
    actions.className = 'actions'
}
//************************************************??
function autoSetCanvasSize(canvas) {
    setCanvasSize()
    window.onresize = function () {
        setWindowSize()
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
    context.strokeStyle = 'red'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(x1,y1)
    context.lineTo(x2,y2)
    context.stroke()
    context.closePath()
}
function drawCircle(x,y,radius){
    context.beginPath()
    context.arc(x,y,radius,0,Math.PI*2)
    context.fillStyle = 'red'
    context.fill()

}
function listenToMouse(canvas) {
    var using=false
    var lastPoint = {x:undefined,y:undefined}
    canvas.onmousedown = function (msg) {
        using = true
        var x = msg.clientX
        var y = msg.clientY
        lastPoint = {x: x, y: y}
        if (eraserEnabled) {
            context.clearRect(x - 5, y - 5, 10, 10)
        } else {
            drawCircle(x, y, 1)
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
    canvas.onmouseup = function (msg) {
        using = false
    }
}
