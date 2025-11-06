# -*- coding: utf-8 -*-

'''
    Autor: Isaque Elcio

    Descrição: 
        Classificação dos dados presentes em planilhas excel de amostras para os sinais fisiológico GSR, EEG, ECG.
        
        Cada um dos sinais significa:
            - EEG (eletroencefalograma): mede a atividade cerebral informando a produção de ondas beta, alfa e teta;
        
            - ECG (eletrocardiograma): mede a atividade elétrica do coração;
        
            - GSR (resposta galvânica da pele): mede a atividade elétrica das glândulas que produzem suor nas palmas
                                                das mãos e pontas dos dedos, mais sensíveis às emoções e pensamentos.
'''

# Bibliotecas
from pandas import read_excel
import numpy as np
import pandas as pd
from classificadorGSR import ClassificadorGSR  # LDA e Classificador GSR
from classificadorECG import ClassificadorECG  # LDA e Classificador ECG
from classificadorEEG import ClassificadorEEG  # LDA e Classificador EEG
import pickle


#  ----------------------------------
# |               GSR               |
#  ---------------------------------
# Leitura das amostras
df = read_excel('amostras//amostra_ID2_VD2_UI1.xlsx', sheet_name = 'Sheet1')

# dfgsr = df.iloc[13:14, 1:]

# tamanhoamostra = dfgsr.size
# a = 3000
# i = 0
# print("\nTESTE GSR INICIADO\n")
# while a <= tamanhoamostra :
           
#     amostrasgsr = dfgsr.iloc[: , i:a].values  
#     print("i --", i)
#     print("a --", a)
    
    
#     classeGSR = ClassificadorGSR(amostrasgsr)
#     GSR = classeGSR.classificador_gsr()
        
#     print("Resultado GSR###:", GSR)
    
#     i= i+500
#     a = a+500

# print("\nTESTE GSR FINALIZADO\n")
    
# # Teste
# '''
# print("\nTESTE GSR INICIADO\n")
# for i in range(0, 4):
#     teste = [x[i]]
#     classeGSR = ClassificadorGSR(teste)
#     GSR = classeGSR.classificador_gsr()
#     print("i:", i)
#     print("Resultado GSR:", GSR)
# print("\nTESTE GSR FINALIZADO\n")
# '''

# #  ----------------------------------
# # |               ECG               |
# #  ---------------------------------
# dfecg = df.iloc[14:15, 5:]

# dfecg = dfecg.replace(to_replace=r'_x000D_\n', value='', regex=True)

# dfecg = dfecg.apply(pd.to_numeric, errors='coerce')
# dfecg = dfecg.dropna(axis=1)

# print(dfecg)

# tamanhoamostra = dfecg.size
# a = 1020
# i = 0
# print("\nTESTE ECG INICIADO\n")
# while a <= tamanhoamostra :
           
#     amostrasecg = dfecg.iloc[: , i:a].values  
#     print("i --", i)
#     print("a --", a)
#     print("Intervalo", amostrasecg.size)
#     classeECG = ClassificadorECG(amostrasecg)
#     ECG = classeECG.classificador_ecg()
    
#     print("Resultado ECG###:", ECG)
    
#     i= i+500
#     a = a+500
    
# print("\nTESTE ECG FINALIZADO\n")
# '''
# # Leitura das amostras
# df = read_excel("dadosECG//amostras_ECG.xlsx", sheet_name = "Planilha1")
# x  = df.values

# # Teste
# print("\nTESTE ECG INICIADO\n")
# for i in range(0, 4):
#     teste = [x[i]]
#     classeECG = ClassificadorECG(teste)
#     ECG = classeECG.classificador_ecg()
#     print("i:", i)
#     print("Resultado ECG:", ECG)
# print("\nTESTE ECG FINALIZADO\n")
# '''

#  ----------------------------------
# |               EEG               |
#  ---------------------------------
dfeeg = df.iloc[0:13, 1:]

tamanhoamostra = dfeeg.shape[1]
aa = 500
i = 0
print("\nTESTE EEG INICIADO\n")
while aa <= tamanhoamostra:
    sinaldelta = dfeeg.iloc[3:4, i:aa].values
    sinaltheta = dfeeg.iloc[4:5, i:aa].values
    sinallowAlpha = dfeeg.iloc[5:6, i:aa].values
    sinalhighAlpha = dfeeg.iloc[6:7, i:aa].values
    sinallowBeta = dfeeg.iloc[7:8, i:aa].values
    sinalhighBeta = dfeeg.iloc[8:9, i:aa].values
    sinallowGamma = dfeeg.iloc[9:10, i:aa].values
    sinalmidGamma = dfeeg.iloc[10:11, i:aa].values

    print(sinaldelta)
    print(sinalhighAlpha)
    print(sinalhighBeta)
    print(sinallowAlpha)
    print(sinallowBeta)
    print(sinallowGamma)
    print(sinalmidGamma)
    print(sinaltheta)

    print("i --", i)
    print("a --", aa)
    print("Intervalo", sinaldelta.size)

    lda_delta = pickle.load(open('dadosEEG//lda_eeg_delta.sav', 'rb'))
    lda_highAlpha = pickle.load(open('dadosEEG//lda_eeg_highAlpha.sav', 'rb'))
    lda_highBeta = pickle.load(open('dadosEEG//lda_eeg_highBeta.sav', 'rb'))
    lda_lowAlpha = pickle.load(open('dadosEEG//lda_eeg_lowAlpha.sav', 'rb'))
    lda_lowBeta = pickle.load(open('dadosEEG//lda_eeg_lowBeta.sav', 'rb'))
    lda_lowGamma = pickle.load(open('dadosEEG//lda_eeg_lowGamma.sav', 'rb'))
    lda_midGamma = pickle.load(open('dadosEEG//lda_eeg_midGamma.sav', 'rb'))
    lda_theta = pickle.load(open('dadosEEG//lda_eeg_theta.sav', 'rb'))

    try:
        a = lda_delta.transform(sinaldelta)
        b = lda_highAlpha.transform(sinalhighAlpha)
        c = lda_highBeta.transform(sinalhighBeta)
        d = lda_lowAlpha.transform(sinallowAlpha)
        e = lda_lowBeta.transform(sinallowBeta)
        f = lda_lowGamma.transform(sinallowGamma)
        g = lda_midGamma.transform(sinalmidGamma)
        h = lda_theta.transform(sinaltheta)
    except ValueError as ve:
        print(f"Erro ao transformar os dados: {ve}")
        break

    dfc = np.concatenate([a, b, c, d, e, f, g, h], axis=1)  # Usando np.concatenate para unir arrays

    classificador_svm_eeg = pickle.load(open('dadosEEG//svm_eeg_sinais.sav', 'rb'))
    EEG = classificador_svm_eeg.predict(dfc)
    
    print("Resultado EEG###:", EEG)
    
    i += 500
    aa += 500

print("\nTESTE EEG FINALIZADO\n")


# Leitura das amostras
'''
delta = read_excel("dadosEEG//amostras_delta.xlsx", sheet_name = "Sheet1")
delta = delta.values

highAlpha = read_excel("dadosEEG//amostras_highAlpha.xlsx", sheet_name = "Sheet1")
highAlpha = highAlpha.values

highBeta = read_excel("dadosEEG//amostras_highBeta.xlsx", sheet_name = "Sheet1")
highBeta = highBeta.values

lowAlpha = read_excel("dadosEEG//amostras_lowAlpha.xlsx", sheet_name = "Sheet1")
lowAlpha = lowAlpha.values

lowBeta = read_excel("dadosEEG//amostras_lowBeta.xlsx", sheet_name = "Sheet1")
lowBeta = lowBeta.values

lowGamma = read_excel("dadosEEG//amostras_lowGamma.xlsx", sheet_name = "Sheet1")
lowGamma = lowGamma.values

midGamma = read_excel("dadosEEG//amostras_midGamma.xlsx", sheet_name = "Sheet1")
midGamma = midGamma.values

theta = read_excel("dadosEEG//amostras_theta.xlsx", sheet_name = "Sheet1")
theta = theta.values

# Teste
print("\nTESTE EEG INICIADO\n")
for i in range(0, 4):
    sinaldelta     = [delta[i]]  
    sinalhighAlpha = [highAlpha[i]] 
    sinalhighBeta  = [highBeta[i]]  
    sinallowAlpha  = [lowAlpha[i]]  
    sinallowBeta   = [lowBeta[i]]  
    sinallowGamma  = [lowGamma[i]]  
    sinalmidGamma  = [midGamma[i]] 
    sinaltheta     = [theta[i]] 
    
    classeEEG = ClassificadorEEG(sinaldelta, 
                                 sinalhighAlpha, sinalhighBeta,
                                 sinallowAlpha,  sinallowBeta,
                                 sinallowGamma,  sinalmidGamma,
                                 sinaltheta)
    
    EEG = classeEEG.classificador_eeg()
    print("i:", i)
    print("Resultado EEG:", EEG)
    
print("\nTESTE EEG FINALIZADO\n")
'''

