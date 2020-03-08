import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

export function subscribeToMessageList(cb) {
    socket.on('messages', messages => cb(null, messages));
}

export function subscribeToUserInfo(cb) {
    socket.on('userInfo', userInfo => cb(null, userInfo));
}

export function sendMessage(message) {
    socket.emit('newMessage', message)
}

export function subscribeToUsersList(cb) {
    socket.on('userlist', messages => cb(null, messages));
}

export function requestToChangeNickName(newNickName) {
    socket.emit('changeNickNameRequest', newNickName)
}

export function requestToChangeColor(newColor) {
    socket.emit('changeNickColorRequest', newColor)
}

export function subscribeNickNameChangeFailed(cb) {
    socket.on('changeNickNameFailed', reason => cb(reason));
}

export function checkIfUserExists(userInfo) {
    socket.emit('userInfoCheck', userInfo)
}