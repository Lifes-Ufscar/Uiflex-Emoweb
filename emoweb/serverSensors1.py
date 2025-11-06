import serial
import time
from datetime import datetime

def ler_dados_serial(porta='COM4', baud_rate=9600, timeout=1, arquivo_csv='dados_sensores.csv'):
    try:
        # Configura a porta serial
        ser = serial.Serial(porta, baud_rate, timeout=timeout)
        print(f"Conectado à porta {porta}")
        
        time.sleep(2)  # Aguarda a estabilização da conexão

        # Abre o arquivo CSV para escrita (ou cria se não existir)
        with open(arquivo_csv, mode='w') as arquivo:
            # Escreve o cabeçalho do arquivo CSV manualmente
            arquivo.write('Data,Hora,GSR,A0,A1,ECG\n')

            while True:
                # Lê os dados da porta serial
                if ser.in_waiting > 0:
                    dados = ser.readline().decode('utf-8').strip()  # Lê e decodifica os dados
                    data_hora = datetime.now().strftime('%Y-%m-%d,%H:%M:%S')  # Obtém a data e hora atual
                    print(f"{data_hora} - Dado recebido: {dados}")
                    
                    # Escreve a linha com a data, hora e o dado no arquivo CSV
                    arquivo.write(f"{data_hora},{dados}\n")

    except serial.SerialException as e:
        print(f"Erro ao conectar na porta {porta}: {e}")

    except KeyboardInterrupt:
        print("\nInterrupção do teclado detectada. Encerrando...")

    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()  # Fecha a conexão serial
            print(f"Conexão com {porta} encerrada.")

if __name__ == "__main__":
    ler_dados_serial()
