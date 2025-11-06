import time
import socketio
import threading
from pythonosc import dispatcher, osc_server

sio = socketio.Client()

def conectar_socket():
    sio.connect('http://localhost:8030')
    print("Conectado ao servidor Socket.IO!")

def dados_udp(data):
    sio.emit("dados_udp", data)

def muse_handler(unused_addr, *args):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    filtered_args = list(args)[:4]
    print(f"{timestamp}: {filtered_args}")  
    dados_udp({"address": "/eeg", "args": filtered_args})

dispatcher = dispatcher.Dispatcher()
dispatcher.map("/eeg", muse_handler)

server = osc_server.ThreadingOSCUDPServer(('192.168.15.169', 7456), dispatcher)
print("Servidor OSC iniciado. Aguardando dados...")

# Conectar ao servidor Socket.IO em um thread separado
socket_thread = threading.Thread(target=conectar_socket)
socket_thread.start()

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("Leitura interrompida pelo usuário.")
finally:
    server.shutdown()
    sio.disconnect()