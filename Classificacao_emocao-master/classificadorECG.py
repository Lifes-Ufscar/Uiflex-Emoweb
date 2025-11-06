# -*- coding: utf-8 -*-  # Define a codificação do arquivo como UTF-8

class ClassificadorECG():
    # Classe responsável por classificar sinais de ECG (eletrocardiograma)
    
    def __init__(self, sinalECG):
        # Método de inicialização (construtor) da classe, responsável por receber e armazenar o sinal de ECG
        self.sinalECG = sinalECG  # Armazena o sinal ECG fornecido no objeto da classe

    def classificador_ecg(self):  
        import pickle  # Importa a biblioteca 'pickle' para carregar modelos pré-treinados salvos

        # Carrega o modelo LDA (Análise Discriminante Linear) para transformação do sinal ECG
        lda = pickle.load(open('dadosECG//lda_ecg.sav', 'rb'))
        
        # Carrega o classificador Naive Bayes (NB), treinado previamente para classificar o sinal ECG
        nb_ecg = pickle.load(open('dadosECG//nb_ecg.sav', 'rb'))

        # Aplica o modelo LDA no sinal de ECG, transformando os dados para uma representação apropriada para classificação
        novo_registro = lda.transform(self.sinalECG)
        
        # Utiliza o classificador Naive Bayes para prever a classe do sinal transformado
        resultados = nb_ecg.predict(novo_registro)
        #print(resultados, novo_registro, 'ECG')
        # Retorna os resultados da classificação
        return resultados
