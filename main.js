import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
import { load } from "./utils/loader.js";
import { Player } from "./entities/Player.js";

//import kaboom from "./libs/kaboom.mjs"

kaboom({
  width: 1280,
  height: 720,
  letterbox: true,
});

load.assets();

scene("fight", () => {
  const background = add([sprite("background"), scale(4)]);

  background.add([sprite("trees")]);

  const groundTiles = addLevel(
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "------#######-----------",
      "dddddddddddddddddddddddd",
      "dddddddddddddddddddddddd",
    ],
    {
      tileWidth: 16,
      tileHeight: 16,
      tiles: {
        "#": () => [sprite("ground-golden"), area(), body({ isStatic: true })],
        "-": () => [sprite("ground-silver"), area(), body({ isStatic: true })],
        d: () => [sprite("deep-ground"), area(), body({ isStatic: true })],
      },
    }
  );

  groundTiles.use(scale(4));

  const shop = background.add([sprite("shop"), pos(170, 15)]);

  shop.play("default");

  add([rect(16, 720), area(), body({ isStatic: true }), pos(-20, 0)]);

  add([rect(16, 720), area(), body({ isStatic: true }), pos(1280, 0)]);

  background.add([sprite("fence"), pos(85, 125)]);

  background.add([sprite("fence"), pos(10, 125)]);

  background.add([sprite("sign"), pos(290, 115)]);

  const player1 = new Player(200, 100, 500, "a", "d", "w", "space", "player1");

  setGravity(1200);

  /*player1.use(sprite(player1.sprites.idle))
  player1.play("idle");

  player1.onUpdate(() => resetAfterJump(player1));
*/
  const player2 = new Player(
    1000,
    200,
    500,
    "left",
    "right",
    "up",
    "down",
    "player2"
  );

  /*player2.use(sprite(player2.sprites.idle));
  player2.play("idle");*/
  player2.flipX = true;

  //player2.onUpdate(() => resetAfterJump());

  const counter = add([
    rect(100, 100),
    pos(center().x, center().y - 300),
    color(10, 10, 10),
    area(),
    anchor("center"),
  ]);

  const count = counter.add([
    text("60"),
    area(),
    anchor("center"),
    {
      timeLeft: 60,
    },
  ]);

  const winningText = add([text(""), area(), anchor("center"), pos(center())]);

  let gameOver = false;
  onKeyDown("enter", () => (gameOver ? go("fight") : null));

  function declareWinner(winningText, player1, player2) {
    if (
      (player1.health > 0 && player2.health > 0) ||
      (player1.health === 0 && player2.health === 0)
    ) {
      winningText.text = "Tie!";
    } else if (player1.health > 0 && player2.health === 0) {
      winningText.text = "Player 1 won!";
      //player2.use(sprite(player2.sprites.death));
      //player2.play("death");
    } else {
      winningText.text = "Player 2 won";
      //player1.use(sprite(player1.sprites.death));
      //player1.play("death");
    }
  }

  const countInterval = setInterval(() => {
    if (count.timeLeft === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;

      return;
    }

    count.timeLeft--;
    count.text = count.timeLeft;
  }, 1000);

  const player1HealthContainer = add([
    rect(500, 70),
    area(),
    outline(5),
    pos(90, 20),
    color(200, 0, 0),
  ]);

  const player1HealthBar = player1HealthContainer.add([
    rect(498, 65),
    color(0, 180, 0),
    pos(498, 70 - 2.5),
    rotate(180),
  ]);

  onCollide(player1, player2.id + "attackHitbox", () => {
    if (gameOver) {
      return;
    }

    if (player1.health !== 0) {
      player1.health -= 50;
      tween(
        player1HealthBar.width,
        player1.health,
        1,
        (val) => {
          player1HealthBar.width = val;
        },
        easings.easeOutSine
      );
    }

    if (player1.health === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;
    }
  });

  const player2HealthContainer = add([
    rect(500, 70),
    area(),
    outline(5),
    pos(690, 20),
    color(200, 0, 0),
  ]);

  const player2HealthBar = player2HealthContainer.add([
    rect(498, 65),
    color(0, 180, 0),
    pos(2.5, 2.5),
  ]);

  onCollide(player2, player1.id + "attackHitbox", () => {
    if (gameOver) {
      return;
    }

    if (player2.health !== 0) {
      player2.health -= 50;
      tween(
        player2HealthBar.width,
        player2.health,
        1,
        (val) => {
          player2HealthBar.width = val;
        },
        easings.easeOutSine
      );
    }

    if (player2.health === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;
    }
  });
});

go("fight");
