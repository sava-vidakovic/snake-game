var game;

//Create a new game instance
game = new Phaser.Game(600, 450, Phaser.AUTO, '');

//Add Menu state to the game
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Game_Over', Game_Over);

game.state.start('Menu');
