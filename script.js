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
let penSet = {
  color: colorInput.value,
  width: lineWidthInput.value,
}
context.lineCap = 'round' // 设置线条末端为圆角，可以使线条顺滑
context.lineJoin = 'round'

// 颜色改变
colorInput.onchange = function ({ target: { value } }) {
  penSet.color = value
}
// 粗细改变
lineWidthInput.onchange = function ({ target: { value } }) {
  penSet.width = value
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
function drawLine(x1, y1, x2, y2, penSet) {
  context.strokeStyle = penSet.color
  context.lineWidth = penSet.width
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}
// 画点
function drawCircle(x, y, penSet) {
  // 选择颜色--再点击页面，先执行画点，再执行color-input的Change函数，画的点仍是之前的颜色，为了解决这个问题，加一个setTimeout延迟执行画点
  setTimeout(() => {
    context.fillStyle = penSet.color
    context.beginPath()
    context.arc(x, y, penSet.width / 2, 0, Math.PI * 2)
    context.fill()
  })
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
        // context.clearRect(x - 5, y - 5, 10, 10)
        drawCircle(x, y, { color: '#fff', width: penSet.width })
      } else {
        drawCircle(x, y, penSet)
      }
    }
    canvas.ontouchmove = function (event) {
      if (!using) return
      var x = event.touches[0].clientX
      var y = event.touches[0].clientY
      var newPoint = { x: x, y: y }
      if (eraserEnabled) {
        // context.clearRect(x - 5, y - 5, 10, 10)
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, {
          color: '#fff',
          width: penSet.width,
        })
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, penSet)
      }
      lastPoint = newPoint
    }
    window.ontouchend = function () {
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
        // 使用clearRect效果不好，尤其是操作速度快了时会不连续，改为画白色点/线的方式清除。
        // context.clearRect(x - 5, y - 5, 10, 10)
        drawCircle(x, y, { color: '#fff', width: penSet.width })
      } else {
        drawCircle(x, y, penSet)
      }
    }
    window.onmousemove = function (event) {
      if (event.button !== 0) return
      if (!using) return
      var x = event.clientX
      var y = event.clientY
      var newPoint = { x: x, y: y }
      if (eraserEnabled) {
        // context.clearRect(x - 5, y - 5, 10, 10)
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, {
          color: '#fff',
          width: penSet.width,
        })
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, penSet)
      }
      lastPoint = newPoint
    }
    // canvas.onmouseup = function () {
    //   using = false
    // }
    // 使用canvas监听mouseup的问题：按下鼠标开始画线，光标在离开窗口或canvas之后松开鼠标，无法监听到，导致光标回到窗口没有按下鼠标也会画线。所以改用window
    window.onmouseup = function () {
      using = false
    }
  }
}
