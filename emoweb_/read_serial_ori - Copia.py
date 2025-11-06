import csv
import time
from pythonosc import dispatcher
from pythonosc import osc_server
import threading

# Definir o tempo limite (em segundos)
TIME_LIMIT = 60  # Substitua pelo tempo desejado

# Função para lidar com dados recebidos do Muse via OSC
def muse_handler(unused_addr, *args):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    data = ', '.join(map(str, args))
    print(f"{timestamp}: {data}")  # Logar na tela
    csv_writer.writerow([timestamp] + list(args))
    csv_file.flush()  # Garantir que os dados sejam gravados em tempo real

# Configurar o dispatcher para lidar com as mensagens OSC
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/eeg", muse_handler)  # Mapeia o endereço OSC para a função handler

# Nome do arquivo CSV
csv_filename = 'dados_muse.csv'

# Função para parar o servidor após o tempo limite
def stop_server():
    print("Tempo limite atingido. Parando o servidor OSC...")
    server.shutdown()

# Abrir o arquivo CSV para escrita
with open(csv_filename, mode='w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['timestamp', 'ch1', 'ch2', 'ch3', 'ch4'])  # Cabeçalho do CSV

    # Configurar e iniciar o servidor OSC
    server = osc_server.ThreadingOSCUDPServer(('192.168.15.169', 7456), dispatcher)
    print("Servidor OSC iniciado. Aguardando dados...")

    # Iniciar o temporizador
    timer = threading.Timer(TIME_LIMIT, stop_server)
    timer.start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Leitura interrompida pelo usuário.")
    finally:
        server.shutdown()
