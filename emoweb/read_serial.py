import csv
import time
import socketio
from pythonosc import dispatcher
from pythonosc import osc_server

sio = socketio.Client()
sio.connect('http://localhost:8030')

def dados_udp(data):
    sio.emit("dados_udp", data)

def muse_handler(unused_addr, *args):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    filtered_args = list(args)[:4]
    print(f"{timestamp}: {filtered_args}")
    csv_writer.writerow([timestamp] + filtered_args)
    csv_file.flush()
    dados_udp({"address": "/eeg", "args": filtered_args})

dispatcher = dispatcher.Dispatcher()
dispatcher.map("/eeg", muse_handler)

csv_filename = 'dados_muse.csv'

with open(csv_filename, mode='w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['timestamp', 'ch1', 'ch2', 'ch3', 'ch4'])

    server = osc_server.ThreadingOSCUDPServer(('192.168.0.6', 7456), dispatcher)
    print("Servidor OSC iniciado. Aguardando dados...")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Leitura interrompida pelo usuário.")
    finally:
        server.shutdown()
        sio.disconnect()