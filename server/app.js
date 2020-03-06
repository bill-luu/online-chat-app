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

function generateUniqueName() {
  let foundUniqueName = false;
  let name = "";
  while(!foundUniqueName) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    name = firstName + "-" + lastName;
    if(!currentUsers.includes(name)) {
      currentUsers.push(name)
      foundUniqueName = true;
    }
  }

  return name;
}

io.on('connection', (client) => {
  let username = generateUniqueName()
  let usercolor = Math.floor(Math.random() * 16777215).toString(16)

  client.emit('userInfo', {
    username: username,
    color: usercolor
  })

  client.emit('messages', messages)

  io.emit('userlist', currentUsers)

  client.on("newMessage", (message) => {
    let newMessage = {
      timestamp: moment().format('LT'),
      username: message.username,
      color: message.color,
      message: message.message,
    }
    messages.push(newMessage)
    io.emit('messages', messages)
  })

  client.on("changeNickNameRequest", (newNickName) => {
    if(currentUsers.includes(newNickName)) {
      client.emit('changeNickNameFailed', "This name is already taken")
    } else {
      currentUsers.splice(currentUsers.indexOf(username), 1, newNickName);
      username = newNickName

      client.emit('userInfo', {
        username: username,
        color: usercolor
      })
      io.emit('userlist', currentUsers)
      
    }
  })

  client.on('disconnect', () => {
    var index = currentUsers.indexOf(username);
    if (index !== -1) currentUsers.splice(index, 1);
    io.emit('userlist', currentUsers)
  })
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);

