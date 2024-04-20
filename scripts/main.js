class Fruit {
    constructor(game){
        this.game = game;
        this.width = 36;
        this.height = 37;
        this.xPosition;
        this.yPosition;
    }
    start(obj){
        let emptyPosition = false;         
            
        while(true){
            this.xPosition = this.width * Math.floor(Math.random() * 18);
            this.yPosition = this.height * Math.floor(Math.random() * 16);

            for(let i = 0; i < obj.snake.length; i++){
                
                if(this.xPosition === obj.snake[i].x && this.yPosition === obj.snake[i].y){
                    emptyPosition = false;
                    break;
                } else {
                    emptyPosition = true;
                }
            }
            if(emptyPosition) break;
        }
    }
    update(){

    }
    draw(){
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.xPosition , this.yPosition, this.width, this.height);
        
    }
}

class AudioControl{
    constructor(game){
        this.game = game;
        this.pointSound = document.getElementById('pointSound');
        this.backgroundSound = document.getElementById('backgrundSound');
        this.gameOverSound = document.getElementById('gameOverSound');
    }
    play(audio){
        audio.currentTime = 0;
        if(this.game.soundActive){
            audio.play();
        }
    }
}

class Game{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = 648;
        this.height = 592;

        this.points = 0;
        this.score = 0;

        this.soundElement = document.getElementById('sound');
        this.soundActive = true;
        this.sound = new AudioControl(this);

        this.apple = new Fruit(this);

        this.snake = new Snake(this, this.apple);
        this.snakeTimer = 0;
        this.snakeInterval = 150;

        this.delayed = true;
        this.endGame = true;

        this.keyDirection = {
            hDir : 0,
            vDir : 0,
        }

        this.start();
        

        // sound
        this.soundElement.addEventListener('click', _=>{
            this.soundActive = !this.soundActive;
            this.handleSound();
        });

        // keys
        window.addEventListener('keyup', e =>{
            if(!this.delayed){
                if(e.key === 'ArrowUp' || e.key.toLowerCase() === 'w'){
                    if(!Math.abs(this.keyDirection.vDir)){
                        this.keyDirection.vDir = -1;
                    }
                    this.keyDirection.hDir = 0;
                } else if(e.key === 'ArrowDown' || e.key.toLowerCase() === 's'){
                    if(!Math.abs(this.keyDirection.vDir)){
                        this.keyDirection.vDir = 1;
                    }
                    this.keyDirection.hDir = 0;
                } else if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a'){
                    if(!Math.abs(this.keyDirection.hDir)){
                        this.keyDirection.hDir = -1;
                    }
                    this.keyDirection.vDir = 0;
                } else if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd'){
                    if(!Math.abs(this.keyDirection.hDir)){
                        this.keyDirection.hDir = 1;
                    }
                    this.keyDirection.vDir = 0;
                }
                this.delayed = true;
            }
            if(e.key === 'Enter' && this.endGame){
                this.endGame = false;
                this.start();
            }
            // console.log(e.key);
        })
   
    }

    start(){
        this.resize(this.width , this.height);
        this.keyDirection.hDir = 1;
        this.keyDirection.vDir = 0;
        this.points = 0;
        this.snake.start();
        this.apple.start(this.snake);
        this.handleSound();
    }
    showMessaje(){
        if(this.endGame){
            this.ctx.fillStyle = 'white';
            this.ctx.font = '40px arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Press Enter to start!!', 300, 300);
        }
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }
    handleSnake(deltaTime){
        if(this.snakeTimer < this.snakeInterval){
            this.snakeTimer += deltaTime;
        } else {
            this.snakeTimer = 0;
            this.delayed = false;
            this.snake.update();
            // --------------------------
        }
    }
    handleScore(){
        document.getElementById('points').innerHTML = this.points;
        document.getElementById('score').innerHTML = this.score;

        if(this.endGame){
            if(this.points > this.score) this.score = this.points;
        }
    }
    handleSound(){
        if(this.soundActive){
            this.soundElement.children[0].classList.add('sound__icon--active');
            this.soundElement.children[1].classList.remove('sound__icon--active');
        } else {
            this.soundElement.children[1].classList.add('sound__icon--active');
            this.soundElement.children[0].classList.remove('sound__icon--active');
        }
    }
    checkCollition(obj1 , obj2){
        // return (obj1.xPosition + obj1.width >= obj2.xPosition && obj1.xPosition <= obj2.xPosition + obj2.width && obj1.yPosition + obj1.height >= obj2.yPosition && obj1.yPosition <= obj2.yPosition + obj2.height);
        return (obj1.xPosition === obj2.xPosition && obj1.yPosition === obj2.yPosition);
    }
    gridDraw(rows, columns){

        let cellWidth = (this.width / rows);
        let cellHeight = (this.height / columns);

        let changeColor = true;


        for(let i = 0; i < columns; i++){
            for(let j = 0; j < rows; j++){
                if(changeColor){
                    this.ctx.fillStyle = '#a9d655';
                } else {
                    this.ctx.fillStyle = '#a1cf48';
                }
                changeColor = !changeColor;

                this.ctx.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
            }

            changeColor = !changeColor;
        }
    }
    render(deltaTime){
        this.ctx.clearRect(0 , 0, this.width, this.height);
        this.gridDraw(18, 16);
        this.handleScore();

        this.handleSnake(deltaTime);

        this.apple.draw();
        this.snake.draw();

        this.showMessaje();
    }
}

window.addEventListener('load',_=>{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const game = new Game(canvas, ctx);

    let lastTime = 0;

    function animation(timeStamp){

        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        game.render(deltaTime);
        requestAnimationFrame(animation);
    }

    animation();
    
});