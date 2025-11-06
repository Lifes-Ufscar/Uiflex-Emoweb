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
import pandas as pd
import numpy as np
from sklearn.preprocessing import normalize
from classificadorGSR import ClassificadorGSR  # LDA e Classificador GSR
from classificadorECG import ClassificadorECG  # LDA e Classificador ECG
from classificadorEEG import ClassificadorEEG  # LDA e Classificador EEG
import pickle



# Leitura das amostras
df = pd.read_excel('amostras//amostra_ID1_VD4_UI1.xlsx', sheet_name = 'Sheet1')


#  ----------------------------------
# |               GSR               |
#  ---------------------------------

dfgsr = df.iloc[13:14, 1:]

tamanhoamostra = dfgsr.size
a = 3000
i = 0
print("\nTESTE GSR INICIADO\n")
while a <= tamanhoamostra :
           
    amostrasgsr = dfgsr.iloc[: , i:a].values  
    amostrasgsr = normalize(amostrasgsr, norm='l2', axis=1)
    #print("i --", i)
    #print("a --", a)
    #print("Intervalo", amostrasgsr.size)
    
    
    classeGSR = ClassificadorGSR(amostrasgsr)
    GSR = classeGSR.classificador_gsr()
        
    print("GSR", GSR)
    #print("i ###:", i)
    i= i+200
    a = a+200
    
i = 0
a = 0
print("\nTESTE GSR FINALIZADO\n")
'''   

#  ----------------------------------
# |               ECG               |
#  ---------------------------------
'''
dfecg = df.iloc[14:15, 5:]

tamanhoamostra = dfecg.size
a = 1020
i = 0
print("\nTESTE ECG INICIADO\n")
while a <= tamanhoamostra :
           
    amostrasecg = dfecg.iloc[: , i:a].values  
    #print("i --", i)
    #print("a --", a)
    #print("Intervalo", amostrasgsr.size)
    classeECG = ClassificadorECG(amostrasecg)
    ECG = classeECG.classificador_ecg()
    
    print("ECG", ECG)
    
    i= i+500
    a = a+500
    
print("\nTESTE ECG FINALIZADO\n")

'''
#  ----------------------------------
# |               EEG               |
#  ---------------------------------

dfeeg = df.iloc[0:13, 2:]

sinaldelta = dfeeg.iloc[3:4, 1:].values


sinaltheta = dfeeg.iloc[4:5, 1:]
sinallowAlpha = dfeeg.iloc[5:6, 1:]
sinalhighAlpha = dfeeg.iloc[6:7, 1:]
sinallowBeta = dfeeg.iloc[7:8, 1:]
sinalhighBeta = dfeeg.iloc[8:9, 1:]
sinallowGamma = dfeeg.iloc[9:10, 1:]
sinalmidGamma = dfeeg.iloc[10:11, 1:]

tamanhoamostra = sinaldelta.size

aa = 3000
i = 0
print("\nTESTE EEG INICIADO\n")
while aa <= tamanhoamostra :
           
    #amostraseeg = dfeeg.iloc[: , i:a].values 
    
    sinaldelta = dfeeg.iloc[3:4, i:aa].values
    sinaldelta = sinaldelta.astype(float)
    sinaldelta = normalize(sinaldelta, norm='l2', axis=0)
    
    sinaltheta = dfeeg.iloc[4:5, i:aa].values
    sinaltheta = sinaltheta.astype(float)
    sinaltheta = normalize(sinaltheta, norm='l2', axis=0)
    
    sinallowAlpha = dfeeg.iloc[5:6, i:aa].values
    sinallowAlpha = sinallowAlpha.astype(float)
    sinallowAlpha = normalize(sinallowAlpha, norm='l2', axis=0)
    
    sinalhighAlpha = dfeeg.iloc[6:7, i:aa].values
    sinalhighAlpha = sinalhighAlpha.astype(float)
    sinalhighAlpha = normalize(sinalhighAlpha, norm='l2', axis=0)
    
    sinallowBeta = dfeeg.iloc[7:8, i:aa].values
    sinallowBeta = sinallowBeta.astype(float)
    sinallowBeta = normalize(sinallowBeta, norm='l2', axis=0)
    
    sinalhighBeta = dfeeg.iloc[8:9, i:aa].values
    sinalhighBeta = sinalhighBeta.astype(float)
    sinalhighBeta = normalize(sinalhighBeta, norm='l2', axis=0)
    
    sinallowGamma = dfeeg.iloc[9:10, i:aa].values
    sinallowGamma = sinallowGamma.astype(float)
    sinallowGamma = normalize(sinallowGamma, norm='l2', axis=0)
    
    sinalmidGamma = dfeeg.iloc[10:11, i:aa].values
    sinalmidGamma = sinalmidGamma.astype(float)
    sinalmidGamma = normalize(sinalmidGamma, norm='l2', axis=0)
    #print("i --", i)
    #print("a --", a)
    #print("Intervalo", amostrasgsr.size)
    
    lda_delta     = pickle.load(open('dadosEEG//lda_eeg_delta.sav', 'rb'))
    lda_highAlpha = pickle.load(open('dadosEEG//lda_eeg_highAlpha.sav', 'rb'))
    lda_highBeta  = pickle.load(open('dadosEEG//lda_eeg_highBeta.sav', 'rb'))
    lda_lowAlpha  = pickle.load(open('dadosEEG//lda_eeg_lowAlpha.sav', 'rb'))
    lda_lowBeta   = pickle.load(open('dadosEEG//lda_eeg_lowBeta.sav', 'rb'))
    lda_lowGamma  = pickle.load(open('dadosEEG//lda_eeg_lowGamma.sav', 'rb'))
    lda_midGamma  = pickle.load(open('dadosEEG//lda_eeg_midGamma.sav', 'rb'))
    lda_theta     = pickle.load(open('dadosEEG//lda_eeg_theta.sav', 'rb'))
        
        # Classificador 
    classificador_svm_eeg = pickle.load(open('dadosEEG//svm_eeg_sinais.sav', 'rb'))
        
    a = lda_delta.transform(sinaldelta)
    b = lda_highAlpha.transform(sinalhighAlpha)
    c = lda_highBeta.transform(sinalhighBeta)
    d = lda_lowAlpha.transform(sinallowAlpha)
    e = lda_lowBeta.transform(sinallowBeta)
    f = lda_lowGamma.transform(sinallowGamma)
    g = lda_midGamma.transform(sinalmidGamma)
    h = lda_theta.transform(sinaltheta)

    dfc = a
    dfc = [np.append(dfc, b)]
    dfc = [np.append(dfc, c)]
    dfc = [np.append(dfc, d)]
    dfc = [np.append(dfc, e)]
    dfc = [np.append(dfc, f)]
    dfc = [np.append(dfc, g)]
    dfc = [np.append(dfc, h)]
    dfc = np.asarray(dfc)
    
    dfc = dfc.values
      
    EEG = classificador_svm_eeg.predict(dfc)
   
    classeEEG = ClassificadorEEG(sinaldelta, 
                                 sinalhighAlpha, sinalhighBeta,
                                 sinallowAlpha,  sinallowBeta,
                                 sinallowGamma,  sinalmidGamma,
                                 sinaltheta)
    EEG = classeEEG.classificador_eeg()
   
    print("Resultado EEG###:", EEG)
    
    i= i+500
    aa = aa+500

print("\nTESTE EEG FINALIZADO\n")
'''






