const WALK_SPEED = 0.25;

const WALK_FRAMES = 8;
const EXPL_FRAMES = 20;

let game;

let zombie;
let explosion;

let speed = WALK_SPEED;

let isLeft = true;

let animWalk;
let animExpl;

export function collider() {
  return {
    isLeft,
    body: zombie,
  };
}

function shouldRespawn() {
  return (isLeft && zombie.x < -30) || (!isLeft && zombie.x > game.world.width + 30);
}

export function die() {
  speed = 0;
  zombie.alpha = 0;
  explosion.alpha = 1;
  animExpl.play(EXPL_FRAMES, false);
}

function respawn() {
  setTimeout(() => {
    const option = 1 + Math.round(Math.random());
    isLeft = Math.round(Math.random());
    zombie.loadTexture(`zombie${option}`);
    if (isLeft) {
      zombie.x = game.world.width + 10;
      explosion.x = game.world.width + 10;
      zombie.scale.setTo(1, 1);
    } else {
      zombie.x = -10;
      explosion.x = -10;
      zombie.scale.setTo(-1, 1);
    }
    zombie.alpha = 1;
    explosion.alpha = 0;
    speed = WALK_SPEED;
    animWalk.play(WALK_FRAMES, true);
  }, 500);
}

export function update() {
  if (shouldRespawn()) respawn();
  else {
    const currentSpeed = isLeft ? speed : -speed;
    zombie.x -= currentSpeed;
    explosion.x -= currentSpeed;
  }
}

function initZombie() {
  zombie = game.add.sprite(game.world.width + 10, game.world.height - 20, 'zombie1');
  zombie.anchor.setTo(0.5, 1);
  animWalk = zombie.animations.add('zombie');
  animWalk.play(WALK_FRAMES, true);
}

function initExplosion() {
  explosion = game.add.sprite(game.world.width + 10, game.world.height - 20, 'explosion');
  explosion.anchor.setTo(0.5, 1);
  animExpl = explosion.animations.add('explosion');
  animExpl.onComplete.add(respawn);
  explosion.alpha = 0;
}

export function init(instance) {
  game = instance;
  initZombie();
  initExplosion();
}
