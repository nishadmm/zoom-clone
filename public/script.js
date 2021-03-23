// Problems
// When close the createrClienter tab it is not gone from others

const socket = io('/')
const videoGrid = document.querySelector("#video-grid")
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const peers = []

const myVideo = document.createElement("video")
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
  video: true,
  Audio: true
}).then(stream => {
  addStreamToVideo(myVideo, stream)

  // Recieving call
  myPeer.on('call', call => { // when a call come > answer that call and send our stream
    call.answer(stream)
    const video = document.createElement("video")
    call.on('stream', userVideoStream => {  // This add first browser video into second (add vidoes in both)
      addStreamToVideo(video, userVideoStream)
    })
  })

  socket.on("User connected", userId => {
    connectToNewUser(userId, stream) // any user connected to this socket then connected to them
  })
})

socket.on("User disconnected", userId => {
  console.log("user disconnectd : " + userId)
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  // sent to socket
  socket.emit('join-room', ROOM_ID, id)
})

// connect to new user
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement("video")
  call.on('stream', userVideoStream => {  // in there is stream add stream to grid
    addStreamToVideo(video, userVideoStream)
    console.log("User connected : " + userId)
  })

  call.on('close', () => { // when user gone remove that person video
    video.remove()
  })

  peers[userId] = call
}


// add stream into video
function addStreamToVideo(video, stream) {
  video.srcObject = stream
  video.addEventListener("loadedmetadata", () => {
    video.play()
  })
  videoGrid.append(video)
}
