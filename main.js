var Maingame = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Maingame() {
            Phaser.Scene.call(this, { key: 'maingame' });
            this.paddle;
            this.cursors;
            this.bricks;
            this.ball;
            this.score = 0;
            this.scoreText;
            this.scoreStatus = true;
            this.stage = 1;
            this.stageStatus = true;
            this.hitsound;
        },

    preload: function () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('brick', 'assets/brick.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('restart', 'assets/restart.png');
        this.load.image('mainmenu', 'assets/mainmenu.png');
        this.load.audio('hitsound', 'assets/hitsound.wav');
    },

    create: function () {
        this.add.image(400, 300, 'sky');
        this.hitsound = this.sound.add('hitsound');
        this.paddle = this.physics.add.sprite(400, 550, 'paddle');
        this.paddle.setCollideWorldBounds(true);
        this.paddle.body.immovable = true;
        this.paddle.body.allowGravity = false;
        this.bricks = this.add.group();
        var arr;

        if (this.stage === 1) {
            arr = [
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,1,0,0,1]
            ]
            for (var i = 0; i < 11; i++) {
                for (var j = 0; j < 5; j++) {
                    if (arr[j][i]) {
                        var brick = this.physics.add.sprite(100 + i * 60, 55 + j * 30, 'brick');
                        brick.setImmovable(true);
                        brick.body.allowGravity = false;
                        this.bricks.add(brick);
                    }
                }
            }
        }
        if (this.stage === 2) {
            arr = [
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,1,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,1]
            ]
            for (var i = 0; i < 11; i++) {
                for (var j = 0; j < 5; j++) {
                    if (arr[j][i]) {
                        var brick = this.physics.add.sprite(100 + i * 60, 55 + j * 30, 'brick');
                        brick.setImmovable(true);
                        brick.body.allowGravity = false;
                        this.bricks.add(brick);
                    }
                }
            }
        }
        if (this.stage === 3) {
            arr = [
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1]
            ]
            for (var i = 0; i < 11; i++) {
                for (var j = 0; j < 5; j++) {
                    if (arr[j][i]) {
                        var brick = this.physics.add.sprite(100 + i * 60, 55 + j * 30, 'brick');
                        brick.setImmovable(true);
                        brick.body.allowGravity = false;
                        this.bricks.add(brick);
                    }
                }
            }
        }

        this.ball = this.physics.add.sprite(400, 500, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setVelocity(-85, -305);
        this.ball.body.allowGravity = false;

        this.scoreText = this.add.text(15, 7, 'score: ' + this.score, { fontSize: '32px', fontFamily: 'fantasy', fill: '#000' });
        this.add.text(670, 7, 'stage: ' + this.stage, { fontSize: '32px', fontFamily: 'fantasy', fill: '#000' });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.ball, this.bricks, this.hitBricks, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    },

    update: function () {
        if (this.cursors.left.isDown) {
            this.paddle.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown) {
            this.paddle.setVelocityX(300);
        }
        else {
            this.paddle.setVelocityX(0);
        }
        if (this.ball.y > this.paddle.y && this.scoreStatus) {
            this.physics.pause();
            this.calculate_rank(this.score)
            this.scoreStatus = false;
            this.stageStatus = true;
            this.score = 0;
            this.stage = 1;
            this.add.image(400, 300, 'gameover');
            var restart = this.add.image(400, 500, 'restart');
            restart.setInteractive();
            restart.on('pointerdown', function () {
                this.registry.destroy();
                this.events.off();
                this.scene.restart();
                this.scoreStatus = true;
            }, this);
            var mainmenu = this.add.image(600, 510, 'mainmenu');
            mainmenu.setInteractive();
            mainmenu.on('pointerdown', function () {
                this.registry.destroy();
                this.events.off();
                this.scene.restart();
                this.scene.launch('menu');
                this.scoreStatus = true;
            }, this);
        }
        if (this.score === 200 && this.stageStatus) {
            this.stageStatus = false;
            this.stage++;
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
        }
        if (this.score === 520 && !this.stageStatus) {
            this.stageStatus = true;
            this.stage++;
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
        }
        if (this.score === 1070 && this.stageStatus) {
            this.registry.destroy();
            this.events.off();
            this.calculate_rank(this.score);
            this.scoreStatus = false;
            this.stageStatus = true;
            this.score = 0;
            this.stage = 1;
            this.scene.wake('clear');
            this.scene.launch('clear');
        }
    },


    hitBricks: function (ball, brick) {
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        brick.destroy(true);
    },

    hitPaddle: function (ball, paddle) {
        var dist = 0;
        this.hitsound.play();
        if (this.ball.x < this.paddle.x) {
            dist = this.paddle.x - this.ball.x;
            this.ball.setVelocityX(-10 * dist);
        }
        else if (this.ball.x > this.paddle.x) {
            dist = this.ball.x - this.paddle.x;
            this.ball.setVelocityX(10 * dist);
        }
        else {
            this.ball.setVelocityX(3 + Math.random() * 9);
        }
    },

    calculate_rank: function (score) {
        if (localStorage.getItem('1st') && score >= localStorage.getItem('1st')) {
            localStorage.setItem('3rd', localStorage.getItem('2nd'));
            localStorage.setItem('2nd', localStorage.getItem('1st'));
            localStorage.setItem('1st', score);
        }
        else if (localStorage.getItem('2nd') && score >= localStorage.getItem('2nd')) {
            localStorage.setItem('3rd', localStorage.getItem('2nd'));
            localStorage.setItem('2nd', score);
        }
        else if (localStorage.getItem('3rd') && score >= localStorage.getItem('3rd')) {
            localStorage.setItem('3rd', score);
        } else if (!localStorage.getItem('1st')) {
            localStorage.setItem('1st', score);
        } else if (!localStorage.getItem('2nd')) {
            localStorage.setItem('2nd', score);
        } else if (!localStorage.getItem('3rd')) {
            localStorage.setItem('3rd', score);
        }

    }
});

var Rank = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Rank() {
            Phaser.Scene.call(this, { key: 'rank' });
        },

    create: function () {
        this.add.image(400, 300, 'sky');
        var mainmenu = this.add.image(600, 510, 'mainmenu');
        this.add.text(40, 70, '★Score Rank★', { fontSize: '60px', fontFamily: 'Arial', fill: '#000' });
        this.add.text(110, 180, '1st score : ' + localStorage.getItem('1st'), { fontSize: '50px', fontFamily: 'fantasy', fill: '#000' });
        this.add.text(110, 260, '2nd score : ' + localStorage.getItem('2nd'), { fontSize: '50px', fontFamily: 'fantasy', fill: '#000' });
        this.add.text(110, 340, '3rd score : ' + localStorage.getItem('3rd'), { fontSize: '50px', fontFamily: 'fantasy', fill: '#000' });
        mainmenu.setInteractive();
        mainmenu.on('pointerdown', function () {
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
            this.scene.launch('menu');
        }, this);
    }
});

var Clear = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Rank() {
            Phaser.Scene.call(this, { key: 'clear' });
        },

    preload: function () {
        this.load.image('gameclear', 'assets/gameclear.png');
    },

    create: function () {
        this.add.image(400, 300, 'gameclear');
        var mainmenu = this.add.image(600, 510, 'mainmenu');
        mainmenu.setInteractive();
        mainmenu.on('pointerdown', function () {
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
            this.scene.launch('menu');
        }, this);
    }
});

var Menu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Menu() {
            Phaser.Scene.call(this, { key: 'menu', active: true });
            this.start;
            this.ranking;
        },

    preload: function () {
        this.load.image('start', 'assets/start.png');
        this.load.image('ranking', 'assets/ranking.png');
    },

    create: function () {
        this.add.image(400, 300, 'sky');
        this.scene.sleep('maingame');
        this.scene.sleep('rank');
        this.scene.sleep('clear');
        this.start = this.add.image(400, 200, 'start');
        this.start.setInteractive();
        this.start.on('pointerup', function (pointer) {
            this.start.visible = false;
            this.ranking.visible = false;
            this.scene.wake('maingame');
            this.scene.launch('maingame');
            this.scene.sleep();
        }, this);

        this.ranking = this.add.image(400, 400, 'ranking');
        this.ranking.setInteractive();

        this.ranking.on('pointerup', function (pointer) {
            this.start.visible = false;
            this.ranking.visible = false;
            this.scene.wake('rank');
            this.scene.launch('rank');
            this.scene.sleep();
        }, this);
    }
})

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Maingame, Menu, Rank, Clear]
};

var game = new Phaser.Game(config);