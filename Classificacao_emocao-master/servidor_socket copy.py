import asyncio
import websockets
import os
import re
import time

PORT = 3000

async def handle_client(websocket, path):
    print(f"Conexão estabelecida com {websocket.remote_address}")
    
    file_path = "resultados_classificacao_sincronizados.txt"
    if not os.path.exists(file_path):
        open(file_path, 'w').close()
        print(f"Arquivo {file_path} criado")
    
    # Começa do final do arquivo
    last_size = os.path.getsize(file_path)
    
    try:
        while True:
            current_size = os.path.getsize(file_path)
            
            if current_size > last_size:
                with open(file_path, 'r') as file:
                    file.seek(last_size)
                    new_lines = file.readlines()
                    last_size = file.tell()
                    
                    for line in new_lines:
                        line = line.strip()
                        print(f"Processando linha: {line}")  # Log para debug
                        
                        # Regex mais flexível
                        match = re.search(
                            r'ID_EEG:\s*(\d+).*?'
                            r'ID_GSR_ECG:\s*(\d+).*?'
                            r'Resultado_EEG:\s*(\d+).*?'
                            r'GSR_classificado:\s*\[(\d+)\].*?'
                            r'ECG_classificado:\s*\[(\d+)\]',
                            line
                        )
                        
                        if match:
                            data = {
                                'id_eeg': match.group(1),
                                'id_gsr_ecg': match.group(2),
                                'resultado_eeg': match.group(3),
                                'gsr': match.group(4),
                                'ecg': match.group(5)
                            }
                            message = (
                                f"ID_EEG: {data['id_eeg']}, "
                                f"ID_GSR_ECG: {data['id_gsr_ecg']}, "
                                f"Resultado EEG: {data['resultado_eeg']}, "
                                f"GSR: {data['gsr']}, "
                                f"ECG: {data['ecg']}"
                            )
                            try:
                                await websocket.send(message)
                                print(f"Enviado: {message}")
                            except:
                                print("Erro ao enviar - cliente desconectado")
                                return
            elif current_size < last_size:
                # Arquivo foi rotacionado/truncado
                last_size = 0
            
            await asyncio.sleep(0.5)  # Intervalo de verificação
            
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado normalmente")
    except Exception as e:
        print(f"Erro na conexão: {type(e).__name__}: {e}")
    finally:
        print("Conexão encerrada")

async def main():
    async with websockets.serve(handle_client, "0.0.0.0", PORT):
        print(f"Servidor WebSocket ativo na porta {PORT}")
        await asyncio.Future()  # Executa indefinidamente

if __name__ == "__main__":
    asyncio.run(main())