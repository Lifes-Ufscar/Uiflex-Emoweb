import serial
import time

def ler_dados_serial(porta='COM4', baud_rate=9600, timeout=1):
    try:
        # Configura a porta serial
        ser = serial.Serial(porta, baud_rate, timeout=timeout)
        print(f"Conectado à porta {porta}")
        
        time.sleep(2)  # Aguarda a estabilização da conexão

        while True:
            # Lê os dados da porta serial
            if ser.in_waiting > 0:
                dados = ser.readline().decode('utf-8').strip()  # Lê e decodifica os dados
                print(f"Dado recebido: {dados}")

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
