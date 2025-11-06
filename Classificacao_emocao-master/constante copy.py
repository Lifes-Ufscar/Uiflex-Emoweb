import socketio
import time
import threading
import numpy as np
from datetime import datetime
from scipy.signal import wiener

sio = socketio.Client()
id_lock = threading.Lock()
eeg_id = 0
arduino_id = 0

# Limpa os arquivos de saída no início
with open("dados_arduino.txt", "w") as file:
    file.write("")
with open("dados_arduino_filtrados.txt", "w") as file:
    file.write("")
with open("eeg_data.txt", "w") as file:
    file.write("")

# Inicializa listas para armazenar os sinais e seus IDs/timestamps correspondentes
gsr_data = []
ecg_data = []
data_records = []  # Armazenará tuplas de (id, timestamp, valor1, valor2)

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
    global eeg_id, arduino_id
    try:
        # Extrai dados do Arduino com tratamento seguro
        valores_arduino = data['arduino'].split(",")
        valor_gsr = safe_float_conversion(valores_arduino[0])
        valor_ecg = safe_float_conversion(valores_arduino[-1])
        valor1 = safe_float_conversion(valores_arduino[1])
        valor2 = safe_float_conversion(valores_arduino[2])
        
        timestamp = get_current_time()
        
        # Gera ID e armazena dados brutos
        with id_lock:
            arduino_id += 1
            current_arduino_id = arduino_id
        
        with open("dados_arduino.txt", "a") as file:
            file.write(
                f"ID: {current_arduino_id}, "
                f"Chegada dos dados: {timestamp}, "
                f"GSR: {valor_gsr}, "
                f"Valor1: {valor1}, "
                f"Valor2: {valor2}, "
                f"ECG: {valor_ecg}\n"
            )

        # Armazena para processamento junto com metadados
        gsr_data.append(valor_gsr)
        ecg_data.append(valor_ecg)
        data_records.append((current_arduino_id, timestamp, valor1, valor2))

        print(f"ID: {current_arduino_id}, Dado GSR recebido: {valor_gsr}")
        print(f"ID: {current_arduino_id}, Dado ECG recebido: {valor_ecg}")

        # Processamento com verificação de dados suficientes
        if len(ecg_data) >= 30:
            # Aplica filtro
            ecg_array = np.array(ecg_data)
            gsr_array = np.array(gsr_data)

            ecg_filtered = np.nan_to_num(wiener(ecg_array), nan=0.0)
            gsr_filtered = np.nan_to_num(wiener(gsr_array), nan=0.0)

            # Escreve dados filtrados com os IDs e timestamps correspondentes
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

            gsr_data.clear()
            ecg_data.clear()
            data_records.clear()

        # Processamento do EEG
        dados_eeg = data['eeg']['args']

        if not isinstance(dados_eeg, (list, tuple)) or len(dados_eeg) == 0:
            print(f"Dados inválidos")
        else:
            with id_lock:
                eeg_id += 1
                current_eeg_id = eeg_id
            
            # Formatação segura dos dados EEG
            try:
                dados_eeg_formatados = ', '.join([f"{safe_float_conversion(dado):.6f}" for dado in dados_eeg])
                with open("eeg_data.txt", "a") as file:
                    write_eeg_data(file, current_eeg_id, timestamp, dados_eeg)
                print(f"ID: {current_eeg_id}, Dados EEG recebidos: [{dados_eeg_formatados}]")
            except Exception as ee:
                print(f"Erro ao processar EEG (ID {current_eeg_id}): {ee}")

    except Exception as e:
        print(f"Erro ao processar os dados: {e}")
        print(f"Dados recebidos: {data}")

@sio.event
def disconnect():
    print("Desconectado do servidor Socket.IO")

def keep_running():
    try:
        sio.wait()
    except Exception as e:
        print(f"Erro durante a espera: {e}")

# Configuração da conexão
server_url = "http://localhost:8030"  # Ou seu servidor remoto
print(f"Conectando a {server_url}...")

try:
    sio.connect(server_url)
    print("Conexão estabelecida com sucesso")

    thread = threading.Thread(target=keep_running)
    thread.daemon = True
    thread.start()

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
