const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;

// Servir arquivos estáticos (HTML, JS, etc.) da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar o servidor HTTP
const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// WebSocket Server para comunicação com o cliente (navegador)
const wss = new WebSocket.Server({ server });

// Configurar a conexão serial (substitua "COM4" pela porta correta)
const serialPort = new SerialPort({ path: 'COM7', baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Enviar os dados do Arduino via WebSocket para o navegador
parser.on('data', (data) => {
    // console.log(`Dados recebidos: ${data}`);
    
    // Enviar os dados para todos os clientes WebSocket conectados
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});
