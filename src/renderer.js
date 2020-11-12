const { ipcRenderer } = require('electron')
const chroma = require('chroma-js')

let fontCount = 0;
let fonts = ['-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
'Copperplate, "Copperplate Gothic Light", fantasy',
'Consolas, monaco, monospace',
'"Brush Script MT", cursive'
]

let root = document.documentElement
let targetHighlight = getComputedStyle(root).getPropertyValue('--highlight-color').trim();
let curHighlight = getComputedStyle(root).getPropertyValue('--highlight-color-activated').trim();


ipcRenderer.on('run-line', (event, arg) => {
  let command = window.getSelection().toString()

  handleCommand(command)
})

function handleCommand(command) {
  if (["font_size++", "font_size--"].includes(command.trim())) {
    timeSinceRan = 0;

    let curSize = getComputedStyle(root).getPropertyValue('--font-size').trim()
    //remove px and convert to number
    curSize = Number(curSize.substring(0,curSize.length-2))

    curSize += 4 * (command[command.length-1]=="+"?1:-1)
    root.style.setProperty('--font-size', String(curSize)+"px")

  }
  else if ("font++" == command.trim()) {
    timeSinceRan = 0;

    fontCount += 1
    console.log(fonts[fontCount%fonts.length])
    root.style.setProperty('--font-type', fonts[fontCount%fonts.length])
  }
  else if ("dark" == command.trim()) {
    timeSinceRan = 0;

    document.getElementById("doc-body").classList.remove("light")
  }
  else if ("light" == command.trim()) {
    timeSinceRan = 0;

    document.getElementById("doc-body").classList.add("light")
  }
}

let timeSinceRan = 0;

function update(progress) {
  timeSinceRan += progress/500
  root.style.setProperty('--highlight-cur', String( chroma.mix(
    getComputedStyle(root).getPropertyValue('--highlight-color-activated').trim(), 
    getComputedStyle(root).getPropertyValue('--highlight-color').trim(), 
    Math.min(1,timeSinceRan)) ) )
}

function draw() {
  // Draw the state of the world
}

function loop(timestamp) {
  var progress = timestamp - lastRender

  update(progress)
  draw()

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}
var lastRender = 0
window.requestAnimationFrame(loop)