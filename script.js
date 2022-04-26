var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

var colorInput = document.getElementById('color-input')
var lineWidthInput = document.getElementById('line-width-input')

autoSetCanvasSize(canvas)
listenToUser(canvas)

// 画一个白底，优化下载图片的效果
context.fillStyle = '#fff'
context.fillRect(0, 0, canvas.width, canvas.height)

// 初始化
context.fillStyle = colorInput.value
context.strokeStyle = colorInput.value
context.lineWidth = lineWidthInput.value
var circleRadius = lineWidthInput.value / 2
context.lineCap = 'round' // 设置线条末端为圆角，可以使线条顺滑

// 颜色
colorInput.onchange = function ({ target: { value } }) {
  context.fillStyle = value
  context.strokeStyle = value
}
// 粗细
lineWidthInput.onchange = function ({ target: { value } }) {
  console.log(1)
  context.lineWidth = value
  circleRadius = value / 2
}

// 画笔
pen.onclick = function () {
  eraserEnabled = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}
// 橡皮擦
var eraserEnabled = false
eraser.onclick = function () {
  eraserEnabled = true
  eraser.classList.add('active')
  pen.classList.remove('active')
}
// 清除
clear.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height)
}
// 下载
download.onclick = function () {
  var url = canvas.toDataURL('image/png')
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'mypainting.png'
  a.target = '_blank'
  a.click()
}

// 设置画板宽高
function autoSetCanvasSize(canvas) {
  setCanvasSize()
  window.onresize = function () {
    setCanvasSize()
  }
  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeigth = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeigth
  }
}
// 画线
function drawLine(x1, y1, x2, y2) {
  context.beginPath()
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}
// 画点
function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}
function listenToUser(canvas) {
  var using = false
  var lastPoint = { x: undefined, y: undefined }
  // 手机触屏
  if (document.body.ontouchstart !== undefined) {
    canvas.ontouchstart = function (event) {
      using = true
      var x = event.touches[0].clientX
      var y = event.touches[0].clientY
      lastPoint = { x: x, y: y }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        drawCircle(x, y, circleRadius)
      }
    }
    canvas.ontouchmove = function (event) {
      if (!using) return
      var x = event.touches[0].clientX
      var y = event.touches[0].clientY
      var newPoint = { x: x, y: y }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
      }
      lastPoint = newPoint
    }
    canvas.ontouchend = function () {
      using = false
    }
  } else {
    // 鼠标点击
    canvas.onmousedown = function (event) {
      if (event.button !== 0) return
      using = true
      var x = event.clientX
      var y = event.clientY
      lastPoint = { x: x, y: y }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        drawCircle(x, y, circleRadius)
      }
    }
    canvas.onmousemove = function (event) {
      if (event.button !== 0) return
      if (!using) return
      var x = event.clientX
      var y = event.clientY
      var newPoint = { x: x, y: y }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
      }
      lastPoint = newPoint
    }
    canvas.onmouseup = function () {
      using = false
    }
  }
}
