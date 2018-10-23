class Tile {
  constructor() {
    this.createElement = this.createElement.bind(this)
    this.htmlToElement = this.htmlToElement.bind(this)
  }

  htmlToElement(html) {
    var template = document.createElement('template')
    html = html.trim() // Never return a text node of whitespace as the result
    template.innerHTML = html
    return template.content.firstChild
  }

  createElement(data) {
    return this.htmlToElement(`<svg id="${data.id}" class="${
      data.className
    }" width="1em" height="1em">
    <title>background</title>
    <path fill="currentColor" d="M-1-1h202v202H-1z" />
    <g>
      <title>Layer 1</title>
    </g>
    </svg>`)
  }
}

export default new Tile()
