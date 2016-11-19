var width = 800;
var height = 600;
var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('kalkulator', 'assets/kalkulator.jpg');
    game.load.image('number0', 'assets/number0.jpg');
    game.load.image('number1', 'assets/number1.jpg');
    game.load.image('number2', 'assets/number2.jpg');
    game.load.image('number3', 'assets/number3.jpg');
    game.load.image('number4', 'assets/number4.jpg');
    game.load.image('number5', 'assets/number5.jpg');
    game.load.image('number6', 'assets/number6.jpg');
    game.load.image('number7', 'assets/number7.jpg');
    game.load.image('number8', 'assets/number8.jpg');
    game.load.image('number9', 'assets/number9.jpg');

}

var score = 0;
var scoreText;
var kalkulator;
var weapon;
var cursors;
var fireButton;
var pointBox;
var pointBoxTime = 0;

function create() {

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 60;

    
    kalkulator = this.add.sprite(320, 500, 'kalkulator');

    game.physics.arcade.enable(kalkulator);
    

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(kalkulator, 25, 0);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //  pointboxes

    pointBox = game.add.group();
    pointBox.setAll('outOfBoundsKill', true);

    //place score text on the screen
    scoreText = game.add.text(5, 3, score, {fill:"#fff"});
}

function update() {

    kalkulator.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        kalkulator.body.velocity.x = -400;
    }
    else if (cursors.right.isDown)
    {
        kalkulator.body.velocity.x = 400;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

    pointBox.forEachAlive(function(pointBoxObj){
        pointBoxObj.body.velocity.y = 3500*pointBoxObj.speed;
        game.physics.arcade.overlap(weapon, pointBoxObj, hitPoint);
    });

    if (game.time.now > pointBoxTime)
    {
        createRandomPointbox(pointBox);
        pointBoxTime = game.time.now + 2000;
    }

    // createRandomPointbox(pointBox);

    

}

function render() {

    // weapon.debug();

}


function createRandomPointbox(pointBoxGroup){
    // 0 - 9 arası bir rakam oluşturmalıyız
    var randomInteger = game.rnd.integerInRange(0, 9);
    var newPointBox = pointBoxGroup.create(width*Math.random(), -50, 'number'+randomInteger);
    newPointBox.value = randomInteger;
    newPointBox.speed = randomInteger/100;
    game.physics.arcade.enable(newPointBox);
}


function hitPoint(weapon, pointBox){
    score = score + pointBox.value;
    scoreText.text = score;
    console.log("asdasd");
    pointBox.kill();
}