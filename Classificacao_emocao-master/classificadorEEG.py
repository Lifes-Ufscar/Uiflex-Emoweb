# -*- coding: utf-8 -*-

class ClassificadorEEG():
    def __init__(self, sinaldelta, sinallowAlpha,  sinallowBeta, sinalmidGamma,sinaltheta):
        # O construtor recebe sinais de diferentes bandas de frequência EEG
        self.sinaldelta     = sinaldelta     # Sinal da banda Delta
        self.sinallowAlpha  = sinallowAlpha  # Sinal da banda Low Alpha
        self.sinallowBeta   = sinallowBeta   # Sinal da banda Low Beta
        self.sinalmidGamma  = sinalmidGamma  # Sinal da banda Mid Gamma
        self.sinaltheta     = sinaltheta     # Sinal da banda Theta

        
    def classificador_eeg(self):
            import pickle
            import numpy as np  # Importa numpy para manipulação de arrays

            # Carrega os modelos LDA para cada banda de frequência EEG
            lda_delta     = pickle.load(open('dadosEEG//lda_eeg_delta.sav', 'rb'))
            lda_lowAlpha  = pickle.load(open('dadosEEG//lda_eeg_lowAlpha.sav', 'rb'))
            lda_lowBeta   = pickle.load(open('dadosEEG//lda_eeg_lowBeta.sav', 'rb'))
            lda_midGamma  = pickle.load(open('dadosEEG//lda_eeg_midGamma.sav', 'rb'))
            lda_theta     = pickle.load(open('dadosEEG//lda_eeg_theta.sav', 'rb'))

            # Carrega o classificador SVM pré-treinado
            classificador_svm_eeg = pickle.load(open('dadosEEG//svm_eeg_sinais.sav', 'rb'))

            
            # Aplica a transformação LDA para cada banda de frequência
            a = lda_delta.transform(self.sinaldelta.reshape(-1, 1))
            d = lda_lowAlpha.transform(self.sinallowAlpha.reshape(-1, 1))
            e = lda_lowBeta.transform(self.sinallowBeta.reshape(-1, 1))
            g = lda_midGamma.transform(self.sinalmidGamma.reshape(-1, 1))
            h = lda_theta.transform(self.sinaltheta.reshape(-1, 1))



            # Combina todas as transformações LDA em um único array
            dfc = a  # Começa com a transformação da banda Delta
            dfc = [np.append(dfc, d)]  # Adiciona a banda Low Alpha
            dfc = [np.append(dfc, e)]  # Adiciona a banda Low Beta
            dfc = [np.append(dfc, g)]  # Adiciona a banda Mid Gamma
            dfc = [np.append(dfc, h)]  # Adiciona a banda Theta

    

            # Classificação usando o modelo SVM
            resultados = classificador_svm_eeg.predict(dfc)
            return resultados