const httpServer = require('http-server')

class Server {
    constructor(root, port) {
        this.root = root
        this.port = port
        this.server = httpServer.createServer({ root: this.root })
    }

    listen() {
        this.server.listen(this.port, '0.0.0.0')
    }

    stop() {
        this.server.close()
    }
}

module.exports = Server