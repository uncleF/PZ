/* global Phaser */

import * as hero from 'characters/hero.js';
import * as zombie from 'characters/zombie.js';

export default function init(game) {
  let platform;

  let keyUp;
  let keyLeft;
  let keyRight;
  let keySpace;

  function gameplay() {}

  gameplay.prototype = {

    hit(bullet, body) {
      return (body.x - 10 <= bullet.x) && (body.x + 10 >= bullet.x);
    },

    hits() {
      const bullets = hero.projectiles();
      if (bullets.length > 0) {
        const { body, isLeft } = zombie.collider();
        if (bullets.some(bullet => this.hit(bullet, body, isLeft))) {
          zombie.die();
          hero.dropBullets();
        }
      }
    },

    update() {
      this.hits();
      game.physics.arcade.collide(hero.collider(), platform);
      hero.update();
      zombie.update();
    },

    drawLine(x, y, width, height) {
      const graphics = game.add.graphics(x, y);
      graphics.beginFill(0x000000, 0);
      graphics.drawRect(0, 0, width, height);
      graphics.endFill();
      return graphics;
    },

    initPhysics() {
      platform = this.drawLine(0, 80, 320, 4);
      game.physics.arcade.enable(platform);
      platform.body.allowGravity = true;
      platform.body.immovable = true;
    },

    initFloor() {
      game.add.tileSprite(0, 80, 320, 4, 'floor');
    },

    initKeys() {
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

    init() {
      this.initPhysics();
      this.initFloor();
      this.initKeys();
      hero.init(game);
      zombie.init(game);
    },

  };

  return gameplay;
}
