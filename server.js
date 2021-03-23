// Set up require from dependencies
const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")  // It is give different urls for different room

app.set("view engine", "ejs")
app.use(express.static("public"))

// Set up the Url
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

// I think setup connection to ejs file
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })  // get roomid
})

// socket functions
io.on('connection', socket => {
  // If join room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('User connected', userId) // send message to others : a person with this useris is connected

    socket.on("disconnect", () => { // when disconnect does
      socket.to(roomId).emit("User disconnected", userId)
    })
  })
})

server.listen(3000)