let ball;

// 바둑판 설정
const GRID_COUNT = 19;   // 19줄 바둑판
const BOARD_MARGIN = 40; // 캔버스 가장자리와 판 사이 여백
let cellSize;            // 격자 한 칸 크기

function setup() {
  createCanvas(600, 600);

  cellSize = (Math.min(width, height) - BOARD_MARGIN * 2) / (GRID_COUNT - 1);

  // 돌은 격자 한 칸에 꼭 맞는 크기로, 판 안에서만 움직이게
  const b = boardRect();
  ball = new Particle(cellSize * 0.95, {
    minX: b.x,
    maxX: b.x + b.size,
    minY: b.y,
    maxY: b.y + b.size
  });
}


function draw() {
  drawTable();
  drawBoard();

  // let gravity = createVector(0, 0.3);
  // ball.addForce(gravity);

  // if (mouseIsPressed) {
  //   let wind = createVector(0.1, 0);
  //   ball.addForce(wind);
  // }

  ball.update();
  ball.show();
}

// 바둑판이 놓인 탁자
function drawTable() {
  background(58, 44, 32);
}

// 판이 놓일 정사각형 영역
function boardRect() {
  const size = Math.min(width, height) - BOARD_MARGIN * 2;
  return {
    x: (width - size) / 2,
    y: (height - size) / 2,
    size: size,
    cell: size / (GRID_COUNT - 1)
  };
}

function drawBoard() {
  const b = boardRect();

  // 판(나무색)
  noStroke();
  fill(222, 184, 120);
  rect(b.x, b.y, b.size, b.size);

  // 격자
  stroke(70, 48, 26);
  strokeWeight(1);
  for (let i = 0; i < GRID_COUNT; i++) {
    const x = b.x + i * b.cell;
    const y = b.y + i * b.cell;
    line(b.x, y, b.x + b.size, y);
    line(x, b.y, x, b.y + b.size);
  }

  // 판 테두리
  noFill();
  strokeWeight(2.5);
  rect(b.x, b.y, b.size, b.size);

  // 화점 (3-3, 9-9 천원, 15-15 ...)
  noStroke();
  fill(70, 48, 26);
  const stars = [3, 9, 15];
  for (const cx of stars) {
    for (const cy of stars) {
      circle(b.x + cx * b.cell, b.y + cy * b.cell, 7);
    }
  }
  noStroke();
}

function mouseClicked() {
  let mPos = createVector(mouseX, mouseY);
  //let kaggi = ball.pos - mPos;
  let kaggi = p5.Vector.sub(ball.pos, mPos);
  
  if (kaggi.mag() < ball.w/2) {
    ball.addForce(kaggi);
  }

}
