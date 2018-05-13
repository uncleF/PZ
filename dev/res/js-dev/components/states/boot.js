/* global Phaser */

const GAME_BACKGROUND = '#6ca7ac';

export default function init(game) {
  function boot() {}

  boot.prototype = {

    initRendering() {
      const instance = game;
      instance.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      instance.stage.backgroundColor = GAME_BACKGROUND;
      instance.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(instance.canvas);
    },

    initMechanics() {
      const instance = game;
      instance.physics.startSystem(Phaser.Physics.ARCADE);
    },

    initInput() {
      game.input.gamepad.start();
    },

    init() {
      this.initRendering();
      this.initMechanics();
      this.initInput();
    },

    create() {
      game.state.start('gameplay');
    },

    preload() {
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
    },

  };

  return boot;
}
