class Particle {
  constructor(size = 50, bounds = null) {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.c = color(16);
    this.w = size;

    // 돌이 움직일 수 있는 영역 (기본값은 캔버스 전체)
    this.bounds = bounds || {
      minX: 0,
      maxX: width,
      minY: 0,
      maxY: height
    };

    // 벽에 부딪혔을 때 남는 속도 비율 (1 = 영원히 튕김, 0 = 완전히 멈춤)
    this.bounce = 0.85;
  }

  addForce(aForce) {
    this.acc.add(aForce);
  }

  update() {
    this.vel.add(this.acc);

    // 너무 빨라져서 한 프레임에 벽을 뚫고 나가는 것을 방지
    const maxSpeed = 20;
    if (this.vel.mag() > maxSpeed) {
      this.vel.setMag(maxSpeed);
    }

    this.pos.add(this.vel);

    this.acc.set(0, 0);
    this.checkEdge();
  }


  checkEdge() {
    // 공의 반지름
    const r = this.w / 2;
    const b = this.bounds;
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;

    // 영역이 공보다 작아도 최소한 중앙에 머물도록 보정
    const minX = Math.min(b.minX + r, cx);
    const maxX = Math.max(b.maxX - r, cx);
    const minY = Math.min(b.minY + r, cy);
    const maxY = Math.max(b.maxY - r, cy);

    // 좌우 벽
    if (this.pos.x < minX) {
      this.pos.x = minX;
      if (this.vel.x < 0) this.vel.x *= -this.bounce;
    } else if (this.pos.x > maxX) {
      this.pos.x = maxX;
      if (this.vel.x > 0) this.vel.x *= -this.bounce;
    }

    // 위아래 벽
    if (this.pos.y < minY) {
      this.pos.y = minY;
      if (this.vel.y < 0) this.vel.y *= -this.bounce;
    } else if (this.pos.y > maxY) {
      this.pos.y = maxY;
      if (this.vel.y > 0) this.vel.y *= -this.bounce;
    }

    // 아주 느린 움직임은 멈춰서 미세한 떨림을 방지
    if (Math.abs(this.vel.x) < 0.05) this.vel.x = 0;
    if (Math.abs(this.vel.y) < 0.05) this.vel.y = 0;
  }


  show() {
    const r = this.w / 2;

    // 판 위에 드리우는 그림자
    noStroke();
    fill(0, 0, 0, 55);
    circle(this.pos.x + r * 0.12, this.pos.y + r * 0.16, this.w);

    // 돌
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.w);

    // 광택
    fill(255, 255, 255, 55);
    ellipse(this.pos.x - r * 0.3, this.pos.y - r * 0.32, r * 0.85, r * 0.6);
  }
}
