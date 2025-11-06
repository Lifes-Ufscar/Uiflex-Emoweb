import numpy as np
import os
import time
import pickle
from scipy.signal import butter, filtfilt, wiener
from multiprocessing import Pool
from classificadorGSR import ClassificadorGSR
from classificadorECG import ClassificadorECG
from concurrent.futures import ThreadPoolExecutor
import queue

sync_queue = queue.Queue()

with open('resultados_classificacao_sincronizados.txt', 'w') as file:
    pass
with open('resultados_dados_eeg_filtrados.txt', 'w') as file:
    pass

# ___________________GSR E ECG (MODIFICADO PARA TRATAR IDs)_____________________________
def ler_todos_dados(arquivo):
    """Lê os dados do arquivo incluindo os IDs"""
    with open(arquivo, 'r') as file:
        return file.readlines()

def extrair_id_e_dados(linha):
    partes = linha.strip().split(',')
    try:
        id_part = partes[0].split('ID: ')[1].strip()
        current_id = int(id_part)
        print(f"Extraído ID: {current_id}")  # Debugging aqui
        gsr = float(partes[2].split(':')[1].strip())  
        ecg = float(partes[5].split(':')[1].strip())  
        return current_id, gsr, ecg, linha
    except Exception as e:
        print(f"Erro ao extrair dados da linha: {linha}. Erro: {e}")
        return None, None, None, None

def processar_dados_lote(dados):
    """Processa um lote de dados mantendo os IDs"""
    resultados = []
    
    for linha in dados:
        current_id, gsr, ecg, linha_original = extrair_id_e_dados(linha)
        if current_id is None:
            continue
            
        # Verifica se o ID está pulando
        if resultados and current_id < resultados[-1][0]:  
            print(f"⚠️ ID retornou para trás! ID atual: {current_id}, Último ID: {resultados[-1][0]}")

        # Processamento normal
        try:
            classificador_gsr = ClassificadorGSR(np.array([[gsr]]))
            resultado_gsr = classificador_gsr.classificador_gsr()
        except Exception as e:
            resultado_gsr = "ERRO"
        
        try:
            classificador_ecg = ClassificadorECG(np.array([[ecg]]))
            resultado_ecg = classificador_ecg.classificador_ecg()
        except Exception as e:
            resultado_ecg = "ERRO"
        
        resultados.append((current_id, linha_original, resultado_gsr, resultado_ecg))
    
    return resultados


def salvar_classificacoes(arquivo, resultados):
    resultados = sorted(resultados, key=lambda x: x[0])

    with open(arquivo, 'a') as file:
        last_id = None
        for current_id, linha_original, gsr, ecg in resultados:
            if last_id and current_id < last_id:
                print(f"⚠️ ID {current_id} menor que o anterior {last_id} ao salvar! Verifique a lógica.")
            
            timestamp = time.strftime("%H:%M:%S")
            partes = linha_original.strip().split(',')
            try:
                timestamp_original = partes[1].strip()
                gsr_filtrados = partes[2].split(':')[1].strip()
                ecg_filtrados = partes[5].split(':')[1].strip()
                
                linha_resultado = (
                    f"ID: {current_id}, "
                    f"Timestamp: {timestamp_original}, "
                    f"GSR_filtrado: {gsr_filtrados}, "
                    f"ECG_filtrado: {ecg_filtrados}, "
                    f"Classificacao_em: {timestamp}, "
                    f"GSR_classificado: {gsr}, "
                    f"ECG_classificado: {ecg}\n"
                )
                file.write(linha_resultado)
                last_id = current_id  # Mantém o controle do último ID salvo
            except Exception as e:
                print(f"Erro ao formatar resultado (ID {current_id}): {e}")


# ___________________EEG_____________________________
def bandpass_filter(data, lowcut, highcut, fs, order=2):
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)

def processar_eeg(canais_eeg, fs=250):
    bandas_eeg = {}
    num_amostras = len(canais_eeg[0]) if canais_eeg else 0

    pode_filtrar = num_amostras > 15

    for i, canal in enumerate(canais_eeg):
        try: 
            eeg_filtered = wiener(canal)
            if not np.all(np.isfinite(eeg_filtered)):
                raise ValueError("Valores não finitos após filtro de Wiener")

            bandas = {
                'delta': (0.5, 4),
                'theta': (4, 8),
                'lowAlpha': (8, 10),
                'highAlpha': (10, 13),
                'lowBeta': (13, 20),
                'highBeta': (20, 30),
                'lowGamma': (30, 40),
                'midGamma': (40, 50),
            }

            for banda, (low, high) in bandas.items():
                try:
                    if pode_filtrar: 
                        bandas_eeg[f'canal_{i}_{banda}'] = bandpass_filter(eeg_filtered, low, high, fs)
                    else:
                        print(f"Dados insuficientes para filtragem da banda {banda} (apenas {num_amostras} amostras)")
                except Exception as e:
                    print(f"Erro ao filtrar banda {banda} no canal {i} : {e}")
                    bandas_eeg[f'canal_{i}_{banda}'] = np.zeros_like(eeg_filtered)
        except Exception as e:
            print(f"Erro grave no canal {i}: {e}")

            for banda in bandas.keys():
                bandas_eeg[f'canal_{i}_{banda}'] = np.zeros_like(canal)

    return bandas_eeg

# ___________________SINCRONIZADOR_____________________________
def sincronizar_e_salvar():
    buffer_eeg = {}
    buffer_gsr_ecg = {}
    
    while True:
        try:
            tipo, dados = sync_queue.get(timeout=1)
            
            if tipo == 'EEG':
                buffer_eeg[dados['id_bloco']] = dados
            elif tipo == 'GSR_ECG':
                # Usa contador interno para sincronização
                id_sequencial = len(buffer_gsr_ecg) + 1
                buffer_gsr_ecg[id_sequencial] = {
                    'id_original': dados['id_gsr_ecg'],
                    'timestamp': dados['timestamp'],
                    'gsr': dados['gsr'],
                    'ecg': dados['ecg'],
                    'resultado_gsr': dados['resultado_gsr'],
                    'resultado_ecg': dados['resultado_ecg']
                }
            
            # Processa os pares disponíveis
            for id_gsr_ecg in list(buffer_gsr_ecg.keys()):

                id_bloco_eeg = ((id_gsr_ecg - 1) // 20) * 20 + 1
                id_original = buffer_gsr_ecg[id_gsr_ecg]['id_original']

                for eeg_keys, eeg_datas in buffer_eeg.items():
                    if eeg_datas['id_bloco'] <= id_original < eeg_datas['id_bloco'] + 20:
                        
                        gsr_ecg_data = buffer_gsr_ecg[id_gsr_ecg]
                    
                        # Só processa se o EEG tiver dados válidos
                        if eeg_datas['resultado_eeg'] != -1:
                            
                            with open('resultados_classificacao_sincronizados.txt', 'a') as file:
                                linha = (
                                    f"ID_EEG: {eeg_datas['id_bloco']}, "
                                    f"ID_GSR_ECG: {gsr_ecg_data['id_original']}, "
                                    f"Timestamp: {gsr_ecg_data['timestamp']}, "
                                    f"Resultado_EEG: {eeg_datas['resultado_eeg']}, "
                                    f"GSR: {gsr_ecg_data['gsr']}, "
                                    f"ECG: {gsr_ecg_data['ecg']}, "
                                    f"GSR_classificado: {gsr_ecg_data['resultado_gsr']}, "
                                    f"ECG_classificado: {gsr_ecg_data['resultado_ecg']}, "
                                    f"Amostras_EEG: {eeg_datas.get('amostras_validas', 20)}\n"
                                )
                                file.write(linha)
                        
                        # Remove os dados processados
                        del buffer_gsr_ecg[id_gsr_ecg]
                        
                        
                        ultimo_id_bloco = eeg_datas['id_bloco'] + eeg_datas['amostras_validas'] - 1
                        if not any(gsr_id <= ultimo_id_bloco for gsr_id in buffer_gsr_ecg.keys()):
                            del buffer_eeg[id_bloco_eeg]
                        
        except queue.Empty:
            time.sleep(0.1)
            continue
        except Exception as e:
            print(f"Erro ao sincronizar os dados: {e}")
            time.sleep(1)

def salvar_dados_filtrados_eeg(bandas_eeg, ids_brutos, timestamp_inicio):
    timestamp_fim = time.strftime("%H:%M:%S")
    with open('resultados_dados_eeg_filtrados.txt', 'a') as file:
        # Cabeçalho do bloco de 20 amostras
        file.write(f"=== Bloco de IDs: {ids_brutos[0]} a {ids_brutos[-1]} ===\n")
        file.write(f"Timestamp Inicio: {timestamp_inicio}, Timestamp Fim: {timestamp_fim}\n\n")
        
        # Para cada banda, salva todos os 20 valores de cada canal
        for banda in ['delta', 'theta', 'lowAlpha', 'highAlpha', 'lowBeta', 'highBeta', 'lowGamma', 'midGamma']:
            file.write(f"{banda}:\n")
            for canal_idx in range(4):  # Para cada canal (0 a 3)
                valores = []
                for sample_idx in range(20):  # Para cada amostra no bloco
                    chave = f'canal_{canal_idx}_{banda}'
                    valores.append(f"{bandas_eeg[chave][sample_idx]:.8f}")
                file.write(f"  Canal_{canal_idx}: [{', '.join(valores)}]\n")
            file.write("\n")
        file.write("="*50 + "\n\n")  # Separador entre blocos

# ___________________FUNÇÕES AUXILIARES (MANTIDAS)_____________________________
def extrair_id_e_dados(linha):
    partes = linha.strip().split(',')
    try:
        id_part = partes[0].split('ID: ')[1].strip()
        current_id = int(id_part)
        gsr = float(partes[2].split(':')[1].strip())
        ecg = float(partes[5].split(':')[1].strip())
        return current_id, gsr, ecg, linha
    except Exception as e:
        print(f"Erro ao extrair dados da linha: {linha}. Erro: {e}")
        return None, None, None, None

def ler_dados_brutos(arquivo, ultima_linha_processada, max_amostras=20):
    if not os.path.exists(arquivo):
        print(f"Erro: arquivo {arquivo} não encontrado!")
        return None, [], ultima_linha_processada, []

    dados_brutos = []
    ids_brutos = []
    raw_data = []
    with open(arquivo, 'r') as file:
        for i, linha in enumerate(file):
            if i < ultima_linha_processada:
                continue
                
            try:
                partes = linha.strip().split(", Dados brutos EEG: ")
                if len(partes) != 2:
                    continue
                    
                id_str = partes[0].split("ID: ")[1].split(",")[0]
                dados = eval(partes[1])

                if len(dados) != 4:
                    print(f"Dados inválidos no ID {id_str}: número de canais incorreto")
                    continue

                ids_brutos.append(int(id_str))
                dados_brutos.append(dados)
                raw_data.append(partes[1])
                
                # Processa mesmo que não tenha 20 amostras
                if len(dados_brutos) >= max_amostras or (len(dados_brutos) >= 16 and not any(file)):
                    break
                    
            except Exception as e:
                print(f"Erro ao processar linha {i}: {linha}. Detalhes: {e}")
                continue

    ultima_linha_processada = i + 1 if dados_brutos else ultima_linha_processada
    
    if not dados_brutos:
        print("Nenhum dado EEG novo encontrado.")
        time.sleep(1)
        return None, [], ultima_linha_processada, []

    return np.array(dados_brutos).T, ids_brutos, ultima_linha_processada, raw_data

def salvar_resultados(arquivo, id_bruto, dados_processados, resultados_eeg):
    timestamp_classificacao = time.strftime("%H:%M:%S")
    print(f"Salvando resultados do ID {id_bruto} no arquivo...")

    # Desempacota os dados processados
    delta, lowAlpha, highAlpha, lowBeta, highBeta, lowGamma, midGamma, theta = dados_processados
    
    # Converte arrays para strings compactas em uma única linha
    def format_array(arr):
        return '[' + ' '.join([f"{x:.8f}" for x in arr.flatten()]) + ']'

    with open(arquivo, 'a') as file:
        linha = (
            f"ID: {id_bruto}, "
            f"Classificacao realizada em: {timestamp_classificacao}, "
            f"Delta: {format_array(delta)}, "
            f"LowAlpha: {format_array(lowAlpha)}, "
            f"HighAlpha: {format_array(highAlpha)}, "
            f"LowBeta: {format_array(lowBeta)}, "
            f"HighBeta: {format_array(highBeta)}, "
            f"LowGamma: {format_array(lowGamma)}, "
            f"MidGamma: {format_array(midGamma)}, "
            f"Theta: {format_array(theta)}, "
            f"Resultado EEG: {resultados_eeg[0] if isinstance(resultados_eeg, (list, np.ndarray)) else resultados_eeg}\n"
        )
        file.write(linha)

    print(f"Resultados do ID {id_bruto} salvos no arquivo.")

# ___________________PROCESSAMENTO PARALELO (MANTIDO)_____________________________
def processar_gsr_ecg(arquivo_dados):
    ultima_linha_processada = 0
    
    while True:
        linhas = []
        with open(arquivo_dados, 'r') as file:
            for i, linha in enumerate(file):
                if i >= ultima_linha_processada:
                    linhas.append(linha)
        
        if not linhas:
            time.sleep(0.1)
            continue
            
        for linha in linhas:
            try:
                partes = linha.strip().split(',')
                current_id = int(partes[0].split('ID: ')[1].strip())
                timestamp = partes[1].split('Timestamp: ')[1].strip()
                gsr = float(partes[2].split('GSR_filtrado: ')[1].strip())
                ecg = float(partes[5].split('ECG_filtrado: ')[1].strip())
                
                # Classifica GSR
                classificador_gsr = ClassificadorGSR(np.array([[gsr]]))
                resultado_gsr = classificador_gsr.classificador_gsr()
                
                # Classifica ECG
                classificador_ecg = ClassificadorECG(np.array([[ecg]]))
                resultado_ecg = classificador_ecg.classificador_ecg()
                
                # Coloca na fila de sincronização
                sync_queue.put(('GSR_ECG', {
                    'id_gsr_ecg': current_id,
                    'timestamp': timestamp,
                    'gsr': gsr,
                    'ecg': ecg,
                    'resultado_gsr': resultado_gsr,
                    'resultado_ecg': resultado_ecg
                }))
                
            except Exception as e:
                print(f"Erro ao processar linha GSR/ECG: {linha}. Erro: {e}")
        
        ultima_linha_processada += len(linhas)


def processar_eeg_sincronizado(arquivo_dados_brutos):
    ultima_linha_processada = 0
    batch_size = 20
    min_amostras = 16 #minimo de dados para filtragem dos canais

    try:
        lda_models = {
            'delta': pickle.load(open('dadosEEG//lda_eeg_delta.sav', 'rb')),
            'highAlpha': pickle.load(open('dadosEEG//lda_eeg_highAlpha.sav', 'rb')),
            'lowAlpha': pickle.load(open('dadosEEG//lda_eeg_lowAlpha.sav', 'rb')),
            'highBeta': pickle.load(open('dadosEEG//lda_eeg_highBeta.sav', 'rb')),
            'lowBeta': pickle.load(open('dadosEEG//lda_eeg_lowBeta.sav', 'rb')),
            'midGamma': pickle.load(open('dadosEEG//lda_eeg_midGamma.sav', 'rb')),
            'lowGamma': pickle.load(open('dadosEEG//lda_eeg_lowGamma.sav', 'rb')),
            'theta': pickle.load(open('dadosEEG//lda_eeg_theta.sav', 'rb')),
        }
        classificador_svm_eeg = pickle.load(open('dadosEEG//svm_eeg_sinais.sav', 'rb'))
    
    except Exception as e:
        print(f"Falha ao carregar modelos: {e}")
        return

    while True:
        timestamp_inicio = time.strftime("%H:%M:%S")
        dados_eeg, ids_brutos, ultima_linha_processada, raw_data = ler_dados_brutos(
            arquivo_dados_brutos, ultima_linha_processada, max_amostras=batch_size)
            
        print(f"IDs Brutos recebidos, {ids_brutos}")
        if dados_eeg is None or dados_eeg.shape[1] == 0:
            time.sleep(0.1)
            continue

        if len(ids_brutos) < batch_size:
            print(f"Bloco incompleto de EEG (apenas {len(ids_brutos)} amostras, era esperado {batch_size})")
            if len(ids_brutos) < min_amostras:
                print(f"Aguardando mais amostras (mínimo {min_amostras})")
                time.sleep(0.5)
                continue

        if np.any(np.isnan(dados_eeg)) or np.any(np.isinf(dados_eeg)):
            print(f"Dados inválidos encontrados no bloco {ids_brutos[0]}")
            ultima_linha_processada += batch_size
            continue

        canais_eeg = [dados_eeg[i] for i in range(dados_eeg.shape[0])]
        bandas_eeg = processar_eeg(canais_eeg)

        # Salva os dados filtrados em paralelo
        with ThreadPoolExecutor(max_workers=1) as executor:
            executor.submit(salvar_dados_filtrados_eeg, bandas_eeg.copy(), ids_brutos, timestamp_inicio)

        try:
            todos_resultados = []
            for i in range(len(canais_eeg)):
                delta = bandas_eeg[f'canal_{i}_delta'].reshape(-1, 1)
                highAlpha = bandas_eeg[f'canal_{i}_highAlpha'].reshape(-1, 1)
                lowAlpha = bandas_eeg[f'canal_{i}_lowAlpha'].reshape(-1, 1)
                highBeta = bandas_eeg[f'canal_{i}_highBeta'].reshape(-1, 1)
                lowBeta = bandas_eeg[f'canal_{i}_lowBeta'].reshape(-1, 1)
                midGamma = bandas_eeg[f'canal_{i}_midGamma'].reshape(-1, 1)
                lowGamma = bandas_eeg[f'canal_{i}_lowGamma'].reshape(-1, 1)
                theta = bandas_eeg[f'canal_{i}_theta'].reshape(-1, 1)

                a = lda_models['delta'].transform(delta)
                b = lda_models['highAlpha'].transform(highAlpha)
                c = lda_models['lowAlpha'].transform(lowAlpha)
                d = lda_models['highBeta'].transform(highBeta)
                e = lda_models['lowBeta'].transform(lowBeta)
                f = lda_models['midGamma'].transform(midGamma)
                g = lda_models['lowGamma'].transform(lowGamma)
                h = lda_models['theta'].transform(theta)

                dfc = np.concatenate([a, b, c, d, e, f, g, h], axis=1)
                EEG = classificador_svm_eeg.predict(dfc)
                todos_resultados.append(EEG[0])

            id_base = ids_brutos[0] if ids_brutos else 1
            resultado_final = int(round(np.mean(todos_resultados))) if todos_resultados else -1
            timestamp = time.strftime("%H:%M:%S")

            # Coloca na fila de sincronização
            sync_queue.put(('EEG', {
                'id_eeg': id_base,
                'timestamp': timestamp,
                'resultado_eeg': resultado_final,
                'amostras_validas': len(ids_brutos),
                'id_bloco': ids_brutos[0]
            }))

        except Exception as ex:
            print(f"Erro durante o processamento EEG: {ex}")

            # Coloca na fila de sincronização
            sync_queue.put(('EEG', {
                'id_eeg': id_base,
                'timestamp': timestamp,
                'resultado_eeg': -1,
                'amostras_validas': 0,
                'id_bloco': 10
            }))

        time.sleep(0.1)

# ___________________MAIN_____________________________
def main():
    arquivo_dados_brutos = 'eeg_data.txt'
    arquivo_dados = 'dados_arduino_filtrados.txt'

    # Verifica se os arquivos de entrada existem
    if not os.path.exists(arquivo_dados_brutos):
        print(f"Erro: Arquivo EEG {arquivo_dados_brutos} não encontrado!")
        return
    if not os.path.exists(arquivo_dados):
        print(f"Erro: Arquivo GSR/ECG {arquivo_dados} não encontrado!")
        return

    print("Iniciando processamento...")
    print("Pressione Ctrl+C para encerrar")

    with ThreadPoolExecutor(max_workers=3) as executor:
        executor.submit(processar_eeg_sincronizado, arquivo_dados_brutos)
        executor.submit(processar_gsr_ecg, arquivo_dados)
        executor.submit(sincronizar_e_salvar)

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nEncerrando...")

if __name__ == "__main__":
    main()
