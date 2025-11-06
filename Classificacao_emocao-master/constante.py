import socketio
import time
import threading
import numpy as np
from datetime import datetime
from scipy.signal import wiener
from collections import deque

# Configuração inicial
sio = socketio.Client()
id_lock = threading.Lock()
queue_lock = threading.Lock()
global_id = 0
event_queue = deque()

# Limpeza dos arquivos de saída
with open("dados_arduino.txt", "w") as file:
    file.write("")
with open("dados_arduino_filtrados.txt", "w") as file:
    file.write("")
with open("eeg_data.txt", "w") as file:
    file.write("")

# Variáveis para armazenamento temporário
gsr_data = []
ecg_data = []
data_records = []  # Armazena tuplas (id, timestamp, valor1, valor2)

def write_eeg_data(file, eeg_id, timestamp, dados):
    """Escreve dados EEG formatados corretamente"""
    try:
        dados_formatados = ', '.join([f"{safe_float_conversion(dado):.6f}" for dado in dados])
        file.write(
            f"ID: {eeg_id}, "
            f"Chegada dos dados: {timestamp}, "
            f"Dados brutos EEG: [{dados_formatados}]\n"
        )
    except Exception as e:
        print(f"Erro ao formatar EEG: {e}")

def get_current_time():
    return datetime.now().strftime("%H:%M:%S")

def safe_float_conversion(value, default=0.0):
    """Conversão segura para float com valor padrão"""
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int_conversion(value, default=0):
    """Conversão segura para int com tratamento de NaN"""
    try:
        float_val = float(value)
        return int(float_val) if not np.isnan(float_val) else default
    except (ValueError, TypeError):
        return default

@sio.event
def connect():
    print("Conectado ao servidor Socket.IO")

@sio.on('dadosAtualizados')
def on_dados_atualizados(data):
    """Recebe dados e coloca na fila de processamento"""
    timestamp = time.time()
    with queue_lock:
        event_queue.append((timestamp, data))

def process_arduino_data(data, current_id, timestamp):
    """Processa dados do Arduino"""
    try:
        valores_arduino = data['arduino'].split(",")
        valor_gsr = safe_float_conversion(valores_arduino[0])
        valor_ecg = safe_float_conversion(valores_arduino[-1])
        valor1 = safe_float_conversion(valores_arduino[1])
        valor2 = safe_float_conversion(valores_arduino[2])
        
        # Armazena dados brutos
        with open("dados_arduino.txt", "a") as file:
            file.write(
                f"ID: {current_id}, "
                f"Chegada dos dados: {timestamp}, "
                f"GSR: {valor_gsr}, "
                f"Valor1: {valor1}, "
                f"Valor2: {valor2}, "
                f"ECG: {valor_ecg}\n"
            )

        # Armazena para processamento em lote
        gsr_data.append(valor_gsr)
        ecg_data.append(valor_ecg)
        data_records.append((current_id, timestamp, valor1, valor2))

        print(f"ID: {current_id}, Dado GSR recebido: {valor_gsr}")
        print(f"ID: {current_id}, Dado ECG recebido: {valor_ecg}")

        # Processamento quando tiver dados suficientes
        if len(ecg_data) >= 30:
            process_batch_data()

    except Exception as e:
        print(f"Erro ao processar dados Arduino: {e}")

def process_batch_data():
    """Processa um lote completo de dados do Arduino"""
    try:
        ecg_array = np.array(ecg_data)
        gsr_array = np.array(gsr_data)

        ecg_filtered = np.nan_to_num(wiener(ecg_array), nan=0.0)
        gsr_filtered = np.nan_to_num(wiener(gsr_array), nan=0.0)

        # Escreve dados filtrados
        with open("dados_arduino_filtrados.txt", "a") as file:
            for i in range(len(gsr_filtered)):
                record_id, record_timestamp, record_valor1, record_valor2 = data_records[i]
                file.write(
                    f"ID: {record_id}, "
                    f"Timestamp: {record_timestamp}, "
                    f"GSR_filtrado: {safe_int_conversion(gsr_filtered[i])}, "
                    f"Valor1: {record_valor1}, "
                    f"Valor2: {record_valor2}, "
                    f"ECG_filtrado: {safe_int_conversion(ecg_filtered[i])}\n"
                )

        # Limpa buffers
        gsr_data.clear()
        ecg_data.clear()
        data_records.clear()

    except Exception as e:
        print(f"Erro no processamento em lote: {e}")

def process_eeg_data(data, current_id, timestamp):
    """Processa dados do EEG"""
    try:
        dados_eeg = data['eeg']['args']
        
        if not isinstance(dados_eeg, (list, tuple)) or len(dados_eeg) == 0:
            print("Dados EEG inválidos")
            return

        # Escreve dados EEG brutos
        with open("eeg_data.txt", "a") as file:
            write_eeg_data(file, current_id, timestamp, dados_eeg)
            
        print(f"ID: {current_id}, Dados EEG recebidos: {dados_eeg}")

    except Exception as e:
        print(f"Erro ao processar EEG (ID {current_id}): {e}")

def process_events():
    """Processa eventos na ordem de chegada"""
    global global_id
    
    while True:
        if event_queue:
            with queue_lock:
                timestamp, data = event_queue.popleft()
            
            try:
                with id_lock:
                    global_id += 1
                    current_id = global_id
                
                human_time = datetime.fromtimestamp(timestamp).strftime('%H:%M:%S')
                
                # Processa ambos os tipos de dados
                if 'arduino' in data:
                    process_arduino_data(data, current_id, human_time)
                
                if 'eeg' in data:
                    process_eeg_data(data, current_id, human_time)

            except Exception as e:
                print(f"Erro no processamento principal: {e}")
        
        time.sleep(0.002)

@sio.event
def disconnect():
    print("Desconectado do servidor Socket.IO")

def keep_running():
    try:
        sio.wait()
    except Exception as e:
        print(f"Erro durante a espera: {e}")

# Configuração da conexão
server_url = "http://localhost:8030"  # Substitua pelo seu servidor
print(f"Conectando a {server_url}...")

try:
    sio.connect(server_url)
    print("Conexão estabelecida com sucesso")

    # Inicia thread para processamento ordenado
    processor_thread = threading.Thread(target=process_events)
    processor_thread.daemon = True
    processor_thread.start()

    # Thread para manter a conexão
    connection_thread = threading.Thread(target=keep_running)
    connection_thread.daemon = True
    connection_thread.start()

    while True:
        time.sleep(1)

except socketio.exceptions.ConnectionError as e:
    print(f"Falha na conexão: {e}")
    print("Verifique se o servidor está rodando e a URL está correta")
except KeyboardInterrupt:
    print("\nDesconectando...")
finally:
    sio.disconnect()
    print("Conexão encerrada")