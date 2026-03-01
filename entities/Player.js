import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

export class Player {
  constructor(
    positionX,
    positionY,
    speed,
    left,
    right,
    jump,
    attackKey,
    id,
    flipx
  ) {
    (this.positionX = positionX),
      (this.positionY = positionY),
      (this.speed = speed),
      (this.left = left),
      (this.right = right),
      (this.jump = jump),
      (this.attackKey = attackKey),
      (this.id = id);
    this.flipX = flipx;
    (this.excludedKeys = [this.left, this.right, this.jump]), this.makePlayer();
    this.setPlayerMovement();
    this.update();
  }

  makePlayer() {
    this.gameObj = add([
      pos(this.positionX, this.positionY),
      scale(4),
      area({ shape: new Rect(vec2(0), 16, 42) }),
      anchor("center"),
      body({ stickToPlatform: true }),
      {
        isCurrentlyJumping: false,
        health: 500,
        sprites: {
          run: "run-" + this.id,
          idle: "idle-" + this.id,
          jump: "jump-" + this.id,
          attack: "attack-" + this.id,
          death: "death-" + this.id,
        },
      },
    ]);
  }

  setPlayerMovement() {
    onKeyDown(this.right, () => {
      this.run(this.speed, false);
    });

    onKeyRelease(this.right, () => {
      if (this.gameObj.health !== 0) {
        this.gameObj.flipX = false;
        this.resetPlayerToIdle();
      }
    });

    onKeyDown(this.left, () => {
      this.run(-this.speed, true);
    });

    onKeyRelease(this.left, () => {
      if (this.gameObj.health !== 0) {
        this.gameObj.flipX = true;
        this.resetPlayerToIdle();

      }
    });

    onKeyDown(this.up, () => {
      this.makeJump();
    });

    onKeyPress(this.attackKey, () => {
      this.attack();
    });

    onKeyRelease(this.attackKey, () => {
      destroyAll(this.id + "attackHitbox");
    });
  }

  run(speed, flipPlayer) {
    if (this.gameObj.health === 0) {
      return;
    }
    if (this.gameObj.curAnim() !== "run" && !this.gameObj.isCurrentlyJumping) {
      this.gameObj.flipX = flipPlayer;
      this.gameObj.use(sprite(this.gameObj.sprites.run));
      this.gameObj.play("run");
    }
    this.gameObj.move(speed, 0);
  }

  resetPlayerToIdle() {
    this.gameObj.use(sprite(this.gameObj.sprites.idle));
    this.gameObj.play("idle");
  }

  makeJump() {
    if (this.gameObj.health === 0) {
      return;
    }

    if (this.gameObj.isGrounded()) {
      const currentFlip = this.gameObj.flipX;
      this.gameObj.jump();
      this.gameObj.use(sprite(this.sprites.jump));
      this.gameObj.flipX = currentFlip;
      this.gameObj.play("jump");
      this.gameObj.isCurrentlyJumping = true;
    }
  }

  resetAfterJump() {
    if (this.gameObj.isGrounded() && this.gameObj.isCurrentlyJumping) {
      this.gameObj.isCurrentlyJumping = false;
      if (this.gameObj.curAnim() !== "idle") {
        this.resetPlayerToIdle();
      }
    }
  }

  update() {
    onUpdate(() => {
      this.resetAfterJump();
    });
  }

  attack() {
    if (this.gameObj.health === 0) {
      return;
    }

    for (const key of this.excludedKeys) {
      if (isKeyDown(key)) {
        return;
      }
    }
    const currentFlip = this.flipX;
    if (this.gameObj.curAnim() !== "attack") {
      this.gameObj.use(sprite(this.gameObj.sprites.attack));
      this.gameObj.flipX = currentFlip;
      const slashX = this.gameObj.pos.x + 30;
      const slashXFlipped = this.gameObj.pos.x - 350;
      const slashY = this.gameObj.pos.y - 200;

      add([
        rect(300, 300),
        area(),
        pos(currentFlip ? slashXFlipped : slashX, slashY),
        opacity(0),
        this.id + "attackHitbox",
      ]);

      this.gameObj.play("attack", {
        onEnd: () => {
          this.resetPlayerToIdle();
          this.gameObj.flipX = currentFlip;
        },
      });
    }
  }
}
