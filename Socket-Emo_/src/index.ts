import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const clientsMap = new Map<string, Socket>();

// Estado compartilhado
// Estado compartilhado
const state: {
  arduinoData: string | null; // Dados do Arduino (string ou null)
  eegData: { address: string; args: any[] } | null; // Dados do EEG (objeto ou null)
} = {
  arduinoData: null,
  eegData: null,
};


// Configuração da comunicação serial (Arduino)
const port = new SerialPort({ path: "COM6", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  // console.log("Dados do Arduino recebidos:", data);

  // Atualiza o estado com os novos dados do Arduino
  state.arduinoData = data;

  // Emite uma mensagem combinada com os dados atuais do Arduino e EEG
  io.emit("dadosAtualizados", {
    arduino: state.arduinoData,
    eeg: state.eegData,
  });
});

io.on("connection", (socket) => {
  console.log("Um cliente se conectou:", socket.id);
  clientsMap.set(socket.id, socket);

  // Manipula os dados recebidos do aplicativo (EEG)
  socket.on("dados_udp", (data: any) => {
    // console.log("Dados recebidos do aplicativo:");
    // console.log("Endereço:", data.address);
    // console.log("Dados decodificados:", data.data);

    if (data?.args) {
      // Filtra os primeiros 4 valores válidos
      const filteredArgs = data.args
        .filter((arg: number | null) => !!arg)
        .slice(0, 4);
      console.log(filteredArgs, filteredArgs.length)

      if (filteredArgs.length === 4) {
        // Atualiza o estado com os novos dados do EEG
        state.eegData = { address: data.address, args: filteredArgs };

        // Emite uma mensagem combinada com os dados atuais do Arduino e EEG
        io.emit("dadosAtualizados", {
          arduino: state.arduinoData,
          eeg: state.eegData,
        });
      }

      // console.log("Dados enviados aos clientes:", {
      //   arduino: state.arduinoData,
      //   eeg: state.eegData,
      // });
    } else {
      console.warn("Dados inválidos recebidos:", data.data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente se desconectou. ID: ${socket.id}`);
    clientsMap.delete(socket.id);
  });
});

// Porta do servidor HTTP/Socket.IO
const PORT = process.env.PORT || 8030;
server.listen(PORT, () => {
  console.log(`Servidor HTTP e Socket.IO rodando na porta ${PORT}`);
});
