const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 10000 });

server.on('connection', (ws) => {
  console.log("Client Connected");

  ws.on('message', (message) => {
    server.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log("Client disconnected");
  });
});

console.log("Server running...");
