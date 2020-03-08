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

let allUsers = []
let userIDGlobal = 0

function generateUniqueName() {
  let foundUniqueName = false;
  let name = "";
  while(!foundUniqueName) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    name = firstName + "-" + lastName;
    if(!allUsers.some(user => user.username === name)) {
      foundUniqueName = true;
    }
  }

  return name;
}

function emitUserInfo(client, currentUser) {
  client.emit('userInfo', {
    username: currentUser.username,
    color: currentUser.usercolor,
    userID: currentUser.clientID,
  })
}

function emitOnlineUsers() {
  let onlineUsers = allUsers.filter(user => user.isOnline === true);
  io.emit('userlist', onlineUsers)
}

function checkUsernameConflict(user, userInfo) {
  let usernamesMatch = user.username === userInfo.username
  let differentIDs = user.clientID !== parseInt(userInfo.clientID)
  return (usernamesMatch && differentIDs)
}

io.on('connection', (client) => {

  let clientUser = {
    username: "",
    usercolor: 000000,
    clientID: -1,
    isOnline: true,
  }

  client.emit('messages', messages)

  client.on('userInfoCheck', (userInfo) => {

    let userID = parseInt(userInfo.clientID) 
    
    clientUser.usercolor = Math.floor(Math.random() * 16777215).toString(16)

    if (allUsers.some(user => user.clientID === userID)) {
      
      // Verify names
      let username = ""

      if (allUsers.some(user => checkUsernameConflict(user, userInfo))) {
          username = generateUniqueName()
        } else {
          username = userInfo.username
        }
      
      // set user information
      for (let i in allUsers) {
        if (allUsers[i].clientID === userID) {
          allUsers[i].username = username
          allUsers[i].isOnline = true

          clientUser = allUsers[i]
        }
      }
    } else {
        clientUser.username = generateUniqueName()
        clientUser.clientID = userIDGlobal++
        clientUser.isOnline = true
        allUsers.push(clientUser)
    }

    emitOnlineUsers()

    emitUserInfo(client, clientUser)
  }) 

  client.on("newMessage", (message) => {
    let newMessage = {
      timestamp: moment().format('LT'),
      username: message.username,
      color: message.color,
      message: message.message,
      userID: clientUser.clientID,
    }
    messages.push(newMessage)
    io.emit('messages', messages)
  })

  client.on("changeNickNameRequest", (newNickName) => {
    let onlineUsers = allUsers.filter(user => user.isOnline === true);
    if (onlineUsers.some((user) => user.username === newNickName)) {
      client.emit('changeNickNameFailed', "This name is already taken")
    } else {
      for (let i in allUsers) {
        if(allUsers[i].username === clientUser.username) {
          allUsers[i].username = newNickName
        }
      }
      clientUser.username = newNickName

      emitUserInfo(client, clientUser)
      emitOnlineUsers()
      
    }
  })

  client.on("changeNickColorRequest", (newColor) => {
    clientUser.usercolor = newColor;
    emitUserInfo(client, clientUser)
  })

  client.on('disconnect', () => {
    for (let i in allUsers) {
      if (allUsers[i].clientID === clientUser.clientID) {
        allUsers[i].isOnline = false
      }
    }

    emitOnlineUsers()
  })
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);

