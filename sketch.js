var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;
localStorage["HighestScore"] = 0;

function preload()
{
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(windowWidth/2 - 500, windowHeight - 350, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  
  ground = createSprite(windowWidth/2, windowHeight - 70, windowWidth, 30);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2, windowHeight/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  gameOver.visible = false;
  
  restart = createSprite(windowWidth/2, windowHeight/2);
  restart.addImage(restartImg);
  restart.scale = 1;
  restart.visible = false;
  
  invisibleGround = createSprite(windowWidth/2, windowHeight - 50, windowWidth, 2);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() 
{
  background(250);
  textSize(20);
  text("Score: "+ score, windowWidth/2 - 350, windowHeight/2 - 350);
  
  if (gameState===PLAY)
  {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= windowHeight/2 + 70) 
    {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex))
    {
        gameState = END;
    }
  }
  else if (gameState === END) 
  {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);

    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);   
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) 
    {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() 
{
  if (frameCount % 100 === 0) 
  {
    var cloud = createSprite(windowWidth/2 + 450, windowHeight/2 - 350, 40, 10);
    cloud.y = Math.round(random(windowHeight/2 - 350, windowHeight/2 - 250));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    cloud.lifetime = 700;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() 
{
  if(frameCount % 100 === 0) 
  {
    var obstacle = createSprite(windowWidth/2 + 450, windowHeight - 95, 10, 40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) 
    {
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

    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"] < score)
  {
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  score = 0;
}