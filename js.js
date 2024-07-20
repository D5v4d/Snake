class Game {
    constructor() {
        this.field = new Field();
        this.snake = new Snake(null, this.field);
        this.food = new Food(this.field, this.snake);
        this.snake.food = this.food;
    }

    reset() {
        this.field.reset();
        this.snake.reset();
        this.food.reset();
    }

}
class Field {
    constructor() {
        this.fieldParent = document.getElementById("game");
        this.sizePole();
        this.drawField();
    }

    sizePole() {
        while (true) {
            this.size = +prompt("                                     Добро пожаловать в игру змейка.\n                     Введите одно число от 6 до 20,  для создания поля!");
            if (this.size >= 6 && this.size <= 20) break;
            alert("Введите одно число от 6 до 20, для создания поля");
        }
        alert("Хорошей вам игры!")

        this.fieldParent.style.gridTemplateColumns = `repeat(${this.size}, 40px)`;
        this.fieldParent.style.gridTemplateRows = `repeat(${this.size}, 40px)`;

    }
    drawField() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let square = `<div class="square" data-x="${x}" data-y="${y}"></div>`
                this.fieldParent.innerHTML += square;
            }
        }
    }

    reset() {
        this.fieldParent.innerHTML = '';
        this.drawField();
    }
}

class Snake {
    constructor(food, field) {
        this.food = food;
        this.field = field;
        this.fieldParent = document.getElementById("game");
        this.nowpoints = document.querySelector(`.Nowpoints`);
        this.bestpoints = document.querySelector(`.Bestpoints`);
        this.snake = [
            { x: null, y: null },
            { x: null, y: null }

        ];
        this.initSnake();
        this.movement();
        this.direction = '';
        this.key = null;
        this.interval = 500;
        this.now = 0;
        this.best = 0;
        this.points();
    }

    initSnake() {
        // Координаты змейки по центру поля
        this.snake[0].x = Math.ceil(this.field.size / 2 - 1);
        this.snake[0].y = Math.ceil(this.field.size / 2 - 1);
        this.snake[1].x = Math.ceil(this.field.size / 2 - 2);
        this.snake[1].y = Math.ceil(this.field.size / 2 - 1);

        this.snake.forEach((item, index) => {
            document.querySelector(`.square[data-x="${item.x}"][data-y="${item.y}"]`).classList.add('snake')
            if (index === 0) {
                document.querySelector(`.square[data-x="${item.x}"][data-y="${item.y}"]`).classList.add('head')
            }
        })
    }

    movement() {
        document.addEventListener('keydown', (e) => {

            const oppositeMovement = () => {
                if (
                    (this.direction === 'right' && e.key === 'ArrowLeft') ||
                    (this.direction === 'left' && e.key === 'ArrowRight') ||
                    (this.direction === 'top' && e.key === 'ArrowDown') ||
                    (this.direction === 'bottom' && e.key === 'ArrowUp')
                ) {
                    return false;
                }
                return true;
            }

            if (oppositeMovement()) {
                if (e.key === 'ArrowRight') {
                    this.direction = 'right';
                } else if (e.key === 'ArrowUp') {
                    this.direction = 'top';
                } else if (e.key === 'ArrowDown') {
                    this.direction = 'bottom';
                } else if (e.key === 'ArrowLeft') {
                    this.direction = 'left';
                }
            }

            if (this.key !== e.key) {
                this.key = e.key;

                clearInterval(this.movInterval);
                this.movInterval = setInterval(() => {
                    let head = this.snake[0]
                    let newHead = { ...head };
                    if (this.direction === 'right') {
                        newHead.x += 1
                    } else if (this.direction === 'top') {
                        newHead.y -= 1
                    } else if (this.direction === 'bottom') {
                        newHead.y += 1
                    } else if (this.direction === 'left') {
                        newHead.x -= 1
                    }

                    if (newHead.x < 0 || newHead.x >= this.field.size || newHead.y < 0 || newHead.y >= this.field.size) {
                        clearInterval(this.movInterval);
                        alert('Game Over!');
                        game.reset();
                        return;
                    }

                    if (this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                        clearInterval(this.movInterval);
                        alert('Game Over!');
                        game.reset();
                        return;
                    }

                    let win = this.field.size * this.field.size
                    if(this.snake.length === win){
                        clearInterval(this.movInterval);
                        alert("You Win")
                        game.reset();
                        return;
                    }

                    this.snake.unshift(newHead);
                    let tail = this.snake.pop();

                    document.querySelector(`.square[data-x="${head.x}"][data-y="${head.y}"]`).classList.remove('head');
                    document.querySelector(`.square[data-x="${newHead.x}"][data-y="${newHead.y}"]`).classList.add('head', 'snake');
                    document.querySelector(`.square[data-x="${tail.x}"][data-y="${tail.y}"]`)?.classList.remove('snake');
                    this.increaseSnake()

                }, this.interval)
            }
        })
    }

    increaseSnake() {
        let headSnack = this.snake[0];
        let food = this.food.food;

        if (food.x == headSnack.x && food.y == headSnack.y) {
            document.querySelector(`.square[data-x="${food.x}"][data-y="${food.y}"]`).classList.remove('food');
            this.snake.push({});
            this.food.initFood();
            this.interval -= 5;
            this.now += 1
        }
        this.nowpoints.innerHTML = this.now
        this.reInitRecord()
    }

    points() {
        this.nowpoints.innerHTML = 0;
        let record = localStorage.getItem('best') ?? 0;
        this.best = record;
        this.bestpoints.innerHTML = record;
    }

    reInitRecord() {
        if (this.now > this.best) {
            this.best = this.now;
            localStorage.setItem('best', this.best);
            this.bestpoints.innerHTML = this.best;
        }
    }

    reset() {
        this.snake = [
            { x: null, y: null },
            { x: null, y: null }
        ];
        this.direction = '';
        this.key = null;
        this.interval = 500;
        clearInterval(this.movInterval);
        this.initSnake();
        this.now = 0;
        this.points();

    }
}

class Food {
    constructor(field, snake) {
        this.field = field;
        this.snake = snake;
        this.food = {}
        this.initFood()
    }

    initFood() {
        let isOnSnake;
        do {
            this.randomX = Math.floor(Math.random() * this.field.size);
            this.randomY = Math.floor(Math.random() * this.field.size);
            isOnSnake = this.snake.snake.some(segment => segment.x === this.randomX && segment.y === this.randomY)
        } while (isOnSnake);

        this.food.x = this.randomX;
        this.food.y = this.randomY;
        document.querySelector(`.square[data-x="${this.food.x}"][data-y="${this.food.y}"]`).classList.add('food')
    }

    reset() {
        this.initFood();
    }
}

const game = new Game();