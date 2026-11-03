class Particle {
  constructor() {
    this.pos = createVector(width/2, height/3);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.c = color(0);
    this.w = 50;

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

    // 캔버스가 공보다 작아도 최소한 중앙에 머물도록 보정
    const minX = Math.min(r, width / 2);
    const maxX = Math.max(width - r, width / 2);
    const minY = Math.min(r, height / 2);
    const maxY = Math.max(height - r, height / 2);

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
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.w);
  }
}
