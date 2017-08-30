// 生成4位随机数
function rand() {
  const str = '0123456789'
  const arr = str.split('')
  let validate = ''
  let ranNum
  for (let i = 0; i < 4; i++) {
    ranNum = Math.floor(Math.random() * 10)   // 随机数在[0,9]之间
    validate += arr[ranNum]
  }
  return validate
}

// 随机x坐标值
function lineX() {
  return Math.floor(Math.random() * 90)
}

// 随机y坐标值
function lineY() {
  return Math.floor(Math.random() * 40)
}

function captcha(element) {
  const mycanvas = element
  const cxt = mycanvas.getContext('2d')
  const code = rand()
  cxt.fillStyle = 'rgba(0, 0, 0, 0)'
  cxt.clearRect(0, 0, 90, 40)
  cxt.fillRect(0, 0, 90, 40)

  // 生成干扰线20条
  for (let j = 0; j < 10; j++) {
    cxt.strokeStyle = '#ccc'
    // 若省略beginPath，则每点击一次验证码会累积干扰线的条数
    cxt.beginPath()
    cxt.moveTo(lineX(), lineY())
    cxt.lineTo(lineX(), lineY())
    cxt.lineWidth = 0.5
    cxt.closePath()
    cxt.stroke()
  }

  // 生成随机点30个
  for (let i = 0; i < 30; ++i) {
    cxt.strokeStyle = '#ccc'
    cxt.beginPath()
    cxt.arc(lineX(), lineY(), 2, 0, Math.PI * 2, true)
    cxt.fillStyle = '#ccc'
    cxt.fill()
    cxt.closePath()
    cxt.stroke()
  }

  cxt.fillStyle = '#bbb'
  cxt.font = 'bold 20px Arial'
  // 把rand()生成的随机数文本填充到canvas中
  cxt.fillText(code, 25, 25)
  return code
}

export default captcha