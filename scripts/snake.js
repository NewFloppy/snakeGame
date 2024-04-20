class Snake{
    constructor(game, fruit){
        this.game = game;
        this.fruit = fruit;
        this.width = 36;
        this.height = 37;
        this.xPosition;
        this.yPosition;
        this.speed;
        this.hDir;
        this.vDir;
        this.snake;
        this.lengthTail;

    }
    start(){
        this.xPosition = this.width * 4;
        this.yPosition = this.height * 6;
        this.snake = [];
        this.lengthTail = 0;
        this.handleTail();
    }
    handleTail(){
        for(let i = 0; i < this.lengthTail; i++){
            this.snake[this.lengthTail - i] = {x : this.snake[this.lengthTail - (i + 1)].x, y : this.snake[this.lengthTail - (i + 1)].y}
        }

        this.snake[0] = {x : this.xPosition, y : this.yPosition};
    }
    collitionWithTail(){
        for(let i = 0; i < this.lengthTail; i++){
            if(this.snake[i + 1].x === this.snake[0].x && this.snake[i + 1].y === this.snake[0].y){
                return true;
            }
        }
        return false;
    }
    update(){
        if(!this.game.endGame){

            if(this.xPosition + this.width > this.game.width || this.xPosition < 0 || this.yPosition + this.height >  this.game.height || this.yPosition < 0){
                this.game.endGame = true;
                this.game.sound.play(this.game.sound.gameOverSound);
            } else {
                this.xPosition += this.width * this.game.keyDirection.hDir;
                this.yPosition += this.height * this.game.keyDirection.vDir;
                this.handleTail();
            }

            // collition with tail
            if(this.collitionWithTail()){
                this.game.endGame = true;
                this.game.sound.play(this.game.sound.gameOverSound);
            }
            
            // collition with fruit
            if(this.game.checkCollition(this, this.fruit)){
                this.game.points ++;
                this.game.sound.play(this.game.sound.pointSound);
                this.lengthTail ++;
                this.fruit.start(this);
            }


        }
    }
    draw(){
        if(true){
            this.game.ctx.fillStyle = '#4b752b';

            for(let i = 0; i < this.snake.length; i++){
                this.game.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.width, this.height);
            }
        }
    }
}