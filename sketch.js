let stones = [];

// 바둑판 설정
const GRID_COUNT = 19;   // 19줄 바둑판
const BOARD_MARGIN = 40; // 캔버스 가장자리와 판 사이 여백
let cellSize;            // 격자 한 칸 크기

// 클릭했을 때 미는 힘 (1 = 처음 세기)
const FLICK_POWER = 0.8;

function setup() {
  createCanvas(600, 600);

  cellSize = (Math.min(width, height) - BOARD_MARGIN * 2) / (GRID_COUNT - 1);

  // 돌이 움직일 수 있는 영역 = 바둑판
  const b = boardRect();
  const boardArea = {
    minX: b.x,
    maxX: b.x + b.size,
    minY: b.y,
    maxY: b.y + b.size
  };

  // 흑돌은 판 한가운데(천원), 백돌은 그 오른쪽
  const black = new Particle(cellSize * 0.95, boardArea, 16);
  const white = new Particle(cellSize * 0.95, boardArea, 235);
  white.pos.set(width / 2 + cellSize * 3, height / 2);

  stones.push(black, white);
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

  for (const stone of stones) {
    stone.update();
  }

  resolveCollisions();

  for (const stone of stones) {
    stone.show();
  }
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

// 돌끼리 부딪히면 서로 튕겨나감
function resolveCollisions() {
  for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
      bounce(stones[i], stones[j]);
    }
  }
}

function bounce(a, b) {
  if (!a.alive || !b.alive) return;

  const d = p5.Vector.sub(b.pos, a.pos);
  const dist = d.mag();
  const minDist = (a.w + b.w) / 2;

  // 닿지 않았으면 그대로
  if (dist === 0 || dist >= minDist) return;

  const n = d.copy().normalize(); // a에서 b로 가는 방향

  // 겹친 만큼 서로 밀어냄
  const overlap = minDist - dist;
  a.pos.add(p5.Vector.mult(n, -overlap / 2));
  b.pos.add(p5.Vector.mult(n, overlap / 2));

  // 법선 방향 속도. 이미 서로 멀어지는 중이면 그대로 둠
  const va = a.vel.dot(n);
  const vb = b.vel.dot(n);
  const closing = va - vb;
  if (closing <= 0) return;

  // 두 돌의 질량이 같으므로 법선 방향 속도를 서로 주고받음
  const impulse = closing * 0.9;
  a.vel.sub(p5.Vector.mult(n, impulse));
  b.vel.add(p5.Vector.mult(n, impulse));
}

function mouseClicked() {
  const mPos = createVector(mouseX, mouseY);

  for (const stone of stones) {
    if (!stone.alive) continue;

    //let kaggi = stone.pos - mPos;
    const kaggi = p5.Vector.sub(stone.pos, mPos);

    if (kaggi.mag() < stone.w / 2) {
      stone.addForce(p5.Vector.mult(kaggi, FLICK_POWER));
    }
  }
}
