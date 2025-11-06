const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');  // Importação correta na versão 10+
const { ReadlineParser } = require('@serialport/parser-readline');

// Ajuste a porta COM conforme o Gerenciador de Dispositivos do Windows (ex: COM4)
const port = new SerialPort({
  path: 'COM4',  // Substitua COM4 pela porta correta no seu Windows
  baudRate: 9600,
});

// Crie um parser para processar as linhas de dados recebidas
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Configuração do servidor Express e Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Sirva o arquivo HTML para o navegador
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/sensors.html');
});

// Conexão WebSocket
io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  // Quando houver dados da serial, envie-os ao cliente via WebSocket
  parser.on('data', (data) => {
    console.log(`Dados recebidos: ${data}`);
    socket.emit('arduinoData', data);
  });

  // Quando o cliente desconectar
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicie o servidor
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
