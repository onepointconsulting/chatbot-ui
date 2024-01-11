import { Socket } from 'socket.io-client';
import { getSession } from './sessionFunctions.ts';

export const WEBSOCKET_CONNECT = 'connect';
export const WEBSOCKET_DISCONNECT = 'disconnect';
export const WEBSOCKET_CONNECTION_ERROR = 'connect_error';
export const WEBSOCKET_CONNECTION_FAILED = 'connect_failed';

export const WEBSOCKET_CLIENT_MESSAGE = 'client_message';
export const WEBSOCKET_SERVER_MESSAGE = 'server_message';
export const WEBSOCKET_START_SESSION = 'start_session';

export const WEBSOCKET_STOP_STREAMING_RESPONSE = 'stopstreaming';

export const STOP_STREAM = 'stop_stream';

export default function sendWSMessage(
  message: string,
  socket: Socket<any, any> | null,
) {
  // Check if session is set and if not, send the plain message
  console.info('Sending message to server', message);
  const session = getSession();
  if (session) {
    const { id, timestamp } = session;
    safeEmit(
      socket,
      WEBSOCKET_CLIENT_MESSAGE,
      JSON.stringify({ id, timestamp, message }),
    );
  } else {
    safeEmit(socket, WEBSOCKET_CLIENT_MESSAGE, message);
  }
}

export function sendStopStream(socket: Socket<any, any> | null) {
  safeEmit(socket, STOP_STREAM);
}

export function sendStartSession(socket: Socket<any, any> | null) {
  const session = getSession();
  safeEmit(socket, WEBSOCKET_START_SESSION, session ? session.id : '');
}

function safeEmit(
  socket: Socket<any, any> | null,
  event: string,
  ...args: any[]
) {
  if (!!socket) {
    socket.emit(event, ...args);
    console.log(`Sent ${event} message`);
  }
}
