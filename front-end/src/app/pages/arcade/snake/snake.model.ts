
export interface Coordinates {
    x: number;
    y: number;
}

export class SnakeSettings {
    static readonly SIZE = 300;
    static readonly GRID_SIZE = SnakeSettings.SIZE / 50;

    static setCanvasSettings(canvas: HTMLCanvasElement): void {
        canvas.height = canvas.width = this.SIZE * 2;
        canvas.style.height = canvas.style.width = `${this.SIZE * 2}px}`;
    }

    static scaleContext(context: CanvasRenderingContext2D): void {
        context.scale(2, 2);
    }

    static randomOffset(): number {
        return Math.floor(Math.random() * this.SIZE / this.GRID_SIZE) * this.GRID_SIZE;
    }

    static stringifyCoord(cord: Coordinates): string {
        return [cord.x, cord.y].join(',');
    }
}

export class SnakeGameValues {
    newDirection = 1;
    direction = this.newDirection;

    length = 3;
    snake: Array<Coordinates> = [{ x: SnakeSettings.SIZE / 2, y: SnakeSettings.SIZE / 2 }];

    candy: Coordinates = null;
    end = false;

    get newHead(): Coordinates {
        return {
            x: this.snake[0].x,
            y: this.snake[0].y
        };
    }

    get score(): number {
        return this.length - 3;
    }

    paintSnake(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.snake.length; i++) {
            const a = this.snake[i];
            context.fillRect(a.x, a.y, SnakeSettings.GRID_SIZE, SnakeSettings.GRID_SIZE);
        }
    }

    getSnakeObject() {
        const snakeObj = {};
        for (let i = 0; i < this.snake.length; i++) {
            const a = this.snake[i];
            if (i > 0) {
                snakeObj[SnakeSettings.stringifyCoord(a)] = true;
            }
        }
        return snakeObj;
    }

    checkCandy(head: Coordinates): void {
        if (this.candy && this.candy.x === head.x && this.candy.y === head.y) {
            this.candy = null;
            this.length += 1;
        }
    }

    checkDirection(): void {
        if (Math.abs(this.direction) !== Math.abs(this.newDirection)) {
            this.direction = this.newDirection;
        }
    }

    updateHead(head: Coordinates): Coordinates {
        const axis = Math.abs(this.direction) === 1 ? 'x' : 'y';
        if (this.direction < 0) {
            head[axis] -= SnakeSettings.GRID_SIZE;
        } else {
            head[axis] += SnakeSettings.GRID_SIZE;
        }
        return head;
    }
}
