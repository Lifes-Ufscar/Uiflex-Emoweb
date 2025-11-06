from NeuroPy import NeuroPy  # Importa a biblioteca NeuroPy para capturar sinais do dispositivo MindWave
from Planilha import Amostra  # Importa a classe 'Amostra' para manipular planilhas e registrar os dados
import serial  # Biblioteca para comunicação serial (no caso, com o Arduino)
import time  # Biblioteca para manipulação de tempo, usada para pausas e capturar a duração
import datetime  # Biblioteca para obter timestamps detalhados, incluindo horas, minutos, segundos e milissegundos

class CapturaSinais():
    # Classe responsável por capturar sinais do MindWave e sensores conectados ao Arduino

    def __init__(self):
        # Método de inicialização do objeto (construtor)
        
        # Porta COM do MindWave USB Adapter
        self.mindWave = NeuroPy("COM13")  # Inicializa a conexão com o MindWave via a porta COM13
        self.mindWave.start()  # Inicia a captura de sinais do MindWave
        
        # Informativo para o usuário sobre a inicialização do NeuroPy
        print("\n- NeuroPY inicializado")
        time.sleep(1)  # Pausa de 1 segundo para garantir que o MindWave esteja pronto antes de continuar

        # Porta COM do Arduino
        # Abre porta serial para comunicação com o Arduino, definindo a porta COM e a taxa de transmissão (baudrate) como 9600
        self.arduino = serial.Serial("COM15", "9600")
        
        # Informativo para o usuário sobre a abertura da porta serial do Arduino
        print("- Porta serial aberta")
        time.sleep(1)  # Pausa de 1 segundo para garantir que a comunicação serial esteja pronta

    def captura_sensores(self, usuario, sessao_id, filme_id):
        # Método responsável pela captura dos sinais dos sensores
        
        ecg = " "  # Variável para armazenar o sinal ECG (eletrocardiograma)
        gsr = " "  # Variável para armazenar o sinal GSR (condutância da pele)
        contador = 1  # Contador para controlar o número de leituras
        coluna = 1  # Índice de coluna para inserção de dados na planilha

        # Inicializa o objeto 'Amostra' para armazenar os dados em uma planilha
        # Argumentos: usuário, sessão, e ID do filme que está sendo analisado
        planilha = Amostra(usuario, sessao_id, filme_id)

        # Setagem de intervalo de captura
        # Define o tempo de captura para 100 loops (representando aproximadamente 10 segundos)
        delay = 100 * 1  # 1 loop de 10 segundos
        duracao = time.time() + delay  # Define a duração total da captura em função do tempo atual mais o delay

        # Aviso de que a captura vai começar
        print("Captura do usuario " + usuario.upper() + " vai comecar em 1 segundo\n")
        time.sleep(1)  # Pausa de 1 segundo antes de iniciar a captura

        # Loop de captura até o tempo definido ser atingido
        while (time.time() < duracao):
            # Captura o tempo exato da leitura no formato horas:minutos:segundos.microsegundos
            tempo = datetime.datetime.now().strftime("%H:%M:%S.%f")
            
            # Lê uma linha da porta serial, onde estão os dados dos sensores GSR e ECG
            serial = self.arduino.readline()

            # Separar os dados dos dois sensores (GSR e ECG)
            if "GSR" in serial:
                aux = serial  # Se a linha contém "GSR", armazena em 'aux'
                gsr = aux.replace("GSR", "")  # Remove a string "GSR" e mantém apenas os valores numéricos
            else:
                aux = serial  # Se não contém "GSR", assume que é ECG
                ecg = aux.replace("ECG", "")  # Remove a string "ECG" e mantém os valores numéricos

            # Imprime no terminal as leituras do MindWave e dos sensores GSR e ECG
            # Inclui sinais como atenção, meditação, valores crus, delta, theta, alpha, beta, gamma, além de sinais de GSR, ECG e o timestamp
            print(contador,
                  self.mindWave.attention,
                  self.mindWave.meditation,
                  self.mindWave.rawValue,
                  self.mindWave.delta,
                  self.mindWave.theta,
                  self.mindWave.lowAlpha,
                  self.mindWave.highAlpha,
                  self.mindWave.lowBeta,
                  self.mindWave.highBeta,
                  self.mindWave.lowGamma,
                  self.mindWave.midGamma,
                  self.mindWave.poorSignal,
                  self.mindWave.blinkStrength,
                  gsr,
                  ecg,
                  tempo)

            # Grava os dados lidos em uma planilha Excel usando o método 'escrita_xlsx' da classe 'Amostra'
            # Inclui a coluna, o contador (linha), os sinais do MindWave, GSR, ECG e o timestamp
            planilha.escrita_xlsx(coluna, contador, self.mindWave, gsr, ecg, tempo)

            coluna += 1  # Atualiza a coluna para a próxima inserção de dados
            contador += 1  # Incrementa o contador de amostras

        # Fecha a planilha Excel após o fim da captura de dados
        planilha.fecha_xlsx()

        # Retorna o número total de leituras capturadas
        return contador
