require('dotenv').config({silent: true})

const express = require('express')
const bodyParser = require('body-parser')
const uuid = require('node-uuid')
const Pusher = require('pusher')


const pusher = new Pusher({
  appId: process.env.p_app_id,
  key: process.env.p_key,
  secret: process.env.p_secret,
  cluster: process.env.p_cluster,
  encrypted: true
})


const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// accept all clients
app.post('/pusher/auth', function(req, res) {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const data = {
    user_id: uuid.v4(),
    user_info: {}
  }

  console.log(socketId, channel, data)

  const auth = pusher.authenticate(socketId, channel, data)

  res.send(auth)
})



app.listen(process.env.PORT || 3000)


// create browser bundle in public directory

const browserify = require('browserify'),
      envify = require('envify'),
      fs = require('fs')

const b = browserify('./lib/Hack.js', {standalone: 'Hack'}),
      output = fs.createWriteStream('public/Hack.js')

b.transform(envify)

b.bundle().pipe(output)
