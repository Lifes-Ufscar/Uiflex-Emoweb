# -*- coding: utf-8 -*-

class ClassificadorECG():
    
    def __init__(self, sinalECG):
        self.sinalECG = sinalECG

       
    def classificador_ecg(self):       
        import pickle

        lda = pickle.load(open('dadosECG//lda_ecg.sav', 'rb'))
        
        # Classificador
        nb_ecg = pickle.load(open('dadosECG//nb_ecg.sav', 'rb'))

        novo_registro = lda.transform(self.sinalECG)
        resultados    = nb_ecg.predict(novo_registro)
        return resultados