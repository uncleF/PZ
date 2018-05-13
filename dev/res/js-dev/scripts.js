/* global PIXI */
/* global p2 */
/* global Phaser */

import boot from 'states/boot.js';
import gameplay from 'states/gameplay.js';

function createGame() {
  return new Phaser.Game(300, 100, Phaser.CANVAS, document.querySelector('#game'));
}

function addGameStates(game) {
  game.state.add('boot', boot(game));
  game.state.add('gameplay', gameplay(game));
}

function startGame(game) {
  game.state.start('boot');
}

function init() {
  const game = createGame();
  addGameStates(game);
  startGame(game);
}

init();
