import Tile from './components/Tile'
import './styles.css'

const NUM_OF_ROWS = 20
const SNAKE_INIT = [[NUM_OF_ROWS / 2, NUM_OF_ROWS / 2]]
const INIT_TIME = 500 //ms

const INIT_STATE = {
  food: null,
  snake: SNAKE_INIT,
  direction: 'right',
  gameStatus: 'none',
  speed: INIT_TIME,
  points: 0,
}

export default class Game {
  constructor() {
    this.state = INIT_STATE
    this.onDirectionSelect = this.onDirectionSelect.bind(this)
    this.isFood = this.isFood.bind(this)
    this.isSnakePart = this.isSnakePart.bind(this)
    this.getNextSnake = this.getNextSnake.bind(this)
    this.didEatFood = this.didEatFood.bind(this)
    this.getNewFood = this.getNewFood.bind(this)
    this.growSnake = this.growSnake.bind(this)
    this.onTick = this.onTick.bind(this)
    this.clearBoard = this.clearBoard.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
    this.start = this.start.bind(this)
    this.render = this.render.bind(this)
    this.resetPoints = this.resetPoints.bind(this)
    this.addPoints = this.addPoints.bind(this)
    this.endGame = this.endGame.bind(this)

    window.addEventListener('keyup', this.onDirectionSelect)
  }

  onDirectionSelect(event) {
    switch (event.keyCode) {
      case 37: // left
        this.state.direction = 'left'
        return
      case 38: // up
        this.state.direction = 'up'
        return
      case 39: // right
        this.state.direction = 'right'
        return
      case 40: // down
        this.state.direction = 'down'
        return
      default:
        return
    }
  }

  isFood(row, column) {
    return (
      !!this.state.food &&
      this.state.food[0] === row &&
      this.state.food[1] === column
    )
  }

  isSnakePart(row, column) {
    return !!this.state.snake.find(
      value => value[0] === row && value[1] === column,
    )
  }

  getNextSnake() {
    return this.state.snake.map((value, index) => {
      const [row, column] = value
      if (index === 0) {
        switch (this.state.direction) {
          case 'left':
            return [row - 1, column]
          case 'right':
            return [row + 1, column]
          case 'down':
            return [row, column + 1]
          case 'up':
            return [row, column - 1]
          default:
            return [row, column]
        }
      } else {
        return this.state.snake[index - 1]
      }
    })
  }

  isSnakeOutOfBounds(headOfSnake) {
    const [row, column] = headOfSnake
    return (
      row < 0 ||
      row >= NUM_OF_ROWS ||
      column < 0 ||
      column >= NUM_OF_ROWS ||
      this.isSnakePart(row, column)
    )
  }

  didEatFood(headOfSnake) {
    const [row, column] = headOfSnake
    return this.isFood(row, column)
  }

  getNewFood() {
    let newFood = [
      Math.floor(Math.random() * NUM_OF_ROWS),
      Math.floor(Math.random() * NUM_OF_ROWS),
    ]

    while (this.isSnakePart(newFood[0], newFood[1])) {
      newFood = [
        Math.floor(Math.random() * NUM_OF_ROWS),
        Math.floor(Math.random() * NUM_OF_ROWS),
      ]
    }
    return newFood
  }

  growSnake() {
    const snake = this.getNextSnake()
    return [...snake, this.state.snake[this.state.snake.length - 1]]
  }

  onTick() {
    const snake = this.getNextSnake()
    const isSnakeOutOfBounds = this.isSnakeOutOfBounds(snake[0])

    if (!isSnakeOutOfBounds) {
      const didEatFood = this.didEatFood(snake[0])
      const food = didEatFood ? this.getNewFood() : this.state.food
      didEatFood && this.speedUp()
      didEatFood && this.addPoints()
      this.clearBoard()
      this.state.food = food
      this.state.snake = didEatFood ? this.growSnake() : snake
      this.updateBoard()
      setTimeout(this.onTick, this.state.speed)
    } else {
      this.endGame()
    }
  }

  addPoints() {
    this.state.points = this.state.points + 10
    const pointsContainer = document.getElementById('points')
    pointsContainer.innerHTML = `Points: ${this.state.points}`
  }

  speedUp() {
    this.state.speed = this.state.speed - 20
  }

  clearBoard() {
    this.state.snake.forEach(value => {
      const snakeTile = document.getElementById(value[0] + '_' + value[1])
      snakeTile.classList.remove('snake')
    })
    if (this.state.food) {
      const foodTile = document.getElementById(
        this.state.food[0] + '_' + this.state.food[1],
      )
      foodTile.classList.remove('food')
    }
  }

  updateBoard() {
    this.state.snake.forEach(value => {
      const snakeTile = document.getElementById(value[0] + '_' + value[1])
      snakeTile.classList.add('snake')
    })
    if (this.state.food) {
      const foodTile = document.getElementById(
        this.state.food[0] + '_' + this.state.food[1],
      )
      foodTile.classList.add('food')
    }
  }

  endGame() {
    document.getElementById('start_button').disabled = false
    const pointsContainer = document.getElementById('points')
    pointsContainer.innerHTML = `Game Over! Points: ${this.state.points}`
  }

  resetPoints() {
    const pointsContainer = document.getElementById('points')
    pointsContainer.innerHTML = 'Points: 0'
  }

  start() {
    document.getElementById('start_button').disabled = true
    this.resetPoints()
    this.clearBoard()
    this.state = INIT_STATE
    this.state.food = this.getNewFood()
    this.state.gameStatus = 'playing'

    this.onTick()
  }

  render() {
    const boardContainer = document.getElementById('board')

    for (let i = 0; i < 20; i++) {
      const row = document.createElement('div')
      row.classList.add('board_row')
      boardContainer.appendChild(row)
      for (let j = 0; j < 20; j++) {
        row.appendChild(
          Tile.createElement({
            id: j + '_' + i,
            className: 'tile',
          }),
        )
      }
    }

    const pointsContainer = document.getElementById('points')
    pointsContainer.innerHTML = 'Points: 0'
  }
}
