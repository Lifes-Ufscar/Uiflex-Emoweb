# -*- coding: utf-8 -*-  # Define a codificação do arquivo como UTF-8

import pandas as pd  # Importa a biblioteca pandas para manipulação de dados
import numpy as np  # Importa a biblioteca NumPy para operações numéricas
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis  # Importa o modelo LDA do scikit-learn
from sklearn.svm import SVC  # Importa o classificador SVM do scikit-learn
import pickle  # Importa a biblioteca pickle para carregar objetos serializados

# Carrega dados de um arquivo Excel
dfeeg = pd.read_excel('Amostras//amostra_ID1_VD1_UI3.xlsx', sheet_name='Sheet1')

# Carrega modelos de classificação e LDA para diferentes bandas de frequência
##### Delta
lda_deltaa = pickle.load(open('dados_classifica//lda_deltaa.sav', 'rb'))
delta_classificador = pickle.load(open('dados_classifica//delta_classificador.sav', 'rb'))
##### Final Delta

##### highAlpha
lda_highAlphaa = pickle.load(open('dados_classifica//lda_highAlphaa.sav', 'rb'))
highAlpha_classificador = pickle.load(open('dados_classifica//highAlpha_classificador.sav', 'rb'))
##### Final highAlpha

######## highBeta
lda_highBetaa = pickle.load(open('dados_classifica//lda_highBetaa.sav', 'rb'))
highBeta_classificador = pickle.load(open('dados_classifica//highBeta_classificador.sav', 'rb'))
####### Fim highBeta

########### lda_lowAlpha
lda_lowAlphaa = pickle.load(open('dados_classifica//lda_lowAlphaa.sav', 'rb'))
lowAlpha_classificador = pickle.load(open('dados_classifica//lowAlpha_classificador.sav', 'rb'))
########## lda_lowAlpha fim

################# lowBeta
lda_lowBetaa = pickle.load(open('dados_classifica//lda_lowBetaa.sav', 'rb'))
lowBeta_classificador = pickle.load(open('dados_classifica//lowBeta_classificador.sav', 'rb'))
################# lowBeta fim

# As seções abaixo estão comentadas, indicando que não estão em uso no momento
'''
################# lowGamma
lda_lowGamma = pickle.load(open('dados_classifica//lda_lowGamma.sav', 'rb'))
lowGamma_classificador = pickle.load(open('dados_classifica//lowGamma_classificador.sav', 'rb'))
################# lowGamma

################ midGamma
lda_midGamma = pickle.load(open('dados_classifica//lda_midGamma.sav', 'rb'))
midGamma_classificador = pickle.load(open('dados_classifica//midGamma_classificador.sav', 'rb'))
################# fim midGamma 
'''

# Extrai uma linha específica do DataFrame, que representa um sinal EEG
sinaldeltat = dfeeg.iloc[3:4, 2:]

# Calcula o tamanho da amostra
tamanhoamostra = sinaldeltat.size

# Remove as duas primeiras colunas do DataFrame original
dfeeg = dfeeg.iloc[:, 2:]

# Define o tamanho da janela de amostragem
aa = 800
i = 0
print("\nTESTE EEG INICIADO\n")

# Loop para processar segmentos do sinal EEG
while aa <= tamanhoamostra:
    # Delta
    sinaldelta = dfeeg.iloc[3:4, i:aa]  # Extrai os dados da linha correspondente à banda Delta
    sinaldelta = sinaldelta.div(sinaldelta.max(axis=1), axis=0)  # Normaliza os dados
    sinaldelta = sinaldelta.values  # Converte para um array NumPy
    sinaldelta = sinaldelta.astype(float)  # Garante que os dados são do tipo float
    
    delta = lda_deltaa.transform(sinaldelta)  # Aplica a transformação LDA
    previsoesdelta = delta_classificador.predict(delta)  # Faz a previsão com o classificador

    # High Alpha
    sinalhighAlpha = dfeeg.iloc[6:7, i:aa]  # Extrai dados da banda High Alpha
    sinalhighAlpha = sinalhighAlpha.div(sinalhighAlpha.max(axis=1), axis=0)  # Normaliza
    sinalhighAlpha = sinalhighAlpha.values  # Converte para array
    sinalhighAlpha = sinalhighAlpha.astype(float)  # Converte para float
    
    highAlpha = lda_highAlphaa.transform(sinalhighAlpha)  # Aplica LDA
    previsoeshighAlpha = highAlpha_classificador.predict(highAlpha)  # Faz a previsão

    # High Beta
    sinalhighBeta = dfeeg.iloc[8:9, i:aa]  # Extrai dados da banda High Beta
    sinalhighBeta = sinalhighBeta.div(sinalhighBeta.max(axis=1), axis=0)  # Normaliza
    sinalhighBeta = sinalhighBeta.values  # Converte para array
    sinalhighBeta = sinalhighBeta.astype(float)  # Converte para float
    
    highBeta = lda_highBetaa.transform(sinalhighBeta)  # Aplica LDA
    previsoeshighBeta = highBeta_classificador.predict(highBeta)  # Faz a previsão

    # Low Alpha
    sinallowAlpha = dfeeg.iloc[5:6, i:aa]  # Extrai dados da banda Low Alpha
    sinallowAlpha = sinallowAlpha.div(sinallowAlpha.max(axis=1), axis=0)  # Normaliza
    sinallowAlpha = sinallowAlpha.values  # Converte para array
    sinallowAlpha = sinallowAlpha.astype(float)  # Converte para float
    
    lowAlpha = lda_lowAlphaa.transform(sinallowAlpha)  # Aplica LDA
    previsoeslowAlpha = lowAlpha_classificador.predict(lowAlpha)  # Faz a previsão

    # Low Beta
    sinallowBeta = dfeeg.iloc[7:8, i:aa]  # Extrai dados da banda Low Beta
    sinallowBeta = sinallowBeta.div(sinallowBeta.max(axis=1), axis=0)  # Normaliza
    sinallowBeta = sinallowBeta.values  # Converte para array
    sinallowBeta = sinallowBeta.astype(float)  # Converte para float
    
    lowBeta = lda_lowBetaa.transform(sinallowBeta)  # Aplica LDA
    previsoeslowBeta = lowBeta_classificador.predict(lowBeta)  # Faz a previsão

    # Calcula a média das previsões de todas as bandas
    total = (previsoesdelta + previsoeshighAlpha + previsoeshighBeta + previsoeslowAlpha + previsoeslowBeta) / 5

    # Imprime as previsões de cada banda
    print("delta", previsoesdelta, "highAlpha", previsoeshighAlpha, "highBeta", previsoeshighBeta, "lowAlpha", previsoeslowAlpha, "lowBeta", previsoeslowBeta)
    
    i = i + 50  # Avança a janela de amostragem
    aa = aa + 50  # Aumenta o tamanho da amostra
    total = 0  # Reseta a variável total para o próximo loop

print("\nTESTE EEG FIM\n")  # Indica que o teste foi concluído
