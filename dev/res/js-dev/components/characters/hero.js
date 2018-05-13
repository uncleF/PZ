const WALK_SPEED = 0.65;
const RECOIL_SPEED = 0.25;
const BULLET_SPEED = 15;

const WALK_FRAMES = 13;
const JUMP_FRAMES = 20;
const SHOT_FRAMES = 30;
const DUST_FRAMES = 10;

const GRAVITY = 1000;
const VELOCITY = -200;

const BULLET_DISTANCE = 35;

let game;

let group;
let hero;
let weapon;
let dust;

let heroX;
let heroY;
let heroSpeed = 0;

let bullets = [];

let animWalk;
let animJump;
let animShoot;
let animRecoil;
let animDust;

let isLeft = true;
let isWalking = false;
let isAirborn = false;
let isShooting = false;

export function dropBullets() {
  bullets = [];
}

function updateBullet(projectile, index) {
  const item = projectile;
  if (Math.abs(item.x - item.start) > BULLET_DISTANCE) bullets.splice(index, 1);
  else item.x -= item.isLeft ? BULLET_SPEED : -BULLET_SPEED;
}

function updateBullets() {
  bullets.forEach(updateBullet);
}

export function projectiles() {
  return bullets;
}

function walk() {
  if (!isAirborn && !isWalking) {
    isWalking = true;
    animWalk.play(WALK_FRAMES, true);
    heroSpeed = !isLeft ? WALK_SPEED : -WALK_SPEED;
  }
}

export function walkLeft() {
  isLeft = true;
  hero.scale.setTo(1, 1);
  weapon.scale.setTo(1, 1);
  dust.scale.setTo(1, 1);
  walk();
}

export function walkRight() {
  isLeft = false;
  hero.scale.setTo(-1, 1);
  weapon.scale.setTo(-1, 1);
  dust.scale.setTo(-1, 1);
  walk();
}

export function stop() {
  if (isWalking) {
    isWalking = false;
    animWalk.stop('charWalk');
    hero.animations.frame = 0;
    heroSpeed = 0;
  }
}

function disappear() {
  dust.alpha = 0;
}

function fly() {
  isAirborn = true;
  hero.loadTexture('charWalk');
  hero.body.velocity.y = VELOCITY;
  dust.x = group.x;
  dust.alpha = 1;
  animDust.play(DUST_FRAMES, false);
}

function land() {
  if (hero.body.velocity.y === 0) {
    isAirborn = false;
    if (isWalking) animWalk.play(WALK_FRAMES, true);
  }
}

export function jump() {
  if (!isAirborn) {
    hero.loadTexture('charJump');
    animJump.play(JUMP_FRAMES, false);
  }
}

function reload() {
  isShooting = false;
  heroSpeed -= isLeft ? RECOIL_SPEED : -RECOIL_SPEED;
  animRecoil.play(SHOT_FRAMES, false);
}

function bullet() {
  return { x: group.x, start: group.x, isLeft };
}

function fire() {
  bullets.push(bullet());
}

export function shoot() {
  if (!isShooting) {
    isShooting = true;
    heroSpeed += isLeft ? RECOIL_SPEED : -RECOIL_SPEED;
    animShoot.play(SHOT_FRAMES, false);
    fire();
  }
}

export function collider() {
  return hero;
}

function initHeroGroup() {
  group = game.add.group();
  group.x = heroX;
}

function initHeroPosition() {
  heroX = 155;
  heroY = game.world.height - 20;
}

function initWeaponSprite() {
  weapon = game.add.sprite(0, heroY, 'weapon');
  weapon.anchor.setTo(0.5, 1);
  animShoot = weapon.animations.add('weapon', [0, 1, 2]);
  animRecoil = weapon.animations.add('weapon', [3, 4, 5]);
  animShoot.onComplete.add(reload);
  group.add(weapon);
}

function initHeroSprite() {
  hero = game.add.sprite(0, heroY, 'charWalk');
  hero.anchor.setTo(0.5, 1);
  animWalk = hero.animations.add('charWalk');
  animJump = hero.animations.add('charJump', [0, 1, 2, 3, 4, 5]);
  animJump.onComplete.add(fly);
  group.add(hero);
}

function initDustSprite() {
  dust = game.add.sprite(heroY, heroY, 'dust');
  dust.anchor.setTo(0.5, 1);
  dust.alpha = 0;
  animDust = dust.animations.add('dust', [0, 1, 2]);
  animDust.onComplete.add(disappear);
}

function initPhysics() {
  game.physics.arcade.enable(group);
  hero.body.gravity.y = GRAVITY;
  hero.body.collideWorldBounds = true;
}

function initHero() {
  initHeroPosition();
  initHeroGroup();
  initWeaponSprite();
  initHeroSprite();
  initDustSprite();
  initPhysics();
}

export function update() {
  group.x += heroSpeed;
  weapon.y = hero.y;
  if (isAirborn) land();
  if (bullets.length > 0) updateBullets();
}

export function init(instance) {
  game = instance;
  initHero();
}
