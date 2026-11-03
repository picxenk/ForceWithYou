class Particle {
  constructor(size = 50, bounds = null, shade = 16) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.w = size;
    this.shade = shade;      // 돌의 밝기 (0 = 흑돌, 255 = 백돌)
    this.c = color(shade);

    // 돌이 놓인 판의 영역 (기본값은 캔버스 전체)
    this.bounds = bounds || {
      minX: 0,
      maxX: width,
      minY: 0,
      maxY: height
    };

    this.alive = true;       // 판 밖으로 나가면 false
    this.alpha = 1;          // 나가면서 서서히 사라지는 정도
  }

  addForce(aForce) {
    this.acc.add(aForce);
  }

  update() {
    if (!this.alive) return;

    this.vel.add(this.acc);

    // 너무 빨라져서 판을 한 번에 가로지르는 것을 방지
    const maxSpeed = 20;
    if (this.vel.mag() > maxSpeed) {
      this.vel.setMag(maxSpeed);
    }

    // 판과의 마찰로 서서히 멈춤
    this.vel.mult(0.96);
    if (this.vel.mag() < 0.05) {
      this.vel.set(0, 0);
    }

    this.pos.add(this.vel);

    this.acc.set(0, 0);
    this.checkOffBoard();
  }

  // 판 밖으로 나가면 서서히 사라지고, 다 사라지면 없어짐
  checkOffBoard() {
    const b = this.bounds;

    // 판 밖으로 나간 거리 (안에 있으면 0)
    const out = Math.max(
      b.minX - this.pos.x,
      this.pos.x - b.maxX,
      b.minY - this.pos.y,
      this.pos.y - b.maxY,
      0
    );

    if (out <= 0) {
      this.alpha = 1;
      return;
    }

    this.alpha = 1 - out / this.w;

    if (this.alpha <= 0) {
      this.alpha = 0;
      this.alive = false;
    }
  }

  show() {
    if (!this.alive) return;

    const r = this.w / 2;
    const a = 255 * this.alpha;

    // 판 위에 드리우는 그림자
    noStroke();
    fill(0, 0, 0, a * 0.22);
    circle(this.pos.x + r * 0.12, this.pos.y + r * 0.16, this.w);

    // 돌
    fill(red(this.c), green(this.c), blue(this.c), a);
    circle(this.pos.x, this.pos.y, this.w);

    // 광택 (흑돌은 흰 하이라이트, 백돌은 밝은 하이라이트)
    fill(255, 255, 255, this.shade < 128 ? a * 0.22 : a * 0.55);
    ellipse(this.pos.x - r * 0.3, this.pos.y - r * 0.32, r * 0.85, r * 0.6);
  }
}
