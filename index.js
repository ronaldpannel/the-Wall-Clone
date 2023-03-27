window.addEventListener("load", function () {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 500;
  const canvasWrapper = document.getElementById("canvasWrapper");
  const quizWrapper = document.getElementById("quizWrapper");
  const backToQuizBtn = document.getElementById("backToQuizBtn");
  const wallScoreDisplay = document.getElementById("wallScore");
  const totalScoreDisplay = document.getElementById("totalScore");

  const pegsArray = [];
  const mouse = {
    x: undefined,
    y: undefined,
  };
  let bucketsArray = [];
  let ballsArray = [];
  let score = 0;
  let totalScore = 0;
  let col = 5;
  let row = 7;
  let gameScoreArray = [];
  class Ball {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.x = mouse.x;
      this.y = mouse.y;
      if (Math.random() > 0.5) {
        this.velX = -1;
      } else {
        this.velX = 1;
      }
      this.velY = 1;
      this.friction = 0.6;
      this.gravity = 0.1;
      this.radius = 7;
      this.hue = Math.floor(Math.random() * 360);
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${this.hue} 50% 50%)`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
    update() {
      this.x += this.velX;
      if (this.y + this.radius >= this.height) {
        this.velY = -this.velY * this.friction;
      } else {
        this.velY += this.gravity;
      }
      this.y += this.velY;
      if (
        this.x + this.velX - this.radius < 0 ||
        this.x + this.velX + this.radius > this.width
      ) {
        this.velX = -this.velX * this.friction * 0.9;
      }
    }
  }

  class Peg {
    constructor(width, height, x, y) {
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.color = "green";
      this.radius = 4;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
  function initPegs() {
    let spacing = canvas.width / col - 5;
    for (let j = 0; j < row; j++) {
      for (let i = 0; i < col; i++) {
        let x = spacing / 2 + i * spacing;
        if (j % 2 == 0) {
          x += spacing / 2;
        }
        let y = spacing + j * spacing;
        let peg = new Peg(canvas.width, canvas.height, x, y);
        pegsArray.push(peg);
      }
    }
  }
  class Bucket {
    constructor(width, height, x, y) {
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.boxWidth = 45;
      this.boxHeight = 50;
      this.color = "blue";
    }
    draw() {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x,
        this.y - this.boxHeight,
        this.boxWidth,
        this.boxHeight
      );
    }
  }
  function initBuckets() {
    for (let i = 0; i < 6; i++) {
      let spacing = i * 50;
      bucketsArray.push(
        new Bucket(canvas.width, canvas.height, 0 + spacing, canvas.height)
      );
    }
  }
  initBuckets();
  initPegs();

  function ballPegCollision() {
    for (let i = 0; i < ballsArray.length; i++) {
      for (let j = 0; j < pegsArray.length; j++) {
        let dx = ballsArray[i].x - pegsArray[j].x;
        let dy = ballsArray[i].y - pegsArray[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance <
          ballsArray[i].radius + pegsArray[j].radius + ballsArray[i].velY
        ) {
          ballsArray[i].velY = -ballsArray[i].velY * ballsArray[i].friction;
          if (Math.random() > 0.5) {
            ballsArray[i].velX = ballsArray[i].velX * -1;
          } else {
            ballsArray[i].velX = ballsArray[i].velX;
          }
        }
      }
    }
  }
  function ballBucketCollision() {
    for (let i = 0; i < ballsArray.length; i++) {
      for (let j = 0; j < bucketsArray.length; j++) {
        if (
          ballsArray[i].y + ballsArray[i].velY + ballsArray[i].radius >
            bucketsArray[j].y &&
          ballsArray[i].x + ballsArray[i].velX + ballsArray[i].radius >
            bucketsArray[j].x &&
          ballsArray[i].x + ballsArray[i].velX - ballsArray[i].radius <
            bucketsArray[j].x + bucketsArray[j].boxWidth
        ) {
          // ballsArray[i].velX = -ballsArray[i].velX * ballsArray[i].friction * 0.9;
          ballsArray[i].velX = -ballsArray[i].velX;
          ballsArray[i].velY *= 0.1;
          bucketsArray[j].color = "yellow";

          if (j == 0) {
            score = 10;
            wallScoreDisplay.innerHTML = score;
            totalScore = 10;
          }
          if (j == 1) {
            score = 30;
            wallScoreDisplay.innerHTML = score;
            totalScore = 30;
          }
          if (j == 2) {
            score = 50;
            wallScoreDisplay.innerHTML = score;
            totalScore = 50;
          }
          if (j == 3) {
            score = -50;
            wallScoreDisplay.innerHTML = score;
            totalScore = -50;
          }
          if (j == 4) {
            score = 30;
            wallScoreDisplay.innerHTML = score;
          }
          if (j == 5) {
            score = 10;
            wallScoreDisplay.innerHTML = score;
            totalScore = 10;
          }
        }
      }
    }
  }
  

  function drawDropZone() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(canvas.width, 30);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.lineTo(canvas.width, 120);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(canvas.width, 150);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 229);
    ctx.lineTo(canvas.width, 229);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 259);
    ctx.lineTo(canvas.width, 259);
    ctx.stroke();
    ctx.closePath();

    ctx.font = "18px  Arial, Helvetica, sans-serif";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.strokeText("100 Pt Ball Drop Zone ", canvas.width / 2 - 90, 18);
    ctx.strokeText("200 Pt Ball Drop Zone ", canvas.width / 2 - 90, 140);
    ctx.strokeText("300 Pt Ball Drop Zone ", canvas.width / 2 - 90, 250);

    ctx.strokeText("10 ", 16, canvas.height - 20);
    ctx.strokeText("30 ", 65, canvas.height - 20);
    ctx.strokeText("50 ", 116, canvas.height - 20);
    ctx.strokeText("-50 ", 160, canvas.height - 20);
    ctx.strokeText("30 ", 216, canvas.height - 20);
    ctx.strokeText("10 ", 265, canvas.height - 20);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballsArray.forEach((ball) => {
      ball.draw();
      ball.update();
    });

    //draw pegs
    for (let i = 0; i < pegsArray.length; i++) {
      pegsArray[i].draw();
    }

    //Draw buckets
    for (let i = 0; i < bucketsArray.length; i++) {
      bucketsArray[i].draw();
    }
    drawDropZone();
    ballPegCollision();
    ballBucketCollision();

    requestAnimationFrame(animate);
  }
  animate();

  canvas.addEventListener("click", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    ballsArray.push(new Ball(canvas.width, canvas.height));
  });

  backToQuizBtn.addEventListener("click", function () {
    gameScoreArray.push(score);
    let result = gameScoreArray.reduce((a, b) => {
      return a + b;
    });
    totalScoreDisplay.innerHTML = result + quizScore;

    quizWrapper.classList.remove("inactive");
  });

  //load function end
});
