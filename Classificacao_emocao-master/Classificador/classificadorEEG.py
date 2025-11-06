# -*- coding: utf-8 -*-

class ClassificadorEEG():
    
    def __init__(self, sinaldelta, 
                 sinalhighAlpha, sinalhighBeta, 
                 sinallowAlpha,  sinallowBeta, 
                 sinallowGamma,  sinalmidGamma, 
                 sinaltheta):
       
        self.sinaldelta     = sinaldelta
        self.sinalhighAlpha = sinalhighAlpha
        self.sinalhighBeta  = sinalhighBeta
        self.sinallowAlpha  = sinallowAlpha
        self.sinallowBeta   = sinallowBeta
        self.sinallowGamma  = sinallowGamma
        self.sinalmidGamma  = sinalmidGamma
        self.sinaltheta     = sinaltheta
        

    def classificador_eeg(self):
        import pickle
        import numpy as np 

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
        
        a = lda_delta.transform(self.sinaldelta)
        b = lda_highAlpha.transform(self.sinalhighAlpha)
        c = lda_highBeta.transform(self.sinalhighBeta)
        d = lda_lowAlpha.transform(self.sinallowAlpha)
        e = lda_lowBeta.transform(self.sinallowBeta)
        f = lda_lowGamma.transform(self.sinallowGamma)
        g = lda_midGamma.transform(self.sinalmidGamma)
        h = lda_theta.transform(self.sinaltheta)

        dfc = a
        dfc = [np.append(dfc, b)]
        dfc = [np.append(dfc, c)]
        dfc = [np.append(dfc, d)]
        dfc = [np.append(dfc, e)]
        dfc = [np.append(dfc, f)]
        dfc = [np.append(dfc, g)]
        dfc = [np.append(dfc, h)]
      
        resultados = classificador_svm_eeg.predict(dfc)
        return resultados