var snake, apple, squareSize, score, speed,
  updateDelay, direction, newDirection,
  addNew, cursors, scoreTextValue, speedTextValue,
  textStyleKey, textStyleValue;

var Game = {

  preload: function () {
    game.load.image('snake', 'assets/images/snake.png');
    game.load.image('apple', 'assets/images/apple.png');
  },

  create: function () {

    snake = [];               // Containing the parts of the snake;
    apple = {};               // Object for the apple;
    squareSize = 15;          // Because the image size is 15x15
    score = 0;
    speed = 0;
    updateDelay = 0;          // Control update rates;
    direction = 'right';      // Default direction of the snake;
    newDirection = null;      // A buffer to store the new direction into;
    addNew = false;           // Used when an apple has been eaten;

    // Set up a Phaser controller
    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = '#061f27';

    // Generate the initial snake stack.
    for (var i = 0; i < 10; i++) {
      snake[i] = game.add.sprite(150 + i * squareSize, 150, 'snake');
    }

    // Generate the first apple.
    this.generateApple();

    // Add Text to top of game.
    textStyleKey = {font: "bold 14px sans-serif", fill: "#46c0f9", align: "center"};
    textStyleValue = {font: "bold 18px sans-serif", fill: "#fff", align: "center"};

    // Score
    game.add.text(30, 20, 'SCORE', textStyleKey);
    scoreTextValue = game.add.text(90, 18, score.toString(), textStyleValue);
    // Speed
    game.add.text(500, 20, "SPEED", textStyleKey);
    speedTextValue = game.add.text(558, 18, speed.toString(), textStyleValue);
  },

  // Update function rate is around 60 FPS
  update: function () {
    // Handle controls

    if (cursors.right.isDown && direction != 'left') {
      newDirection = 'right'
    }
    if (cursors.left.isDown && direction != 'right') {
      newDirection = 'left'
    }
    if (cursors.up.isDown && direction != 'down') {
      newDirection = 'up'
    }
    if (cursors.down.isDown && direction != 'up') {
      newDirection = 'down'
    }

    //Calculate game speed
    speed = Math.min(10, Math.floor(score / 5));
    //Update speed value on game screen.
    speedTextValue.text = '' + speed;

    // Increase a counter on every update call.
    updateDelay++;

    // Actual game speed
    if (updateDelay % (10 - speed) == 0) {
      // Snake movement
      var firstCell = snake[snake.length - 1],
        lastCell = snake.shift(),
        oldLastCellX = lastCell.x,
        oldLastCellY = lastCell.y;

      // Make direction
      if (newDirection) {
        direction = newDirection;
        newDirection = null;
      }

      // Change the last cell's coordinates relative to the head of the snake, according to the direction.

      if (direction == 'right') {
        lastCell.x = firstCell.x + squareSize;
        lastCell.y = firstCell.y;
      }
      else if (direction == 'left') {
        lastCell.x = firstCell.x - squareSize;
        lastCell.y = firstCell.y;
      }
      else if (direction == 'up') {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y - squareSize;
      }
      else if (direction == 'down') {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y + squareSize;
      }

      // Place the last cell in the front of the stack.
      // Mark it the first cell.

      snake.push(lastCell);
      firstCell = lastCell;

      // Colision detect

      // Eat the apple
      if (addNew) {
        snake.unshift(game.add.sprite(oldLastCellX, oldLastCellY, 'snake'));
        addNew = false;
      }

      // Check for apple collision.
      this.appleCollision();

      //Check for collision with self. Parameter is the head of the snake.
      this.selfCollision(firstCell);

      // Check with collision with wall. Parameter is the head of the snake.
      this.wallCollision(firstCell);
    }
  },

  appleCollision: function () {
    // Check if any part of the snake is overlapping the apple.
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x == apple.x && snake[i].y == apple.y) {

        // Next time the snake moves, a new block will be added to its length.
        addNew = true;

        // Destroy the old apple.
        apple.destroy();

        // Make a new one.
        this.generateApple();

        // Increase score.
        score++;

        // Refresh scoreboard.
        scoreTextValue.text = score.toString();

      }
    }
  },

  selfCollision: function (head) {

    // Check if the head of the snake overlaps with any part of the snake.
    for (var i = 0; i < snake.length - 1; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) {

        // If so, go to game over screen.
        game.state.start('Game_Over');
      }
    }

  },


  wallCollision: function (head) {


    if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0) {
      // If it's not in, we've hit a wall. Go to game over screen.
      game.state.start('Game_Over');
    }

  },


  generateApple: function () {
    var x = Math.floor(Math.random() * 40) * squareSize,
      y = Math.floor(Math.random() * 30) * squareSize;

    // Add a new apple.
    apple = game.add.sprite(x, y, 'apple');
  }
}
