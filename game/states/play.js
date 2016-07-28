
  'use strict';
  function Play() {
    this.init();
    this.tileSize = 107;
    this.tileSprites;
    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;
    this.backgroundColor = '57407c';
    this.font = "flappyfont";
    this.scoreString = "SCORE \n";
  }
  Play.prototype = {
    preload: function() {
      
    },
    create: function() {
      
      // background color
      this.game.stage.backgroundColor  = this.backgroundColor;

      // add text      
      this.scoreText = this.game.add.bitmapText(this.game.width*3/4,60,"flappyfont",this.scoreString + this.score.toString(),24);
      this.scoreText.align = 'center';
      this.scoreText.anchor.setTo(0.5,0.5);

      // declare group of tiles
      var tileSize = window.innerWidth/4;
      this.tileSprites = this.game.add.group();
      this.tileSprites.align(4,4,tileSize,tileSize, Phaser.CENTER);

      this.tileSprites.x = 0;
      this.tileSprites.y = 120;

      this.addTwo();
      this.addTwo();

      // audio added
      this.scoreSound = this.game.add.audio('score');

      this.replayButton = this.game.add.button(this.game.width*1/4,60,'replayButton', this.newGame, this);
      this.replayButton.anchor.setTo(0.5,0.5);
    },
    update: function() {
      
      // listeners for WASD keys
      this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.upKey.onDown.add(this.moveUp,this);

      this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
      this.downKey.onDown.add(this.moveDown,this);

      this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.leftKey.onDown.add(this.moveLeft,this);

      this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.rightKey.onDown.add(this.moveRight,this);
    },
    init: function() {
      this.fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
      this.score= 0;
      this.canMove  = false;
    },
    newGame: function() {
      this.init();
      this.game.state.start('play');
    },

    victory: function() {

      this.tileSprites.destroy();

      this.won = this.game.add.sprite(0,120,'2048');
      this.won.animations.add('victory');
      this.won.animations.play('victory',24,true);
      this.won.scale.setTo(428/500,428/500);

    },
    gameOver: function() {
      this.canMove = false;
      this.tileSprites.destroy();
      
      this.lost = this.game.add.sprite(0,120,'gameover');
      this.lost.animations.add('gameover');
      this.lost.animations.play('gameover',24,true);
      this.lost.scale.setTo(428/500,428/500);

      console.log("Game Over");
      
    },
    moveUp: function() {
      var self = this;
      if (self.canMove) {

        self.canMove  = false;
        var moved     = false;

        self.tileSprites.sort("y",Phaser.Group.SORT_ASCENDING);
        self.tileSprites.forEach(function(item) {
          var row = self.toRow(item.pos);
          var col = self.toCol(item.pos);

          if(row>0){  
            var remove=false;
            for(var i=row-1;i>=0;i--){
              if(self.fieldArray[i*4+col]!=0){
                if(self.fieldArray[i*4+col]== self.fieldArray[row*4+col]){
                  remove = true;
                  i--;                                             
                }
                break
              }
            }
            if(row!=i+1){
             moved=true;
             self.moveTile(item,row*4+col,(i+1)*4+col,remove);
           }
         }


        })

        self.endMove(moved);
      }
    },
    moveDown: function() {
      var self = this;
      if (self.canMove) {
        self.canMove = false;
        var moved        = false;

        self.tileSprites.sort("y", Phaser.Group.SORT_DESCENDING);
        self.tileSprites.forEach(function(item) {
          var row = self.toRow(item.pos);
          var col = self.toCol(item.pos);

          if (row < 3) {
            var remove = false;
            for (var i = row+1; i <=3; i++) {
              if (self.fieldArray[i*4+col]!= 0) {
                if (self.fieldArray[i*4+col] == self.fieldArray[row*4+col]) {
                  remove = true;
                  i++;
                }
                break;
              }
            }
            if (row != i-1) {
              moved = true;
              self.moveTile(item, row*4+col,(i-1)*4+col,remove);
            }
          }
        })
        self.endMove(moved);
      }
    },
    moveLeft: function() {
      var self = this;
      if (self.canMove) {
        self.canMove = false;
        var moved    = false;

        self.tileSprites.sort("x", Phaser.Group.SORT_ASCENDING);
        self.tileSprites.forEach(function(item) {
          var row = self.toRow(item.pos);
          var col = self.toCol(item.pos);

          if (col > 0) {
            var remove = false;
            for(var i = col-1; i >= 0; i--) {
              if (self.fieldArray[row*4+i]!= 0) {
                if (self.fieldArray[row*4+i] == self.fieldArray[row*4+col] ) {
                  remove = true;
                  i--;
                }
                break;
              }
            }
            if (col != i + 1) {
              moved = true;
              self.moveTile(item,row*4+col,row*4+i+1,remove);
            }
          }
        })
        self.endMove(moved);
      }
    },
    moveRight: function() {
      var self = this;
      if (self.canMove) {
        self.canMove = false;
        var moved = false;

        self.tileSprites.sort("x",Phaser.Group.SORT_DESCENDING);
        self.tileSprites.forEach(function(item) {
          var row = self.toRow(item.pos);
          var col = self.toCol(item.pos);

          if (col < 3) {
            var remove = false;
            for (var i = col + 1; i <=3; i++) {
              if (self.fieldArray[row*4+i] != 0) {
                if (self.fieldArray[row*4+i] == self.fieldArray[row*4+col]) {
                  remove = true;
                  i++;
                }
                break;
              }
            }
            if (col != i-1) {
              moved = true;
              self.moveTile(item,row*4+col,row*4+i-1,remove);
            }
          }
        })
        self.endMove(moved);
      }
    },

    addTwo: function() {
      console.log(this.fieldArray)
      do {
        var randomValue = Math.floor(Math.random()*16);
      } while(this.fieldArray[randomValue] != 0)

      var number = [2,4];

      this.fieldArray[randomValue] = number[this.game.rnd.integerInRange(0,1)];

      var tileSize = this.tileSize;
      var scale  = (this.world.width/4/this.tileSize);
      var tile   = this.add.sprite(this.toCol(randomValue)*tileSize,this.toRow(randomValue)*tileSize,'tile');
      
      tile.pos   = randomValue;
      tile.alpha = 0;
      tile.frame = 624;
      tile.scale.setTo(1,1);

      var two         = this.createTileList(1,39);
      var four        = this.createTileList(40,79);
      var eight       = this.createTileList(120,68);
      var sixteen     = this.createTileList(189,29);
      var thirtytwo   = this.createTileList(219,62);
      var sixtyfour   = this.createTileList(282,74);
      var onetwoeight = this.createTileList(357,88);
      var twofivesix  = this.createTileList(446,59);
      var fiveonetwo  = this.createTileList(506,25);
      var onethousand = this.createTileList(532,92);

      tile.animations.add('two',two,24,true);
      tile.animations.add('four',four,24,true);
      tile.animations.add('eight',eight,24,true);
      tile.animations.add('sixteen',sixteen,15,true);
      tile.animations.add('thirtytwo',thirtytwo,24,true);
      tile.animations.add('sixtyfour',sixtyfour,24,true);
      tile.animations.add('onetwoeight',onetwoeight,24,true);
      tile.animations.add('twofivesix',twofivesix,24,true);
      tile.animations.add('fiveonetwo',fiveonetwo,15,true);
      tile.animations.add('onethousand',onethousand,24,true);
      
      this.tileSprites.add(tile);

      var fadeIn = this.add.tween(tile);
      var self   = this;
      fadeIn.to({alpha:1},250);

      fadeIn.onComplete.add(function(){
        self.updateNumbers();
        self.canMove = true;
      });
      fadeIn.start();

      console.log(self.tileAvailable())
      if (!self.tileAvailable()) {
        if (!self.tileMatchesAvailable()) self.gameOver();
      }

    },
    toRow: function(n) {
      return Math.floor(n/4);
    },
    toCol: function(n) {
      return n%4;
    },
    createTileList: function(start,number) {
      var tileArr = [];
      for (var i = 0; i < number; i++) {
        tileArr.push(start+i);
      }

      return tileArr;
    },
    // FUNCTION TO COMPLETE THE MOVE AND PLACE ANOTHER "2" IF WE CAN
    endMove: function(m){
      // if we move the tile...
      if(m){
        // add another "2"
        this.addTwo();
      } else{
        // otherwise just let the player be able to move again
        this.canMove=true;
      }
    },
    tileAvailable: function() {
      var self = this;
      var avai = false;

      self.fieldArray.forEach(function(item) {
        if (item == 0) {
          avai = true;
          return avai;
        }
      })

      return avai;
    },

    tileMatchesAvailable: function() {

      var self = this;
      var size = self.fieldArray.length;
      var tilePerRow = 4;
      var left, right, top, bottom;
      var checkPos = [-1,1,-4,4];
      var match    = true;

      for (var i = 0; i < size; i++) {
        for (var j = 0; j < checkPos.length; j++) {
          var pos = checkPos[j] +  i;
          if ( pos > 0 ) {
            
            if ((self.fieldArray[i] == self.fieldArray[pos])) {
              match = false;
              return;
            } 
            
          }
        }
      }

      console.log(match);
      return match;
    },

    moveTile: function(tile,from, to, remove) {
      var self = this;

      // update position
      self.fieldArray[to]   = self.fieldArray[from];
      self.fieldArray[from] = 0;

      tile.pos = to;
      var movement = self.add.tween(tile);
      movement.to({x:self.tileSize*(self.toCol(to)),y:self.tileSize*(self.toRow(to))},150);
      if (remove) {
        self.fieldArray[to]*=2;

        movement.onComplete.add(function(){
          tile.destroy();
          self.checkScore(self.fieldArray[to]);
        });
      }

      movement.start();
    },
    checkScore: function(score) {
      this.score = this.score + score;
      this.scoreText.setText(this.scoreString + this.score.toString());
      this.scoreSound.play();
    },
    updateNumbers: function() {
      var self = this;

      self.tileSprites.forEach(function(item) {
        var value = self.fieldArray[item.pos];

        if (value == 2048) {
          self.victory();
          return;
        }

        switch(value) {
          case 4:
            item.play('four');
            break;
          case 8:
            item.play('eight');
            break;

          case 16:
            item.play('sixteen');
            break;

          case 32:
            item.play('thirtytwo');
            break;

          case 64:
            item.play('sixtyfour');
            break;

          case 128:
            item.play('onetwoeight');
            break;

          case 256:
            item.play('twofivesix');
            break;

          case 512:
            item.play('fiveonetwo');
            break;

          case 1024:
            item.play('onethousand');
            break;

          default:
            item.play('two');
            break;
        }
        //item.text = value;
      })
    }
  };
  
  module.exports = Play;