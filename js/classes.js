//classes.js  
//classes

//boundary
 class Boundry {
    static width = 40;
    static height = 40;
    constructor({position, image,c}){
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
        this.c = c;
    }
  
    draw(){
        this.c.drawImage(this.image, this.position.x,this.position.y)
    }
  };
  
  //player
 class Pacman {
    constructor({position,velocity,c}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.c = c;
    }
  
    draw(){
        this.c.beginPath()
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            Math.PI*2)
            this.c.fillStyle = 'yellow'
            this.c.fill()
            this.c.closePath()
    }
  
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
  };

  //enemy
  class Ghost {
    static speed = 2;
    constructor({position,velocity, color = 'red', c}){
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.c = c;
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }
  
    draw(){
        this.c.beginPath()
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            Math.PI * 2)
            this.c.fillStyle = this.scared ? 'blue' : this.color
            this.c.fill()
            this.c.closePath()
    }
  
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
  };
  
  //food
  class Pellet {
    constructor({position,c}){
        this.position = position
        this.radius = 3
        this.c = c;
    }
  
    draw(){
        this.c.beginPath()
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            Math.PI*2)
            this.c.fillStyle = 'white'
            this.c.fill()
            this.c.closePath()
    }
  };

  //power up
  class PowerUp {
    constructor({position,c}){
        this.position = position
        this.radius = 7
        this.c = c;
    }
  
    draw(){
        this.c.beginPath()
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            Math.PI*2)
            this.c.fillStyle = 'red'
            this.c.fill()
            this.c.closePath()
    }
  };
  export {Boundry,Pacman,Ghost,Pellet,PowerUp};