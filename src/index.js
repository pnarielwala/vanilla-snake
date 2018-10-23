import Game from './Game'

window.onload = function() {
  const game = new Game()
  game.render()

  const startButton = document.getElementById('start_button')
  startButton.addEventListener('click', game.start)
}
