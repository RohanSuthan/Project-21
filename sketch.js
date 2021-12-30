var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pikachu, pikachu_running, pikachu_collided;
var ground;

var backgroundImg

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  pikachu_running = loadAnimation("pikachu_1.png","pikachu_2.png","pikachu_3.png","pikachu_4.png");
  pikachu_collided = loadAnimation("pikachu_1.png");
  
  obstacle1 = loadImage("Obstacle1.png");
  obstacle2 = loadImage("Obstacle2.png");
  obstacle3 = loadImage("Obstacle3.png");
  obstacle4 = loadImage("Obstacle4.png");
  obstacle5 = loadImage("Obstacle5.png");
  obstacle6 = loadImage("Obstacle6.png");

  backgroundImg = loadImage("background_1.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600,200);

  var message = "This is a message";
 console.log(message)
  
  pikachu = createSprite(35,160,20,50);
  pikachu.addAnimation("running", pikachu_running);
  pikachu.addAnimation("collided", pikachu_collided);
  

  pikachu.scale = 0.2;

  ground = createSprite(200,180,400,20);
  ground.x = ground.width /2;
  ground.visible = false
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  
  //create Obstacle Group
  obstaclesGroup = createGroup();
  
  pikachu.setCollider("rectangle",0,0,300,pikachu.height);
  pikachu.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //jump when the space key is pressed
    if(keyDown("space")&& pikachu.y >= 100) {
        pikachu.velocityY = -12.5;
        jumpSound.play();
    }
    
    //add gravity
    pikachu.velocityY = pikachu.velocityY + 0.85
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(pikachu)){
        gameState = END;
        dieSound.play();
        
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      pikachu.changeAnimation("collided", pikachu_collided);

      if(mousePressedOver(restart)) {
        reset();
      }
     
     //change the trex animation
      ground.velocityX = 0;
      pikachu.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  pikachu.collide(ground);


  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  pikachu.changeAnimation("running",pikachu_running);

  obstaclesGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,145,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

