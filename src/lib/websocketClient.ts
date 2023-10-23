import {io, Socket} from "socket.io-client";
import WEBSOCKET_URL from "./apiConstants.ts";

export const socket = io(WEBSOCKET_URL);

export const WEBSOCKET_MESSAGE = 'question';
export const WEBSOCKET_RESPONSE = 'response';

export default function sendWSMessage(message: string, socket: Socket<any, any> | null) {
    if(!!socket) {
        socket.emit(WEBSOCKET_MESSAGE, message);
        console.log('sent message: ' + message);
    }
}
