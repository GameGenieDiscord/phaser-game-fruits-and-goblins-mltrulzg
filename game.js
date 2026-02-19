// fruits-and-goblins - Phaser.js Game

let player, cursors, score = 0, scoreText, gameOver = false;
let foods, goblins, wasd;

function preload() {
    // Load pixel art sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('goblin', 'assets/goblin.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('pineapple', 'assets/pineapple.png');
}

function create() {
    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(2);
    
    // Create food group
    foods = this.physics.add.group();
    const foodTypes = ['banana', 'apple', 'pineapple'];
    for (let i = 0; i < 15; i++) {
        const foodType = Phaser.Math.RND.pick(foodTypes);
        const food = foods.create(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), foodType);
        food.setScale(2);
    }
    
    // Create goblins group
    goblins = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        const goblin = goblins.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'goblin');
        goblin.setScale(2);
        goblin.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        goblin.setBounce(1);
        goblin.setCollideWorldBounds(true);
    }
    
    // WASD controls
    wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'monospace'
    });
    
    // Collisions
    this.physics.add.overlap(player, foods, collectFood, null, this);
    this.physics.add.overlap(player, goblins, hitGoblin, null, this);
}

function update() {
    if (gameOver) return;
    
    // Player movement with WASD
    let velocityX = 0;
    let velocityY = 0;
    const speed = 200;
    
    if (wasd.A.isDown) velocityX = -speed;
    else if (wasd.D.isDown) velocityX = speed;
    
    if (wasd.W.isDown) velocityY = -speed;
    else if (wasd.S.isDown) velocityY = speed;
    
    player.setVelocity(velocityX, velocityY);
    
    // Randomize goblin movement occasionally
    goblins.children.entries.forEach(goblin => {
        if (Math.random() < 0.01) {
            goblin.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
        }
    });
}

function collectFood(player, food) {
    food.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Check if all food collected
    if (foods.countActive(true) === 0) {
        this.add.text(400, 300, 'YOU WIN!', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        this.physics.pause();
        gameOver = true;
    }
}

function hitGoblin(player, goblin) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

// Initialize game
const game = new Phaser.Game(config);