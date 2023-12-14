import { Socket } from 'socket.io-client';

export const WEBSOCKET_CONNECT = 'connect'
export const WEBSOCKET_DISCONNECT = 'disconnect'
export const WEBSOCKET_CONNECTION_ERROR = 'connect_error'
export const WEBSOCKET_CONNECTION_FAILED = 'connect_failed'

export const WEBSOCKET_QUESTION = 'question';
export const WEBSOCKET_RESPONSE = 'response';
export const STOP_STREAMING_RESPONSE = 'stopstreaming';

export const STOP_STREAM = 'stop_stream';

export default function sendWSMessage(
  message: string,
  socket: Socket<any, any> | null,
) {
  if (!!socket) {
    socket.emit(WEBSOCKET_QUESTION, message);
    console.log('sent message: ' + message);
  }
}

export function sendStopStream(socket: Socket<any, any> | null) {
  if (!!socket) {
    socket.emit(STOP_STREAM);
    console.log('stopped stream');
  }
}
