const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const morgan = require('morgan')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const STATIC_PATH = path.join(__dirname, 'client')
const PORT = 8080

const webpackConfig = require('./webpack.config.js')('dev')
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))

//colorized requests
app.use(morgan('dev'))

// Disable Caching
app.use((req, res, next)=>{
  res.header('Cache-Control', 'no-cache')
  next()
})

app.use(express.static(STATIC_PATH))

//main route
app.use((req, res, next)=>{
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Redux Socket.IO</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="./bundle.js"></script>
    </body>
    </html>
`)
})


//socket
const INTERVAL = 3000
io.on('connection', socket => {
  console.log('a user connected')
  setInterval(()=> {socket.emit('event:statusChanged', {status: 1234})}, INTERVAL)
})


const server = http.listen(PORT, () =>{
  console.log('listening on port 8080')
  server.keepAliveTimeout = 0
});
