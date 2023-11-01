import {Socket} from "socket.io-client";

export const WEBSOCKET_QUESTION = 'question';
export const WEBSOCKET_RESPONSE = 'response';

export default function sendWSMessage(message: string, socket: Socket<any, any> | null) {
    if(!!socket) {
        socket.emit(WEBSOCKET_QUESTION, message);
        console.log('sent message: ' + message);
    }
}
