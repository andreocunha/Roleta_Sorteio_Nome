let options = ["ANDRÉ","ARTUR","BETÂNEA","IONILDO"];
// console.log(options.length)
let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let ctx;

document.getElementById("spin").addEventListener("click", spin);

function getColor(item) {
    if (item === 1){
        return "#009100"
    }
    else if (item === 2){
        return "#d0d000"
    }
    else if (item === 3){
        return "#000a84"
    }
    else{
        return "#919191"
    }
}

function drawRouletteWheel() {
  let canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    let outsideRadius = 200;
    let textRadius = 150;
    let insideRadius = 15;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = '16px Arial';

    let count = 1;

    for(let i = 0; i < options.length; i++) {
      let angle = startAngle + i * arc;
      
      if(count === 5){
          count = 1
      }
      ctx.fillStyle = getColor(count);
      count++;

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "white";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI);
      let text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(250 - 8, 250 - ((outsideRadius+20) + 30));
    ctx.lineTo(250 + 8, 250 - ((outsideRadius+20) + 30));
    ctx.lineTo(250 + 8, 250 - ((outsideRadius+20) - 5));
    ctx.lineTo(250 + 18, 250 - ((outsideRadius+20) - 5));
    ctx.lineTo(250 + 0, 250 - ((outsideRadius+20) - 40));
    ctx.lineTo(250 - 18, 250 - ((outsideRadius+20) - 5));
    ctx.lineTo(250 - 8, 250 - ((outsideRadius+20) - 5));
    ctx.lineTo(250 - 8, 250 - ((outsideRadius+20) + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  // console.log(spinAngleStart)
  spinTime = 0;
  spinTimeTotal = 10000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  let degrees = startAngle * 180 / Math.PI + 90;
  let arcd = arc * 180 / Math.PI;
  let index = Math.floor((360 - degrees % 360) / arcd);
  // console.log(index)
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  let text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  startAngle = 0
}

function easeOut(t, b, c, d) {
  let ts = (t/=d)*t;
  let tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();