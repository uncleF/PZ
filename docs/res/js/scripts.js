(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropBullets = dropBullets;
exports.projectiles = projectiles;
exports.walkLeft = walkLeft;
exports.walkRight = walkRight;
exports.stop = stop;
exports.jump = jump;
exports.shoot = shoot;
exports.collider = collider;
exports.update = update;
exports.init = init;
var WALK_SPEED = 0.65;
var RECOIL_SPEED = 0.25;
var BULLET_SPEED = 15;

var WALK_FRAMES = 13;
var JUMP_FRAMES = 20;
var SHOT_FRAMES = 30;
var DUST_FRAMES = 10;

var GRAVITY = 1000;
var VELOCITY = -200;

var BULLET_DISTANCE = 35;

var game = void 0;

var group = void 0;
var hero = void 0;
var weapon = void 0;
var dust = void 0;

var heroX = void 0;
var heroY = void 0;
var heroSpeed = 0;

var bullets = [];

var animWalk = void 0;
var animJump = void 0;
var animShoot = void 0;
var animRecoil = void 0;
var animDust = void 0;

var isLeft = true;
var isWalking = false;
var isAirborn = false;
var isShooting = false;

function dropBullets() {
  bullets = [];
}

function updateBullet(projectile, index) {
  var item = projectile;
  if (Math.abs(item.x - item.start) > BULLET_DISTANCE) bullets.splice(index, 1);else item.x -= item.isLeft ? BULLET_SPEED : -BULLET_SPEED;
}

function updateBullets() {
  bullets.forEach(updateBullet);
}

function projectiles() {
  return bullets;
}

function walk() {
  if (!isAirborn && !isWalking) {
    isWalking = true;
    animWalk.play(WALK_FRAMES, true);
    heroSpeed = !isLeft ? WALK_SPEED : -WALK_SPEED;
  }
}

function walkLeft() {
  isLeft = true;
  hero.scale.setTo(1, 1);
  weapon.scale.setTo(1, 1);
  dust.scale.setTo(1, 1);
  walk();
}

function walkRight() {
  isLeft = false;
  hero.scale.setTo(-1, 1);
  weapon.scale.setTo(-1, 1);
  dust.scale.setTo(-1, 1);
  walk();
}

function stop() {
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

function jump() {
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
  return { x: group.x, start: group.x, isLeft: isLeft };
}

function fire() {
  bullets.push(bullet());
}

function shoot() {
  if (!isShooting) {
    isShooting = true;
    heroSpeed += isLeft ? RECOIL_SPEED : -RECOIL_SPEED;
    animShoot.play(SHOT_FRAMES, false);
    fire();
  }
}

function collider() {
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

function update() {
  group.x += heroSpeed;
  weapon.y = hero.y;
  if (isAirborn) land();
  if (bullets.length > 0) updateBullets();
}

function init(instance) {
  game = instance;
  initHero();
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collider = collider;
exports.die = die;
exports.update = update;
exports.init = init;
var WALK_SPEED = 0.25;

var WALK_FRAMES = 8;
var EXPL_FRAMES = 20;

var game = void 0;

var zombie = void 0;
var explosion = void 0;

var speed = WALK_SPEED;

var isLeft = true;

var animWalk = void 0;
var animExpl = void 0;

function collider() {
  return {
    isLeft: isLeft,
    body: zombie
  };
}

function shouldRespawn() {
  return isLeft && zombie.x < -30 || !isLeft && zombie.x > game.world.width + 30;
}

function die() {
  speed = 0;
  zombie.alpha = 0;
  explosion.alpha = 1;
  animExpl.play(EXPL_FRAMES, false);
}

function respawn() {
  setTimeout(function () {
    var option = 1 + Math.round(Math.random());
    isLeft = Math.round(Math.random());
    zombie.loadTexture('zombie' + option);
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

function update() {
  if (shouldRespawn()) respawn();else {
    var currentSpeed = isLeft ? speed : -speed;
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

function init(instance) {
  game = instance;
  initZombie();
  initExplosion();
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;
/* global Phaser */

var GAME_BACKGROUND = '#6ca7ac';

function init(game) {
  function boot() {}

  boot.prototype = {
    initRendering: function initRendering() {
      var instance = game;
      instance.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      instance.stage.backgroundColor = GAME_BACKGROUND;
      instance.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(instance.canvas);
    },
    initMechanics: function initMechanics() {
      var instance = game;
      instance.physics.startSystem(Phaser.Physics.ARCADE);
    },
    initInput: function initInput() {
      game.input.gamepad.start();
    },
    init: function init() {
      this.initRendering();
      this.initMechanics();
      this.initInput();
    },
    create: function create() {
      game.state.start('gameplay');
    },
    preload: function preload() {
      game.load.spritesheet('charJump', 'assets/sprites/charJump.png', 32, 32, 7);
      game.load.spritesheet('charWalk', 'assets/sprites/charWalk.png', 32, 32, 4);
      game.load.spritesheet('dust', 'assets/sprites/dust.png', 32, 32, 3);
      game.load.spritesheet('explosion', 'assets/sprites/explosion.png', 38, 32, 8);
      game.load.spritesheet('weapon', 'assets/sprites/weapon.png', 36, 32, 6);
      game.load.spritesheet('zombie1', 'assets/sprites/zombie1.png', 32, 32, 6);
      game.load.spritesheet('zombie2', 'assets/sprites/zombie2.png', 32, 32, 6);
      game.load.image('cloud1', 'assets/sprites/cloud1.png');
      game.load.image('cloud2', 'assets/sprites/cloud2.png');
      game.load.image('crate', 'assets/sprites/crate.png');
      game.load.image('floor', 'assets/sprites/floor.png');
    }
  };

  return boot;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _hero = require('characters/hero.js');

var hero = _interopRequireWildcard(_hero);

var _zombie = require('characters/zombie.js');

var zombie = _interopRequireWildcard(_zombie);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* global Phaser */

function init(game) {
  var platform = void 0;

  var keyUp = void 0;
  var keyLeft = void 0;
  var keyRight = void 0;
  var keySpace = void 0;

  function gameplay() {}

  gameplay.prototype = {
    hit: function hit(bullet, body) {
      return body.x - 10 <= bullet.x && body.x + 10 >= bullet.x;
    },
    hits: function hits() {
      var _this = this;

      var bullets = hero.projectiles();
      if (bullets.length > 0) {
        var _zombie$collider = zombie.collider(),
            body = _zombie$collider.body,
            isLeft = _zombie$collider.isLeft;

        if (bullets.some(function (bullet) {
          return _this.hit(bullet, body, isLeft);
        })) {
          zombie.die();
          hero.dropBullets();
        }
      }
    },
    update: function update() {
      this.hits();
      game.physics.arcade.collide(hero.collider(), platform);
      hero.update();
      zombie.update();
    },
    drawLine: function drawLine(x, y, width, height) {
      var graphics = game.add.graphics(x, y);
      graphics.beginFill(0x000000, 0);
      graphics.drawRect(0, 0, width, height);
      graphics.endFill();
      return graphics;
    },
    initPhysics: function initPhysics() {
      platform = this.drawLine(0, 80, 320, 4);
      game.physics.arcade.enable(platform);
      platform.body.allowGravity = true;
      platform.body.immovable = true;
    },
    initFloor: function initFloor() {
      game.add.tileSprite(0, 80, 320, 4, 'floor');
    },
    initKeys: function initKeys() {
      keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      keyUp.onDown.add(hero.jump);
      keyLeft.onDown.add(hero.walkLeft);
      keyRight.onDown.add(hero.walkRight);
      keySpace.onDown.add(hero.shoot);
      keyLeft.onUp.add(hero.stop);
      keyRight.onUp.add(hero.stop);
    },
    init: function init() {
      this.initPhysics();
      this.initFloor();
      this.initKeys();
      hero.init(game);
      zombie.init(game);
    }
  };

  return gameplay;
}

},{"characters/hero.js":1,"characters/zombie.js":2}],5:[function(require,module,exports){
'use strict';

var _boot = require('states/boot.js');

var _boot2 = _interopRequireDefault(_boot);

var _gameplay = require('states/gameplay.js');

var _gameplay2 = _interopRequireDefault(_gameplay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PIXI */
/* global p2 */
/* global Phaser */

function createGame() {
  return new Phaser.Game(300, 100, Phaser.CANVAS, document.querySelector('#game'));
}

function addGameStates(game) {
  game.state.add('boot', (0, _boot2.default)(game));
  game.state.add('gameplay', (0, _gameplay2.default)(game));
}

function startGame(game) {
  game.state.start('boot');
}

function init() {
  var game = createGame();
  addGameStates(game);
  startGame(game);
}

init();

},{"states/boot.js":3,"states/gameplay.js":4}]},{},[5]);
