# -*- coding: utf-8 -*-  # Define a codificação UTF-8 para o arquivo

# Bibliotecas necessárias
from pandas import read_excel  # Para ler dados de arquivos Excel
import numpy as np  # Biblioteca para operações numéricas
from classificadorGSR import ClassificadorGSR  # Classe de classificação para o sinal GSR
from classificadorECG import ClassificadorECG  # Classe de classificação para o sinal ECG
from classificadorEEG import ClassificadorEEG  # Classe de classificação para o sinal EEG
import pickle  # Para carregar modelos treinados serializados
from scipy import signal  # Biblioteca para processar sinais
from matplotlib import pyplot as plt  # Para plotar gráficos

#  -----------------------------------------
# |        Classificador ECG EEG GSR        |
#  -----------------------------------------

# Leitura da amostra do arquivo Excel
df = read_excel('amostras//amostra_Bareta_sid2_f13.xlsx', sheet_name='Sheet1')  # Carrega a planilha de amostras

# Seleção das faixas de dados para os sinais GSR, ECG e EEG a partir da planilha
dfgsr = df.iloc[13:14, 2:202].values  # Extrai dados de GSR (galvanic skin response) das linhas e colunas específicas
dfecg = df.iloc[14:15, 2:]  # Extrai dados de ECG (eletrocardiograma)
dfeeg = df.iloc[0:13, 1:]  # Extrai dados de EEG (eletroencefalograma)

##### Filtros (comentados)
dfgsr = dfgsr.reshape(200, 1)  # Redimensiona os dados de GSR para uma matriz de 200 linhas e 1 coluna

# Trecho de código comentado para aplicação de filtros no sinal GSR

# x = signal.wiener(dfgsr)  # Aplica o filtro de Wiener no sinal GSR
# y = signal.medfilt(dfgsr)  # Aplica o filtro de mediana no sinal GSR

# # Plot dos sinais originais e filtrados
# plt.figure(figsize=(10, 6))
# plt.plot(dfgsr, label='Original signal')  # Sinal original
# plt.plot(y, label='medfilt: median filter')  # Sinal filtrado com mediana
# plt.plot(x, label='wiener: wiener filter')  # Sinal filtrado com Wiener

# plt.legend(loc='best')  # Exibe a legenda dos sinais
# plt.show()  # Mostra o gráfico


# Inicializa variáveis para controle da amostragem dos sinais
tamanhoamostragsr = dfgsr.size  # Define o tamanho do sinal GSR (quantidade de amostras)
a = 100  # Tamanho da janela de amostragem (inicialmente 3000)
i = 0  # Índice inicial para amostragem do GSR
ecga = 1020  # Tamanho da janela de ECG
ecgi = 0  # Índice inicial para amostragem do ECG
intervalo = 0  # Contador de intervalos processados
print("\nTESTE INICIADO\n")  # Indica o início do processo de classificação

# Loop principal para processar as amostras de GSR, ECG e EEG
while (a <= tamanhoamostragsr):  # Enquanto o tamanho da janela não exceder o total de amostras

    print("\nIntervalo ", intervalo)  # Exibe o número do intervalo sendo processado

    # GSR
    amostrasgsr = dfgsr[i:a]  # Extrai o segmento do sinal GSR correspondente ao intervalo atual
    print("amostra",amostrasgsr)
    classeGSR = ClassificadorGSR(amostrasgsr)  # Cria uma instância do classificador GSR com as amostras
    GSR = classeGSR.classificador_gsr()  # Realiza a classificação do GSR
    print("Resultado GSR: ", GSR)  # Exibe o resultado da classificação

    # ECG
    amostrasecg = dfecg.iloc[:, ecgi:ecga].values  # Extrai o segmento do sinal ECG
    classeECG = ClassificadorECG(amostrasecg)  # Cria uma instância do classificador ECG
    ECG = classeECG.classificador_ecg()  # Realiza a classificação do ECG
    print("Resultado ECG: ", ECG)  # Exibe o resultado da classificação

    # EEG (extração dos diferentes tipos de ondas cerebrais)
    sinaldelta = dfeeg.iloc[3:4, i:a].values  # Extrai o sinal EEG da banda Delta
    sinaltheta = dfeeg.iloc[4:5, i:a].values  # Extrai o sinal EEG da banda Theta
    sinallowAlpha = dfeeg.iloc[5:6, i:a].values  # Extrai o sinal EEG da banda Low Alpha
    sinalhighAlpha = dfeeg.iloc[6:7, i:a].values  # Extrai o sinal EEG da banda High Alpha
    sinallowBeta = dfeeg.iloc[7:8, i:a].values  # Extrai o sinal EEG da banda Low Beta
    sinalhighBeta = dfeeg.iloc[8:9, i:a].values  # Extrai o sinal EEG da banda High Beta
    sinallowGamma = dfeeg.iloc[9:10, i:a].values  # Extrai o sinal EEG da banda Low Gamma
    sinalmidGamma = dfeeg.iloc[10:11, i:a].values  # Extrai o sinal EEG da banda Mid Gamma

    print(sinaldelta.__len__)

    # Cria uma instância do classificador EEG com todas as bandas de sinal
    classeEEG = ClassificadorEEG(sinaldelta,
                                 sinalhighAlpha, sinalhighBeta,
                                 sinallowAlpha, sinallowBeta,
                                 sinallowGamma, sinalmidGamma,
                                 sinaltheta)
    EEG = classeEEG.classificador_eeg()  # Realiza a classificação do EEG
    print("Resultado EEG: ", EEG)  # Exibe o resultado da classificação

    # Atualiza os índices e o intervalo para a próxima iteração
    i = i + 500  # Avança a janela de GSR
    a = a + 500  # Aumenta o tamanho da janela de GSR
    ecgi = ecgi + 500  # Avança a janela de ECG
    ecga = ecga + 500  # Aumenta o tamanho da janela de ECG
    intervalo = intervalo + 1  # Incrementa o número do intervalo
