# Chatbot UI

The chatbot UI is intended to be a small chatbot user interface which can be used to interact with chatbots.

It uses wwebsockets for communication with a back end.

## Demo

You can find a demo here:

http://176.34.128.143:8082/index.html

## Installation

Make sure you have node 18+ installed.

Then run:

```bash
npm install
```

### Husky pre-commit hook

Please run this command to install the pre-commit hook

```bash
npx husky install
```

to install the libraries.

## Running

Please run the following command to start the UI in development mode

```bash
yarn run dev
```

## Websocket API

### Incoming messages

| Name             | Description                                            | Optional |
| ---------------- | ------------------------------------------------------ | -------- |
| "connect"        | Fired when the connection to the server is established |          |
| "disconnect"     | Fired when the connection to the server is stopped     |          |
| "connect_error"  | Fired when there is a connection error                 | Yes      |
| "connect_failed" | Fired when the connection fails                        | Yes      |
| "server_message" | Fired when a new token is sent from the server         | No       |
| "stopstreaming"  | Fired when there is an error                           | No       |

### Outgoing messages

| Name             | Description                                                     | Optional |
| ---------------- | --------------------------------------------------------------- | -------- |
| "client_message" | Fired when the connection from the user is received             |          |
| "stop_stream"    | Fired when the clients decided that it wants to stop the stream |          |
