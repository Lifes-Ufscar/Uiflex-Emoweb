# -*- coding: utf-8 -*-
import pickle
class ClassificadorGSR():

    def __init__(self, sinalGSR):
        self.sinalGSR = sinalGSR
     

    def classificador_gsr(self):
        import pickle

        lda = pickle.load(open('dadosGSR//lda_gsr.sav', 'rb'))
        
        # Classificador
        nb_gsr = pickle.load(open('dadosGSR//nb_gsr.sav', 'rb'))
        
        novo_registro = lda.transform(self.sinalGSR)
        resultados    = nb_gsr.predict(novo_registro)
        return resultados