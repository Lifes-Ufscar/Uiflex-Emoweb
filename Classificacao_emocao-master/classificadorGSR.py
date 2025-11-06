# -*- coding: utf-8 -*-  # Define a codificação do arquivo como UTF-8

# Define a classe para classificar sinais GSR
class ClassificadorGSR():

    # Método construtor, inicializa a classe com o sinal GSR
    def __init__(self, sinalGSR):
        self.sinalGSR = sinalGSR  # Armazena o sinal GSR fornecido como atributo da classe
     
    # Método responsável por realizar a classificação do sinal GSR
    def classificador_gsr(self):
        import pickle  # Importa a biblioteca pickle para carregar modelos serializados

        # Carrega o modelo LDA (Linear Discriminant Analysis) previamente treinado
        lda = pickle.load(open('dadosGSR//lda_gsr.sav', 'rb'))  # Abre o arquivo que contém o modelo LDA treinado para GSR
        
        # Carrega o classificador Naive Bayes (NB) previamente treinado
        nb_gsr = pickle.load(open('dadosGSR//nb_gsr.sav', 'rb'))  # Abre o arquivo que contém o classificador Naive Bayes treinado para GSR
        
        # Aplica a transformação LDA ao sinal GSR
        # O modelo LDA projeta os dados em um novo espaço de menor dimensionalidade, onde as classes são mais fáceis de separar
        novo_registro = lda.transform(self.sinalGSR)  # Transforma o sinal GSR usando o modelo LDA
        
        # Usa o classificador Naive Bayes para prever a classe do sinal transformado
        # O classificador NB toma como entrada o sinal transformado e faz a previsão da classe correspondente
        resultados = nb_gsr.predict(novo_registro)  # Faz a previsão do modelo com base no sinal transformado pelo LDA
        
        #print(resultados, novo_registro, 'GSR')
        # Retorna os resultados da previsão feita pelo classificador Naive Bayes
        return resultados
