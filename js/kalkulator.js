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
    game.load.image('bulletPlus', 'assets/bulletPlus.jpg');
    game.load.image('bulletMinus', 'assets/bulletMinus.jpg');
    game.load.image('bulletMultiple', 'assets/bulletMultiple.jpg');
    game.load.image('bulletDivide', 'assets/bulletDivide.jpg');
    game.load.image('weaponPlus', 'assets/weaponPlus.jpg');
    game.load.image('weaponMinus', 'assets/weaponMinus.jpg');
    game.load.image('weaponMultiple', 'assets/weaponMultiple.jpg');
    game.load.image('weaponDivide', 'assets/weaponDivide.jpg');

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
var weaponOne = {};
var weaponTwo = {};
var bulletTypes = [
    {id: 0, name: 'plus', sprite: 'bulletPlus', weaponSprite: 'weaponPlus'},
    {id: 1, name: 'minus', sprite: 'bulletMinus', weaponSprite: 'weaponMinus'},
    {id: 2, name: 'multiple', sprite: 'bulletMultiple', weaponSprite: 'weaponMultiple'},
    {id: 3, name: 'divide', sprite: 'bulletDivide', weaponSprite: 'weaponDivide'}
];

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

    assignRandomBulletToWeapon(weaponOne);
    assignRandomBulletToWeapon(weaponTwo);
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

    game.physics.arcade.overlap(bullet, pointBox, hitPoint);

    if (game.time.now > pointBoxTime)
    {
        createRandomPointbox(pointBox);
        pointBoxTime = game.time.now + 2000;
    }
}

function render() {

}


function createRandomPointbox(pointBoxGroup){
    // 0 - 9 arası bir rakam oluşturmalıyız
    var randomInteger = game.rnd.integerInRange(0, 9);
    var newPointBox = pointBoxGroup.create(game.rnd.integerInRange(0, width-50), -50, 'number'+randomInteger);
    newPointBox.value = randomInteger;
    newPointBox.speed = (randomInteger+1)/100;
    newPointBox.outOfBoundsKill = true;
    newPointBox.anchor.set(0.5);
    game.physics.enable(newPointBox, Phaser.Physics.ARCADE);
}

function fireBullet(){
    //  hesap makinesinin mevcut konumuna göre bir mermi üretip, yukarı doğru gitmesini sağlayacağız
    var newBullet = bullet.create(kalkulator.x+20, height-100, bulletTypes[weaponOne.bulletType].sprite);
    newBullet.operationType = bulletTypes[weaponOne.bulletType].name;
    game.physics.enable(newBullet, Phaser.Physics.ARCADE);
    assignRandomBulletToWeapon(weaponOne);
}


function hitPoint(bullet, pointBox){

    //Rastgele gelen işlemlere göre scrou hesaplamayı sorgulatıyoruz

    if(bullet.operationType=="plus"){
        score = score + pointBox.value;
    }else if(bullet.operationType=="minus"){
        score = score - pointBox.value;
    }else if(bullet.operationType=="divide"){
        score = score / pointBox.value;
    }else if(bullet.operationType=="multiple"){
        score = score * pointBox.value;
    }else {
        return 0;
    }

    scoreText.text = score;
    emitter.x = pointBox.x;
    emitter.y = pointBox.y;
    pointBox.kill();
    bullet.kill();
    emitter.start(true, 2000, null, 10);
}

function assignRandomBulletToWeapon(weapon){
    var randomBulletId = game.rnd.integerInRange(0, 3);
    weapon.bulletType = randomBulletId;
    // @todo: ilgili silahın görüntüsünü de hesap makinesinin yanına koymak lazım
}