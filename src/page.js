const { ipcRenderer } = require('electron')

ipcRenderer.on('run-line', (event, arg) => {
  console.log(window.getSelection().toString());
})