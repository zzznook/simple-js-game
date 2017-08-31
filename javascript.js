// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};

// GAME FRAMEWORK STARTS HERE
    var GF = function(){
    // vars relative to the canvas
    var canvas, ctx, w, h;


		var assetsToLoadURLs = {

    gameBackground: { url: 'https://dl.dropboxusercontent.com/u/24936377/gameBackground.png' },
    mainMenu: { url: 'https://dl.dropboxusercontent.com/u/24936377/mainMenu.png' },
    gameOver: { url: 'https://dl.dropboxusercontent.com/u/24936377/gameOver.png'},
	  nomSound: { url: 'https://dl.dropboxusercontent.com/u/24936377/nom.wav', buffer: false, loop: false, volume: 1.0 },
		batSound: { url: 'https://dl.dropboxusercontent.com/u/24936377/batsound.wav', buffer: false, loop: false, volume: 0.1 },
		noMercy: { url: 'https://dl.dropboxusercontent.com/u/24936377/noMercy.mp3', buffer: false, loop: false, volume: 0.5 },
    humbug: { url: 'https://dl.dropboxusercontent.com/u/24936377/caveTheme.mp3', buffer: true, loop: true, volume: 1.0 },
    };

    // Assets variable holds the assets once loaded
    var assets = {};



    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;

		// vars for time based animation
    var delta, oldTime = 0;

    // vars for handling inputs
    var inputStates = {};

		// game states
    var gameStates = {
        mainMenu: 0,
        gameRunning: 1,
        gameOver: 2
    };
    var currentGameState = gameStates.mainMenu;
    var currentLevel = 1;
		var nomSound;

    // var the monster
    var monster = {
			life:3,
			health:30,
			maxHealth:30,
			x:100,
      y:300,
      speed:300,
			angle:0,
			mh:90,
			mih:100,
			mspeed:6,
			mispeed:4.8,
			radius:40
    };

    // array of flies to animate
    var flyArray = [];
		var nbFlies = 5;
		var currentScore = 0;
		var batArray = [];
	  var nbBats = 1;
		var nbFliesRemain = nbFlies; // number of healthy bats remaining alive

		// Calculating Distance to move in order to convert pxs/ frame into pxs/sec

		var calcDistanceToMove = function(delta, speed) {
    return (speed * delta) / 1000;
  };
		// Measure FPS
    var measureFPS = function(newTime){

         // test for the very first invocation
         if(lastTime === undefined) {
           lastTime = newTime;
           return;
         }

        //calculate the difference between last & current frame
      var diffTime = newTime - lastTime;

      if (diffTime >= 1000) {
          fps = frameCount;
          frameCount = 0;
          lastTime = newTime;
      }

        //and display it in an element we appended to the
        // document in the start() function
       fpsContainer.innerHTML = 'FPS: ' + fps;
       frameCount++;
     };

     // clears the canvas content for animation
function clearCanvas() {
       ctx.clearRect(0, 0, w, h);
     }

     // Functions for drawing the monster, background and bats
		 // Draw background
function drawBackground(){
     background = ctx.createPattern(assets.gameBackground, "");
     ctx.fillStyle = background;
     ctx.fillRect(0, 0, canvas.width, canvas.height);
         }

function drawMainMenu(){
     background = ctx.createPattern(assets.mainMenu, "");
     ctx.fillStyle = background;
     ctx.fillRect(0, 0, canvas.width, canvas.height);
         }

function drawGameOver(){
     background = ctx.createPattern(assets.gameOver, "");
     ctx.fillStyle = background;
     ctx.fillRect(0, 0, canvas.width, canvas.height);
         }

function drawKeys (){
			ctx.save();
			ctx.moveTo(715, 372);
			ctx.lineTo(775, 372);
			ctx.lineTo(775, 395);
			ctx.lineTo(835, 395);
			ctx.lineTo(835, 425);
			ctx.lineTo(775, 425);
			ctx.lineTo(775, 445);
			ctx.lineTo(715, 445);
			ctx.lineTo(715, 425);
			ctx.lineTo(655, 425);
			ctx.lineTo(655, 395);
			ctx.lineTo(715, 395);
			ctx.lineTo(715, 372);
			ctx.fillStyle="rgba(255, 255, 255, 0.1)";
		  ctx.fill();
			ctx.restore();
	 	 }

function drawMyMonster(x, y, angle, mh, mih) {

		 var radius = 60;

		 // Good practice: save context and restore it at the end!!!
     ctx.save();

     // Moves the coordinate system so that the monster is drawn at position (x, y)
     ctx.translate(x, y);
     ctx.rotate(angle);
		 ctx.translate(-100, -100);

		 // gradient 1
		 grd1 = ctx.createLinearGradient(20, 0, 0, 400);
		 grd1.addColorStop(0, "#909090");
     grd1.addColorStop(1, "#101010");

     // head
     ctx.beginPath();
		 ctx.arc(100, 100, radius, 0, 2*Math.PI, false);
		 ctx.fillStyle = grd1;
		 ctx.fill();

		 // 2 antennas
     ctx.beginPath();
		 ctx.arc(35, 45, 5, 0, 2*Math.PI, false);
		 ctx.arc(165, 45, 5, 0, 2*Math.PI, false);
		 ctx.fillStyle = 'black';
		 ctx.fill();

		 ctx.beginPath();
		 ctx.moveTo(35, 45);
		 ctx.quadraticCurveTo(50, 25, 75, 48);
		 ctx.lineWidth = 5;
		 ctx.strokeStyle='black';
		 ctx.stroke();

		 ctx.beginPath();
		 ctx.moveTo(165, 45);
		 ctx.quadraticCurveTo(150, 25, 125, 48);
		 ctx.lineWidth = 5;
		 ctx.strokeStyle='black';
		 ctx.stroke();

		 // undereyes
		 ctx.beginPath();
		 ctx.arc(77, 73, 20, 0, 2*Math.PI, false);
		 ctx.arc(133, 76, 15, 0, 2*Math.PI, false);
		 ctx.fillStyle='darkred';
		 ctx.fill();

     // eyes
     ctx.beginPath();
		 ctx.arc(81, 73, 15, 0, 2*Math.PI, false);
     ctx.arc(129, 75, 9, 0, 2*Math.PI, false);
		 ctx.fillStyle='red';
     ctx.fill();

     // interior of eye
     ctx.beginPath();
		 ctx.arc(75, 66, 5, 0, 2*Math.PI, false);
     ctx.arc(125, 71, 4, 0, 2*Math.PI, false);
		 ctx.fillStyle='white';
     ctx.fill();

		 // draw mouth
     ctx.beginPath();
     ctx.moveTo(63,142);
		 ctx.quadraticCurveTo(100, mh, 140, 142);
	   ctx.fillStyle="#505050";
		 ctx.fill();

		 // gradient2
		 grd2 = ctx.createLinearGradient(50, 120, 50, 160);
		 grd2.addColorStop(0, "#303030");
     grd2.addColorStop(1, "black");

		 // Mouth inside - variable for inner mouth height
		 ctx.beginPath();
     ctx.moveTo(68,142);
		 ctx.quadraticCurveTo(100, mih, 135, 142);
	   ctx.fillStyle=grd2;
		 ctx.fill();

		 // gradient 3
	   grd3 = ctx.createLinearGradient(50, 120, 50, 160);
		 grd3.addColorStop(0, "white");
     grd3.addColorStop(1, "#909090");

		 // Left tusk
		 ctx.beginPath();
		 ctx.moveTo(75,142);
		 ctx.quadraticCurveTo(65, 135, 75, 120);
		 ctx.quadraticCurveTo(75, 132, 85, 142);
		 ctx.fillStyle=grd3;
		 ctx.fill();

		 // Right tusk
		 ctx.beginPath();
		 ctx.moveTo(120,142);
		 ctx.quadraticCurveTo(130, 132, 130, 120);
		 ctx.quadraticCurveTo(140, 135, 130, 142);
		 ctx.fillStyle=grd3;
		 ctx.fill();

     // GOOD PRACTICE !
     ctx.restore();
   }

function timer(currentTime) {
       var delta = currentTime - oldTime;
       oldTime = currentTime;
       return delta;
  }

var mainLoop = function(time){
        //main function, called each frame
        measureFPS(time);

			  // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

				if (monster.life <= 0) {
            currentGameState = gameStates.gameOver;
        }

	      switch (currentGameState) {
				case gameStates.gameRunning:

	          //draw background
						drawBackground();

						//draw keys
	          drawKeys();

        		// draw the monster
        		drawMyMonster(monster.x, monster.y, monster.angle, monster.mh, monster.mih);

        		// check inputs and move the monster
        		updateMonsterPosition(delta);

			 		  // draws and animates flies
			  		updateFlies(delta);

	      		// update sick bats
			  		updateBats(delta);

	      		//display stats
			  		displayStats();

			  if (nbFliesRemain <= 0) {
                   goToNextLevel();
                }
						break;

			 case gameStates.mainMenu:

						    drawMainMenu();
						    mainMenuText();

                if (inputStates.n) {
                    startNewGame();
								}

                break;
       case gameStates.gameOver:

						    drawGameOver();
						    gameOverText();
						    assets.humbug.stop();

                if (inputStates.n) {
                    startNewGame();
                }
            break;
				}

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

function gameOverText(){

	        ctx.save();
	        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
	        ctx.fillRect(120, 300, 640, 100);
	        ctx.restore();

	        ctx.save();
          ctx.fillStyle = 'rgba(143, 8, 0, 1)';
	        ctx.font = '20px Calibri';
					ctx.fillText("Your score is " + currentScore + " yummy bats", 320, 330);
	        ctx.fillText("However Mssr. Monsteigneur is sick now because of those infected bats", 150, 360);
          ctx.fillText("Press N if you want him to recover from sickness", 240, 380);
					ctx.restore();

}

function mainMenuText(){
      ctx.save();
	    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	    ctx.fillRect(655, 180, 178, 252);
	    ctx.restore();

	    ctx.save();
      ctx.fillStyle = 'rgba(143, 8, 0, 1)';
	    ctx.font = '16px Calibri';
      ctx.fillText("Help Monsieur", 660, 195);
	    ctx.fillText("Monsteigneur to get", 660, 215);
	    ctx.fillText("rid of annoying bats", 660, 235);
	    ctx.fillText("in his cave. But be", 660, 255);
	    ctx.fillText("aware of infected bats.", 660, 275);
	    ctx.fillText("Move him around with", 660, 320);
	    ctx.fillText("arrow keys, rotate with", 660, 340);
	    ctx.fillText("space bar, press B +", 660, 360);
	    ctx.fillText("space bar for Beast mode", 660, 380);
	    ctx.fillText("Press N to start the battle", 660, 425);
      ctx.restore();
}

function startNewGame() {
        currentGameState = gameStates.gameRunning;
	      monster.dead = false;
	      monster.x = 100;
	      monster.y = 300;
	      monster.angle = 0;
	      monster.life = 3;
	      monster.health = monster.maxHealth;
        currentLevel = 1;
	      currentScore = 0;
        nbFlies = 5;
        createFlies(nbFlies);
	      nbBats = 1;
	      createBats(nbBats);
	      assets.noMercy.play();
	      assets.humbug.play();
    }

function goToNextLevel() {
        currentGameState = gameStates.gameRunning;
    }

//function to display statistics of game
function displayStats() {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText("Life: " + monster.life, 20, 415);
      ctx.restore();

	    ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText("Health: " + monster.health, 20, 440);
      ctx.restore();

	    ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText("Level: " + currentLevel, 220, 415);
      ctx.restore();

	    ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText("Score: " + currentScore, 220, 440);
      ctx.restore();
    }


// mouth animation
function animateMouth (){
			monster.mh = monster.mh + monster.mspeed;
			if ((monster.mh < 90) || (monster.mh >= 140))
			monster.mspeed = -monster.mspeed;


			monster.mih = monster.mih + monster.mispeed;
			if ((monster.mih < 100) || (monster.mih >= 140))
			monster.mispeed = -monster.mispeed;
		}

		// this function checks inputs and moves the monster
function updateMonsterPosition(delta) {

			monster.speedX = monster.speedY = 0;
        // check inputStates
        if (inputStates.left) {
					  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					  ctx.fillText("left", 670, 415);
            monster.speedX = -monster.speed;
            animateMouth();
        }
        if (inputStates.up) {
					  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					  ctx.fillText("up", 734, 390);
            monster.speedY = -monster.speed;
					  animateMouth();
        }
       if (inputStates.right) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
				    ctx.fillText("right", 785, 415);
            monster.speedX = monster.speed;
				    animateMouth();
        }
        if (inputStates.down) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					  ctx.fillText("down", 721, 440);
            monster.speedY = monster.speed;
					  animateMouth();
        }
        if (inputStates.space) {
           ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					 ctx.fillText("rotate", 720, 415);
					 monster.angle = monster.angle + 0.15;
					 animateMouth();
        }

       if (inputStates.b && inputStates.space) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
				    ctx.fillText("Beast mode", 410, 440);
            monster.speed = 800;
				    monster.angle = monster.angle + 0.5;
				    animateMouth();


        } else {
          // normal mode
          monster.speed = 300;
					ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					ctx.fillText("Normal mode", 410, 440);
        }

        // Compute the incX and inY in pixels depending
        // on the time elasped since the last redraw
        monster.x = monster.x + calcDistanceToMove(delta, monster.speedX);
        monster.y = monster.y + calcDistanceToMove(delta, monster.speedY);

			// Block the monster in the cave

			if((monster.x-monster.radius) <= 0) {
          monster.x = monster.radius;
            }

			if ((monster.x+monster.radius) > w) {
				  monster.x = w-monster.radius;
			}

			if((monster.y-monster.radius) <= 0) {
          monster.y = monster.radius;
            }

			if ((monster.y+monster.radius) > (h - 120)) {
			   	monster.y = h-monster.radius-120;
			}

    }

// draws flies, checks collision and animates them

function updateFlies(delta) {
     // for each normal bat in the array

	   var allFlyDead = true; //----

		 for(var i=0; i < flyArray.length; i++) {
      var fly = flyArray[i];

			if (fly.dead) continue;

			allFlyDead = false; //----

      // 1) move the fly
      fly.move();

      // 2) test if the fly collides with a wall
      testCollisionWithWalls(fly);

			// 3) test collision with monster

			if (testCollisionWithMonster(monster.x, monster.y,
                          monster.radius,
                          fly.x, fly.y, fly.radius)) {

        //change the color of the bat
        fly.color = "darkred";
			  fly.dead = true;
				assets.nomSound.play();
				currentScore+= 1;
				nbFliesRemain-=1;
      }

      // 4) draw the fly
      fly.draw();
     }

	if(allFlyDead) {

     nbFlies++;
     createFlies(nbFlies);
		 currentLevel++;

	   }

 }

 function updateBats(delta) {
      // for each bat in the array


	 for(var i=0; i < batArray.length; i++) {
      var bat = batArray[i];

      // 1) move the ball
      bat.move();

      // 2) test if the ball collides with a wall
      testBatCollisionWithWalls(bat);

      // Test if the monster collides
      if(testBatCollisionWithMonster(monster.x, monster.y, monster.radius, bat.x, bat.y, bat.radius)) {

        //change the color of the ball
        bat.color = 'darkred';


				if(!bat.hit) {
				    monster.health -= 1;
					  bat.hit = true;
					  assets.batSound.play();

					  if (monster.health <= 0){
							monster.life -= 1;
							monster.health = monster.maxHealth;

						}

					} else {
						bat.hit = false;
					}
      }

      // 3) draw the ball
      bat.draw();
  }

}


      // Collisions between monster and bat
function testCollisionWithMonster(mx, my, mr, fx, fy, fr) {
        var dx = fx - mx;
  			var dy = fy - my;
  			return ((dx * dx + dy * dy) < (mr + fr)*(mr+fr));
      }

function testBatCollisionWithMonster(mx, my, mr, bx, by, br) {
        var dx = bx - mx;
  			var dy = by - my;
  			return ((dx * dx + dy * dy) < (mr + br)*(mr+br));
      }

function testCollisionWithWalls(fly) {
      // left
      if (fly.x < fly.radius) {
          fly.x = fly.radius;
          fly.angle = -fly.angle + Math.PI;
        }
      // right
      if (fly.x > w - (fly.radius)) {
          fly.x = w - (fly.radius);
          fly.angle = -fly.angle + Math.PI;
        }
      // up
      if (fly.y < fly.radius) {
          fly.y = fly.radius;
          fly.angle = -fly.angle;
        }
      // down
      if (fly.y > (h - 80) - (fly.radius)) {
          fly.y = h - 80 - (fly.radius);
          fly.angle =-fly.angle;
        }
      }

function testBatCollisionWithWalls(bat) {
      // left
      if (bat.x < bat.radius) {
          bat.x = bat.radius;
          bat.angle = -bat.angle + Math.PI;
        }
      // right
      if (bat.x > w - (bat.radius)) {
          bat.x = w - (bat.radius);
          bat.angle = -bat.angle + Math.PI;
        }
      // up
      if (bat.y < bat.radius) {
          bat.y = bat.radius;
          bat.angle = -bat.angle;
        }
      // down
      if (bat.y > (h - 80) - (bat.radius)) {
          bat.y = h - 80 - (bat.radius);
          bat.angle =-bat.angle;
        }
      }
// this finction create normal eatable bats
function createFlies(numberOfFlies) {
      for(var i=0; i < numberOfFlies; i++) {
        // Create a bat with random position and speed.
        // You can change the radius
      var fly =  new Fly(w*Math.random(), h*Math.random(),
                          (2*Math.PI)*Math.random(),
                          (400*Math.random()),
                          20);
				// Do not create bats on monster
        if (!testCollisionWithMonster(monster.x, monster.y, monster.radius, fly.x, fly.y, fly.radius)) {
        flyArray[i] = fly;
        } else {
          i--;
          }
        }
			}
// this finction create non-eatable sick bats
function createBats(numberOfBats) {
      for(var i=0; i < numberOfBats; i++) {
        // Create a bat with random position and speed.
        // You can change the radius
      var bat =  new Bat(w*Math.random(), h*Math.random(),
                          (2*Math.PI)*Math.random(),
                          (400*Math.random()),
                          20);
				// Do not create bats on monster
        if (!testBatCollisionWithMonster(monster.x, monster.y, monster.radius, bat.x, bat.y, bat.radius)) {
        batArray[i] = bat;
        } else {
          i--;
          }
        }
			}

      // constructor function for flies
function Fly(x, y, angle, v, radius) {
  		this.x = x;
  		this.y = y;
  		this.angle = angle;
  		this.v = v;
  		this.radius = radius;
			this.color = "#303030";

 			this.draw = function() {

		  ctx.save();
		  // body
		  ctx.beginPath();
		  ctx.moveTo(this.x,this.y);
		  ctx.quadraticCurveTo(this.x+25, this.y-75, this.x+50, this.y);
		  ctx.quadraticCurveTo(this.x+30, this.y, this.x+25, this.y+25);
		  ctx.quadraticCurveTo(this.x+20, this.y, this.x, this.y);
	    ctx.fillStyle = this.color;
      ctx.fill();

		  // left wings
		  ctx.beginPath();
		  ctx.moveTo(this.x, this.y);
		  ctx.quadraticCurveTo(this.x, this.y-20, this.x-15, this.y-30);
		  ctx.quadraticCurveTo(this.x, this.y-50, this.x-30, this.y-60);
		  ctx.quadraticCurveTo(this.x+15, this.y-50, this.x+10, this.y-15);
		  ctx.fillStyle = this.color;
		  ctx.fill();

		  // right wing
		  ctx.beginPath();
		  ctx.moveTo(this.x+50,this.y);
		  ctx.quadraticCurveTo(this.x+50, this.y-20, this.x+65, this.y-30);
		  ctx.quadraticCurveTo(this.x+50, this.y-50, this.x+80, this.y-60);
		  ctx.quadraticCurveTo(this.x+35, this.y-50, this.x+40, this.y-15);
		  ctx.fillStyle = this.color;
		  ctx.fill();

		  // eyes
		  ctx.beginPath();
		  ctx.arc(this.x+17, this.y-25, 3, 0, 2*Math.PI, false);
		  ctx.arc(this.x+31, this.y-25, 4, 0, 2*Math.PI, false);
		  ctx.fillStyle="white";
		  ctx.fill();

		  ctx.restore();
			this.color = "#303030";
	    };

      this.move = function() {
      // add horizontal increment to the x pos
      // add vertical increment to the y pos

      var incX = this.v * Math.cos(this.angle);
      var incY = this.v * Math.sin(this.angle);

      this.x += calcDistanceToMove(delta, incX);
      this.y += calcDistanceToMove(delta, incY);
        };
      }
// constructor function for sick bats
function Bat(x, y, angle, v, radius) {
  		this.x = x;
  		this.y = y;
  		this.angle = angle;
  		this.v = v;
  		this.radius = radius;
			this.color = "#353535";
	    this.hit = false;

 			this.draw = function() {

		  ctx.save();
		  // body
		  ctx.beginPath();
		  ctx.moveTo(this.x,this.y);
		  ctx.quadraticCurveTo(this.x+25, this.y-75, this.x+50, this.y);
		  ctx.quadraticCurveTo(this.x+30, this.y, this.x+25, this.y+25);
		  ctx.quadraticCurveTo(this.x+20, this.y, this.x, this.y);
	    ctx.fillStyle = this.color;
      ctx.fill();

		  // left wings
		  ctx.beginPath();
		  ctx.moveTo(this.x, this.y);
		  ctx.quadraticCurveTo(this.x, this.y-20, this.x-15, this.y-30);
		  ctx.quadraticCurveTo(this.x, this.y-50, this.x-30, this.y-60);
		  ctx.quadraticCurveTo(this.x+15, this.y-50, this.x+10, this.y-15);
		  ctx.fillStyle = this.color;
		  ctx.fill();

		  // right wing
		  ctx.beginPath();
		  ctx.moveTo(this.x+50,this.y);
		  ctx.quadraticCurveTo(this.x+50, this.y-20, this.x+65, this.y-30);
		  ctx.quadraticCurveTo(this.x+50, this.y-50, this.x+80, this.y-60);
		  ctx.quadraticCurveTo(this.x+35, this.y-50, this.x+40, this.y-15);
		  ctx.fillStyle = this.color;
		  ctx.fill();

		  // eyes
		  ctx.beginPath();
		  ctx.arc(this.x+17, this.y-25, 3, 0, 2*Math.PI, false);
		  ctx.arc(this.x+31, this.y-25, 4, 0, 2*Math.PI, false);
		  ctx.fillStyle="white";
		  ctx.fill();

			// sickness
			ctx.beginPath();
		  ctx.arc(this.x+1, this.y-25, 3, 0, 2*Math.PI, false);
		  ctx.arc(this.x+10, this.y-15, 2, 0, 2*Math.PI, false);
		  ctx.fillStyle="red";
		  ctx.fill();
			ctx.beginPath();
			ctx.arc(this.x+40, this.y-5, 2, 0, 2*Math.PI, false);
			ctx.arc(this.x+45, this.y-15, 4, 0, 2*Math.PI, false);
			ctx.fillStyle="red";
		  ctx.fill();
			ctx.beginPath();
			ctx.arc(this.x+50, this.y-35, 2, 0, 2*Math.PI, false);
			ctx.arc(this.x+25, this.y-5, 4, 0, 2*Math.PI, false);
			ctx.fillStyle="red";
		  ctx.fill();

		  ctx.restore();
	    this.color = "#353535";
			};

      this.move = function() {
      // add horizontal increment to the x pos
      // add vertical increment to the y pos

      var incX = this.v * Math.cos(this.angle);
      var incY = this.v * Math.sin(this.angle);

      this.x += calcDistanceToMove(delta, incX);
      this.y += calcDistanceToMove(delta, incY);
        };
      }



var start = function(){

			// adds a div for displaying the fps value
      fpsContainer = document.createElement('div');
      document.body.appendChild(fpsContainer);

      // Canvas, context etc.
      canvas = document.querySelector("#myCanvas");

      // often useful
      w = canvas.width;
      h = canvas.height;

      // important, we will draw with this object
      ctx = canvas.getContext('2d');
      // default police for text
      ctx.font="20px Calibri";


      //add the listener to the main, window object, and update the states
      window.addEventListener('keydown', function(event){
          if (event.keyCode === 37) {
             inputStates.left = true;
          } else if (event.keyCode === 38) {
             inputStates.up = true;
          } else if (event.keyCode === 39) {
             inputStates.right = true;
          } else if (event.keyCode === 40) {
             inputStates.down = true;
          }  else if (event.keyCode === 32) {
             inputStates.space = true;
          }  else if (event.keyCode === 66) {
						 inputStates.b = true;
					}  else if (event.keyCode === 78) {
						 inputStates.n = true;
					}
      }, false);

      //if the key will be released, change the states object
      window.addEventListener('keyup', function(event){
          if (event.keyCode === 37) {
             inputStates.left = false;
          } else if (event.keyCode === 38) {
             inputStates.up = false;
          } else if (event.keyCode === 39) {
             inputStates.right = false;
          } else if (event.keyCode === 40) {
             inputStates.down = false;
          } else if (event.keyCode === 32) {
             inputStates.space = false;
          } else if (event.keyCode === 66) {
						 inputStates.b = false;
					} else if (event.keyCode === 78) {
						 inputStates.n = false;
					}

      }, false);

			// Create bats
        createFlies(nbFlies);
        createBats(nbBats);

      loadAssets(assetsToLoadURLs, function (assetsLoaded) {
          // all assets (images, sounds) loaded, we can start the animation
          assets = assetsLoaded;
          console.log("all images and sounds loaded and decoded");

          // Michel Buffa: for example, start main background music
          // this one is streamed...
          //assets.humbug.play();
          requestAnimationFrame(mainLoop);
        });
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

/*--------------------------------------------------------------------
  MULTIPLE IMAGE AND SOUND loader. In a real project, should be placed in a separate
  assets.js file. Note that you do not have to understand in details the next lines
  of code...just use them!
  The sounds can be streamed music or sound sample loaded and decoded in memory.
  The loader uses the Howler.js library, it should be included in your project,
  see the HTML file.

  Typical use:

  1) Declare the asset URLs of the images/sounds sample/music you want to load.
  For music files if buffer:true then the music will be streamed.

  Here is an example:

    var assetsToLoadURLs = {
      // images, can be sprite sheets etc.
      tennisBall: { url: "http://mainline.i3s.unice.fr/mooc/tennis_ball.png" },
      footBall: { url: 'http://mainline.i3s.unice.fr/mooc/football.png' },
      // Sound samples
      plop: { url: 'http://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3', buffer: false, loop: false, volume: 1.0 },
      // Music that should be streamed (will load very quickly and play as a stream)
      // Useful for background themes etc. Here we've got 2 compositions by Bill
      // Graham a student from the HTML5 part 2 couse + one from a student from
      // the last run of the course
      humbug: { url: 'http://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/humbug.mp3', buffer: true, loop: true, volume: 1.0 },
      concertino: { url: 'http://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/christmas_concertino.mp3', buffer: true, loop: true, volume: 1.0 },
      xmas: { url: 'http://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/xmas.mp3', buffer: true, loop: true, volume: 0.6 }

   };

   2) Declare a variable that will hold the images and sounds when they have been
   loaded and decoded:

   var assets = {};

   3) call the assetLoader function like this:

   loadAssets(assetsToLoadURLs, function(assetsLoaded) {
            assets = assetsLoaded;

            console.log("all images and sounds loaded and decoded");

            // Start background music
            assets.humbug.play();

            // Now, let's start the animation
            requestAnimationFrame(mainLoop);
   });
 */



function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}

function loadAssets(assetsToBeLoaded, callback) {
    var assetsLoaded = {};
    var loadedAssets = 0;
    var numberOfAssetsToLoad = 0;

    // define ifLoad function
    var ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        console.log("Loaded asset " + loadedAssets);
    };

    // get num of assets to load
    for (var name in assetsToBeLoaded) {
        numberOfAssetsToLoad++;
    }

    console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        var url = assetsToBeLoaded[name].url;
        console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();

            assetsLoaded[name].onload = ifLoad;
            // will start async loading.
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: function () {
                    if (++loadedAssets >= numberOfAssetsToLoad) {
                        callback(assetsLoaded);
                    }
                    console.log("Loaded asset " + loadedAssets);
                }
            }); // End of howler.js callback
        } // if

    } // for
} // function
