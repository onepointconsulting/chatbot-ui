import { io } from 'socket.io-client';

const socket = io('ws://127.0.0.1:5000');

console.log('socket', socket);

socket.on('connect', () => {
  console.log('connected');
});

console.log('socket on');

socket.emit('echo', 'hello world');
console.log('socket emit');
