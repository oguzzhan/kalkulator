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
    game.load.image('particle', 'assets/particle.jpg');

}

var score = 0;
var scoreText;
var kalkulator;
var bullet;
var cursors;
var fireButton;
var fireTime = 0;
var pointBox;
var pointBoxTime = 0;
var emitter;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
    kalkulator = this.add.sprite(320, 500, 'kalkulator');
    game.physics.enable(kalkulator, Phaser.Physics.ARCADE);
    
    kalkulator.body.collideWorldBounds = true;

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //  pointboxes

    pointBox = game.add.group();
    game.physics.enable(pointBox, Phaser.Physics.ARCADE);

    bullet = game.add.group();
    game.physics.enable(bullet, Phaser.Physics.ARCADE);


    //place score text on the screen
    scoreText = game.add.text(5, 3, score, {fill:"#fff"});

    game.physics.arcade.overlap(bullet, pointBox, hitPoint);


    emitter = game.add.emitter(0, 0, 100);

    emitter.makeParticles('particle');
    emitter.gravity = 200;
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
        if (game.time.now > fireTime)
        {
            fireBullet();
            fireTime = game.time.now + 200;
        }
    }

    pointBox.forEachAlive(function(pointBoxObj){
        pointBoxObj.body.velocity.y = 3500*pointBoxObj.speed;
    });

    bullet.forEachAlive(function(bulletObj){
        bulletObj.body.velocity.y = -500;
    });

    // pointBox.forEachAlive(function(pointBoxObj){
    //     bullet.forEachAlive(function(bulletObj){
    //         game.physics.arcade.overlap(bulletObj, pointBoxObj, hitPoint);
    //     });
    // });

    game.physics.arcade.overlap(bullet, pointBox, hitPoint);

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
    newPointBox.speed = (randomInteger+1)/100;
    newPointBox.outOfBoundsKill = true;
    newPointBox.anchor.set(0.5);
    game.physics.enable(newPointBox, Phaser.Physics.ARCADE);
}

function fireBullet(){
    //  hesap makinesinin mevcut konumuna göre bir mermi üretip, yukarı doğru gitmesini sağlayacağız
    var newBullet = bullet.create(kalkulator.x+20, height-100, 'bullet');
    game.physics.enable(newBullet, Phaser.Physics.ARCADE);

}


function hitPoint(bullet, pointBox){
    console.log("asdasd");
    score = score + pointBox.value;
    scoreText.text = score;
    console.log("asdasd");
    emitter.x = pointBox.x;
    emitter.y = pointBox.y;
    pointBox.kill();
    bullet.kill();
    emitter.start(true, 2000, null, 10);
}