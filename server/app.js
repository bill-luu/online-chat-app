// let express = require ('express');
// let app = express ();
let moment = require('moment')
const io = require('socket.io')();

let messages = []
let firstNames = [
  "Bald",
  "Muscular",
  "Fancy",
  "White",
  "Poor",
  "Ambitous",
  "Lively",
  "Scary",
  "Straight",
]

let lastNames = [
  "Albatross",
  "Bison",
  "Bear",
  "Dog",
  "Lion",
  "Koala",
  "Elysia",
  "Kangaroo",
  "Tiger",
  "Sloth"
]

let currentUsers = []
let userID = 0

function generateUniqueName() {
  let foundUniqueName = false;
  let name = "";
  while(!foundUniqueName) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    name = firstName + "-" + lastName;
    if(!currentUsers.some(user => user.username === name)) {
      foundUniqueName = true;
    }
  }

  return name;
}

function emitUserInfo(client, username, usercolor, clientID) {
  client.emit('userInfo', {
    username: username,
    color: usercolor,
    userID: clientID,
  })
}

io.on('connection', (client) => {
  let username = generateUniqueName()
  let usercolor = Math.floor(Math.random() * 16777215).toString(16)
  let clientID = userID++
  currentUsers.push({
    username: username,
    userID: clientID
  })

  emitUserInfo(client, username, usercolor, clientID)

  client.emit('messages', messages)

  io.emit('userlist', currentUsers)

  client.on("newMessage", (message) => {
    let newMessage = {
      timestamp: moment().format('LT'),
      username: message.username,
      color: message.color,
      message: message.message,
      userID: clientID,
    }
    messages.push(newMessage)
    io.emit('messages', messages)
  })

  client.on("changeNickNameRequest", (newNickName) => {
    if (currentUsers.some(user => user.name === newNickName)) {
      client.emit('changeNickNameFailed', "This name is already taken")
    } else {
      for (let i in currentUsers) {
        if(currentUsers[i].username === username) {
          currentUsers[i].username = newNickName
        }
      }
      username = newNickName

      emitUserInfo(client, username, usercolor, clientID)
      io.emit('userlist', currentUsers)
      
    }
  })

  client.on("changeNickColorRequest", (newColor) => {
    usercolor = newColor;
    emitUserInfo(client, username, usercolor, clientID)
  })

  client.on('disconnect', () => {
    let index = -1;
    for (let i in currentUsers) {
      if (currentUsers[i].userID === clientID) {
        index = i;
      }
    }

    if (index !== -1) currentUsers.splice(index, 1);
    io.emit('userlist', currentUsers)
  })
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);

