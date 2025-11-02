let spheres;
let w; 
let h;
let gameOver = false;
let area = 0;

// let bckgr = 255;
// let ballBckgr = 255;
// let ballStroke = 0;
// let textStroke = 0;

let bckgr = 0;
let ballBckgr = 0;
let ballStroke = [75, 167, 95];
let textStroke = [75, 167, 95];


// let s = new Audio('song.mp3');




// s.play()
class Ball {
  constructor(x, y, d, v) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.vx = v[0];
    this.vy = v[1];
    this.wallCollide = false;
    this.collided = false;
    this.mass = this.d/10;
    this.thud = new Audio('Thud.mp3');
    this.thud.volume = 0.2;
  }
  
  grow() {
    this.d += 0.9;
    this.mass = this.d/10;
  }
  
  draw() {
    stroke(ballStroke);
    strokeWeight(2)
    circle(this.x, this.y, this.d);
    textSize(this.d/3)
    fill(ballStroke);
    strokeWeight(1)
    text("ಠ_ಠ", this.x-this.d/3, this.y+this.d/10)
    fill(ballBckgr)
  }
  
  dynamicWallCollide(){
    if (this.x + this.vx + this.d/2 > windowWidth){
      this.vx = -this.vx;
      if(this.thud) this.thud.play();
    }
    if (this.y + this.vy + this.d/2 > windowHeight){
      this.vy = -this.vy;
      if(this.thud) this.thud.play();
    }
    if (this.x + this.vx - this.d/2 < 0){
      this.vx = -this.vx;
      if(this.thud) this.thud.play();
    }
    if (this.y + this.vy - this.d/2 < 0){
      this.vy = -this.vy;
      if(this.thud) this.thud.play();
    }
  }
  
  staticWallCollide(){
    if (this.x + this.vx + this.d/2 >= windowWidth){
      this.wallCollide = true;
      this.vx = -1;
      if(this.thud) this.thud.play();
    }
    if (this.y + this.vy + this.d/2 >= windowHeight){
      this.wallCollide = true;
      this.vy = -1;
      if(this.thud) this.thud.play();
    }
    if (this.x + this.vx - this.d/2 <= 0){
      this.wallCollide = true;
      this.vx = 1;
      if(this.thud) this.thud.play();
    }
    if (this.y + this.vy - this.d/2 <= 0){
      this.wallCollide = true;
      this.vy = 1;
      if(this.thud) this.thud.play();
    }
  }
  
  collide() {
    for(let i of spheres){
      if(i == this){ continue }
      else if(circleCollision(this,i)){
        let x1 = [this.x, this.y];
        let x2 = [i.x, i.y];
        let u1 = [this.vx, this.vy];
        let u2 = [i.vx, i.vy];

        let mass1 = (2*i.mass / (this.mass+i.mass)); // Mass multiplier 1
        let num1 = dotProduct(vectorSub(u1,u2), vectorSub(x1,x2));        // Numerator 1
        let num2 = vectorSub(x1,x2);                                      // Numerator 2
        let den1 = vectorMag(vectorSub(x1,x2))**2;                        // Denominator 1

        let mass2 = (2*this.mass / (this.mass+i.mass)); // Mass multiplier 2
        let num3 = dotProduct(vectorSub(u2,u1), vectorSub(x2,x1));        // Numerator 3
        let num4 = vectorSub(x2,x1);                                      // Numerator 4
        let den2 = vectorMag(vectorSub(x2,x1))**2;                        // Denominator 2

        // Here we calculate the new velocities but we haven't assigned them to the shapes yet
        let v1 = vectorSub(u1, vectorMult(num2,(num1/den1)*mass1));
        let v2 = vectorSub(u2, vectorMult(num4,(num3/den2)*mass2));
        
        this.vx = v1[0];
        this.vy = v1[1];
        i.vx = v2[0];
        i.vy = v2[1];
        this.collided = true;
        this.thud.volume = min(0.5, (abs(i.vx) + abs(i.vy))/200)
        if(this.thud) this.thud.play();
      } 
    }
  }
  
  move(){
    this.x += this.vx;
    this.y += this.vy;
  }
  
}

spheres = [new Ball(100, 200, 40, [7,9])];
// spheres = [new Ball(100, 200, 20000, [0,0])];


function setup() {
  w = windowWidth;
  console.log(windowWidth)
  h = windowHeight;
  createCanvas(w, h);
  spheres[0].d = w/20;
  // s.volume = 0.2
  // s.play()
}

// let muteMusic = false;

function draw() {
  background(bckgr);
  // s.play()
  
  
  if (mouseIsPressed  && !gameOver) {
    spheres[spheres.length-1].staticWallCollide();
    if(spheres[spheres.length-1].wallCollide == false  && !gameOver){
      spheres[spheres.length-1].grow();
      gameOver = spheres[spheres.length-1].collided;
    }
    
  } 
  for(let s of spheres) {
    s.draw();
    s.dynamicWallCollide();
    s.collide();
    if(!gameOver) s.move();
  }
  
  if(gameOver) {
    rectColor = color(200, 200, 200);
    rectColor.setAlpha(75);
    stroke(rectColor)
    fill(rectColor)
    rect(15, windowHeight/2 - 70, 475, 300)
    fill(255)
    textSize(71.8);
    textFont("Share Tech Mono")
    text("GAME OVER", 20, windowHeight/2)
    area = 0;
    for(let s of spheres) {
      area += Math.PI * (s.d/2)**2 
    }
    textSize(718/15);
    text("Final Score: " + Math.round(area/(windowWidth*windowHeight)*10000)/100 + "%",20, 3*windowHeight/5);
    text("Balls Used: " + spheres.length, 20, 3.5*windowHeight/5);
    text("click to retry ", 20, 4*windowHeight/5);
  }
  
  textSize(718/30)
  area = 0;
  for(let s of spheres) {
    area += Math.PI * (s.d/2)**2 
  }
  fill(textStroke)
  textFont("Share Tech Mono")
  text("Score: " + Math.round(area/(windowWidth*windowHeight)*10000)/100 + "%", 10, windowHeight-20)
  fill(ballBckgr)
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gameOver = false;
  spheres = [new Ball(100, 200, 40, [7,9])];
}

function mousePressed() {
  
  clickingBall = false;
  for(let i of spheres){
    if(dist(mouseX,mouseY, i.x, i.y) < i.d/2) clickingBall = true;
  }
  
  if(!gameOver && !clickingBall && mouseX > 0 && mouseY > 0) {
    spheres.push(new Ball(mouseX, mouseY, 0, [0, 0]));
  }
  if(gameOver){
    spheres = [new Ball(100, 200, 40, [7,9])];
    gameOver = false;
  }
}

function keyPressed() {
  // if(muteMusic){
  //   s.pause()
  // } else {
  //   s.play()
  // }
  // muteMusic = !muteMusic;
}


function circleCollision(a,b){
  // Detects if circles a and b are touching returns true if they are, false otherwise
  if (dist(a.x+a.vx,a.y+a.vy,b.x+b.vx,b.y+b.vy) <= a.d/2 +b.d/2){
    return true;
  }
  else {
    return false;
  }
}


function dotProduct(a,b){
  // Dot product of a*b (inner product/ scalar product)
  let product = 0;
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      product += a[i]*b[i];
    }
    return product;
  }
}

function vectorMag(v){
  // Vector magnitude
  let mag = 0;
  for(let i of v){
    mag += i**2
  }
  return sqrt(mag);
}

function vectorSub(a,b){
  // Subtracts vector b from vector a
  let sub = []
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      sub[i] = a[i]-b[i];
    }
    return sub;
  }
}

function vectorMult(v,s){
  // Multiplies vector (v) by scalar (s)
  let mult = [];
  for(let i = 0; i < v.length; i++){
    mult[i] = v[i]*s;
  }
  return mult;
}