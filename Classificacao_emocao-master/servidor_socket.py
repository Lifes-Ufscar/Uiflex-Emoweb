import asyncio
import websockets
import os
import re
import time

PORT = 3000

async def monitorar_arquivo_e_enviar(websocket):
    arquivo = "resultados_classificacao_sincronizados.txt"
    
    # Garante que o arquivo existe
    if not os.path.exists(arquivo):
        open(arquivo, 'w').close()
    
    # Começa do final do arquivo
    ultima_posicao = os.path.getsize(arquivo)
    
    while True:
        try:
            tamanho_atual = os.path.getsize(arquivo)
            
            # Se o arquivo foi truncado ou rotacionado
            if tamanho_atual < ultima_posicao:
                ultima_posicao = 0
            
            # Se houver novas linhas
            if tamanho_atual > ultima_posicao:
                with open(arquivo, 'r') as f:
                    f.seek(ultima_posicao)
                    novas_linhas = f.readlines()
                    ultima_posicao = f.tell()
                    
                    for linha in novas_linhas:
                        linha = linha.strip()
                        print(f"Processando linha: {linha}")  # Debug
                        
                        # Extrai os dados com regex
                        match = re.search(
                            r'ID_EEG:\s*(\d+).*?'
                            r'ID_GSR_ECG:\s*(\d+).*?'
                            r'Resultado_EEG:\s*(\d+).*?'
                            r'GSR_classificado:\s*\[(\d+)\].*?'
                            r'ECG_classificado:\s*\[(\d+)\]',
                            linha
                        )
                        
                        if match:
                            mensagem = (
                                f"ID_EEG: {match.group(1)}, "
                                f"ID_GSR_ECG: {match.group(2)}, "
                                f"Resultado EEG: {match.group(3)}, "
                                f"GSR: {match.group(4)}, "
                                f"ECG: {match.group(5)}"
                            )
                            
                            try:
                                await websocket.send(mensagem)
                                print(f"Dados enviados: {mensagem}")
                            except websockets.exceptions.ConnectionClosed:
                                print("Cliente desconectado durante envio")
                                return
            
            # Verifica por novas linhas a cada 0.3 segundos
            await asyncio.sleep(0.3)
            
        except Exception as e:
            print(f"Erro no monitoramento: {str(e)}")
            await asyncio.sleep(1)  # Espera antes de tentar novamente

async def handler(websocket, path):
    print(f"Cliente conectado: {websocket.remote_address}")
    try:
        await monitorar_arquivo_e_enviar(websocket)
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado")
    except Exception as e:
        print(f"Erro na conexão: {str(e)}")
    finally:
        print("Conexão encerrada")

async def main():
    async with websockets.serve(handler, "0.0.0.0", PORT):
        print(f"Servidor WebSocket ativo na porta {PORT}")
        await asyncio.Future()  # Executa indefinidamente

if __name__ == "__main__":
    asyncio.run(main())