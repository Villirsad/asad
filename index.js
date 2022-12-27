const express = require('express')
const { Server } = require('socket.io')
const app = express()
const http = require('http')
const HTTPServer = http.createServer(app)
const AuthRouter = require('./routes/AuthRouter')
const io = new Server(HTTPServer, {
  // options
})
const Whoami = require('./routes/whoami')
const {startSocket} = require("./sockets/socket")
const cors = require('cors')

app.use(cors())
app.use(express.static('./public'))
app.use(express.json('extended'))
app.use(AuthRouter)
app.use(Whoami)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
})
app.get('/auth', (req, res)=>{
  res.sendFile(__dirname + '/views/auth.html');
})
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/views/404.html');
})

startSocket(io)

HTTPServer.listen(3000, ()=>{
    console.log('Server was started')
})