export class Player {
  constructor(positionX, positionY, speed, left, right, jump, attackKey, id) {
    (this.positionX = positionX),
      (this.positionY = positionY),
      (this.speed = speed),
      (this.left = left),
      (this.right = right),
      (this.jump = jump),
      (this.attackKey = attackKey),
      (this.id = id);
      this.excludedKeys = [this.left, this.right, this.jump]
    this.makePlayer();
    this.setPlayerMovement();
  }

  makePlayer() {
    add([
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
    run(speed, flipPlayer) {
      if (this.health === 0) {
        return;
      }
      if (this.curAnim() !== "run" && !this.isCurrentlyJumping) {
        this.use(sprite(this.sprites.run));
        this.play("run");
      }
      this.move(speed, 0);
      this.flipX = flipPlayer;
    }

    resetPlayerToIdle() {
      this.use(sprite(this.sprites.idle));
      this.play("idle");
    }

    onKeyDown(this.right, () => {
      run(this.speed, false);
    })

    onKeyRelease(this.right) {
      if (this.health !== 0) {
        resetPlayerToIdle();
        this.flipX = false;
      }
    }

    onKeyDown(this.left, () => {
      run(-this.speed, true);
    })

    onKeyRelease(this.left) {
      if (this.health !== 0) {
        resetPlayerToIdle();
        this.flipX = true;
      }
    }

    makeJump() {
      if (this.health === 0) {
        return;
      }

      if (player.isGrounded()) {
        const currentFlip = player.flipX;
        this.jump();
        this.use(sprite(this.sprites.jump));
        this.flipX = currentFlip;
        this.play("jump");
        this.isCurrentlyJumping = true;
      }
    }

    resetAfterJump() {
      if (this.isGrounded() && this.isCurrentlyJumping) {
        this.isCurrentlyJumping = false;
        if (this.curAnim() !== "idle") {
          resetPlayerToIdle();
        }
      }
    }

    onKeyDown(this.up, ()=> {
      makeJump();
    })

    onUpdate(() => {
        resetAfterJump()
    })

    attack() {
      if (this.health === 0) {
        return;
      }

      for (const key of this.excludedKeys) {
        if (isKeyDown(key)) {
          return;
        }
      }
      const currentFlip = this.flipX;
      if (this.curAnim() !== "attack") {
        this.use(sprite(this.sprites.attack));
        this.flipX = currentFlip;
        const slashX = this.pos.x + 30;
        const slashXFlipped = this.pos.x - 350;
        const slashY = this.pos.y - 200;

        add([
          rect(300, 300),
          area(),
          pos(currentFlip ? slashXFlipped : slashX, slashY),
          opacity(0),
          this.id + "attackHitbox",
        ]);

        this.play("attack", {
          onEnd: () => {
            resetPlayerToIdle();
            this.flipX = currentFlip;
          },
        });
      }
    }

    onKeyPress(this.attackKey, () => {
      attack();
    })

    onKeyRelease(this.attackKey) {
      destroyAll(this.id + "attackHitbox");
    }
  }
}
