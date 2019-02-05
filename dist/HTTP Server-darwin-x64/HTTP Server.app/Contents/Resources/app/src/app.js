const { dialog } = require('electron').remote
const nodeConsole = require('console')
const detectPort = require('detect-port')
const Server = require('./server')

nconsole = new nodeConsole.Console(process.stdout, process.stderr);

let httpRoot = ''
let httpPort = 8000
let server = null

const dirButton = document.getElementById('dirbutton')
const dirLabel = document.getElementById('dirlabel')
const portInput = document.getElementById('portinput')
const startButton = document.getElementById('start-button')
const stopButton = document.getElementById('stop-button')

dirButton.addEventListener('click', dirButtonClick)
portInput.addEventListener('keyup', portInputKeypress)
startButton.addEventListener('click', start)
stopButton.addEventListener('click', stop)

stopButton.style.display = 'none'

function dirButtonClick() {
    httpRoot = dialog.showOpenDialog({
        properties: ['openDirectory']
    })

    if (!httpRoot) {
        httpRoot = ''
        startButton.disabled = true
    }
    else {
        httpRoot = httpRoot[0]
        if (httpPort) {
            startButton.disabled = false
        }
    }

    dirLabel.innerText = httpRoot
}

function portInputKeypress() {
    httpPort = portInput.value
    nconsole.log(httpPort)

    if (isNaN(httpPort)) {
        startButton.disabled = true
        httpPort = null
        return
    }

    httpPort = Number(httpPort)
    if (httpPort < 1024 || httpPort > 65535) {
        startButton.disabled = true
        httpPort = null
        return
    }

    if (httpRoot) {
        startButton.disabled = false
    }
}

function start() {
    detectPort(httpPort, (err, _port) => {
        nconsole.log(httpPort, _port)
        if (_port !== httpPort) {
            dialog.showMessageBox({
                buttons: ['OK'],
                message: `Port ${httpPort} is in use by another program`
            })
            return
        }

        startButton.style.display = 'none'
        stopButton.style.display = 'inline'
        dirButton.disabled = true
        server = new Server(httpRoot, httpPort)
        server.listen()
    })
}

function stop() {
    stopButton.style.display = 'none'
    startButton.style.display = 'inline'
    dirButton.disabled = false
    server.stop()
}